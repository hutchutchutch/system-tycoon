// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { router } from '../router';
import { ErrorPage } from './ErrorPage';

vi.mock('./auth/AuthFlowPage', () => ({ get AuthFlowPage() { throw new TypeError('Failed to fetch dynamically imported module: https://saas.game/assets/AuthFlowPage-broken.js'); } }));
vi.mock('./auth/ResetPasswordPage', () => ({ get ResetPasswordPage() { throw new TypeError('Failed to fetch dynamically imported module: https://saas.game/assets/ResetPasswordPage-broken.js'); } }));

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let memoryRouter: ReturnType<typeof createMemoryRouter>;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  memoryRouter?.dispose();
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('route error recovery', () => {
  it.each(['/auth', '/auth/reset-password'])('catches a real lazy module rejection at %s', async (path) => {
    memoryRouter = createMemoryRouter(router.routes, { initialEntries: [path] });
    await act(async () => { root.render(createElement(RouterProvider, { router: memoryRouter })); });
    expect(container.textContent).toContain('This page couldn’t load');
    expect(container.textContent).not.toContain('Unexpected Application Error');
    expect(container.textContent).not.toContain('https://saas.game/assets/');
    expect(container.querySelector('button')?.textContent).toBe('Reload page');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(document.activeElement).toBe(container.querySelector('h1'));
  });

  it('does not expose raw application errors', async () => {
    memoryRouter = createMemoryRouter([{ path: '/', element: createElement('div'), hydrateFallbackElement: createElement('div'), loader: () => { throw new Error('private backend detail'); }, errorElement: createElement(ErrorPage) }]);
    await act(async () => { root.render(createElement(RouterProvider, { router: memoryRouter })); });
    expect(container.textContent).toContain('Something went wrong');
    expect(container.textContent).not.toContain('private backend detail');
  });

  it('keeps missing-page recovery distinct from a failed module', async () => {
    memoryRouter = createMemoryRouter([{ path: '*', element: createElement(ErrorPage) }], { initialEntries: ['/missing'] });
    await act(async () => { root.render(createElement(RouterProvider, { router: memoryRouter })); });
    expect(container.textContent).toContain('Page not found');
    expect(container.textContent).not.toContain('500');
  });
});
