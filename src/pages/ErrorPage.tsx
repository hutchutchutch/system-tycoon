import { useEffect, useRef } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// Eager and dependency-light: recovery must not need the module that failed.
export function ErrorPage() {
  const error = useRouteError();
  const heading = useRef<HTMLHeadingElement>(null);
  const notFound = error == null || (isRouteErrorResponse(error) && error.status === 404);
  const loadFailed = error instanceof Error && /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(error.message);
  const title = notFound ? 'Page not found' : loadFailed ? 'This page couldn’t load' : 'Something went wrong';
  const message = notFound
    ? 'This address doesn’t lead to a page. Return home to continue.'
    : loadFailed
      ? 'A required part of the app didn’t load. Check your connection, then reload to try again.'
      : 'We couldn’t finish opening this page. Reload to try again, or return home.';

  useEffect(() => { heading.current?.focus(); }, []);

  return (
    <main aria-labelledby="page-error-title" className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col items-center justify-center gap-5 px-6 py-12 text-center">
      <p className="text-sm text-slate-400">Service as a Software</p>
      <h1 id="page-error-title" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">{title}</h1>
      <p className="max-w-md text-slate-300">{message}</p>
      {!notFound && <p className="max-w-md text-sm text-slate-400">Reloading may discard changes that haven’t been saved.</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {!notFound && (
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-md bg-blue-600 px-5 py-3 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">
            Reload page
          </button>
        )}
        {/* Full navigation clears cached React.lazy rejections too. */}
        <a href="/" className="min-h-11 rounded-md border border-slate-600 px-5 py-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">Return home</a>
      </div>
    </main>
  );
}
