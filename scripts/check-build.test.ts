import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkBuildFiles, checkLiveBuild } from './check-build.mjs';

afterEach(() => { vi.unstubAllGlobals(); });

function files(extra: Record<string, string>) {
  return new Map(Object.entries({ 'index.html': '<script type="module" src="/assets/main.js"></script>',
    'assets/main.js': 'import("./auth.js")', ...extra }));
}

describe('emitted build integrity', () => {
  it('rejects the production failure: a trailing CSS-only JS import with no semicolon', async () => {
    await expect(checkBuildFiles(files({ 'assets/auth.js': 'import"./style-missing.js"' })))
      .rejects.toThrow('assets/auth.js: missing assets/style-missing.js');
  });
  it('checks lazy imports, re-exports, HTML entry points, and preload CSS', async () => {
    for (const source of ['import("./missing.js")', 'export * from "./missing.js"', 'const preload=["assets/missing.css"]']) {
      await expect(checkBuildFiles(files({ 'assets/auth.js': source }))).rejects.toThrow('missing');
    }
    await expect(checkBuildFiles(new Map([['index.html', '<script src="/missing.js"></script>']])))
      .rejects.toThrow('missing.js');
  });
  it('accepts complete code-split builds, cycles and inline/external CSS assets', async () => {
    await expect(checkBuildFiles(files({
      'assets/auth.js': 'import "./main.js"; const preload=["assets/style.css"];',
      'assets/style.css': 'a{background:url(data:image/png;base64,AA)}b{background:url(https://example.com/a.png)}',
    }))).resolves.toBeUndefined();
  });

  it('rejects HTTP 200 HTML fallbacks and stale JavaScript on the live site', async () => {
    const output = new Map([['assets/auth.js', Buffer.from('export{}')]]);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>Home</html>', { headers: { 'content-type': 'text/html' } })));
    await expect(checkLiveBuild(output, 'https://example.com')).rejects.toThrow('unexpected content type');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('old code', { headers: { 'content-type': 'text/javascript' } })));
    await expect(checkLiveBuild(output, 'https://example.com')).rejects.toThrow('live bytes differ');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('export{}', { headers: { 'content-type': 'text/javascript' } })));
    await expect(checkLiveBuild(output, 'https://example.com')).resolves.toBeUndefined();
  });
});
