# Auth CTA module-loading failure — 2026-09-08

The landing CTA reached `/auth`, but the deployed auth chunk imported
`style-BEvKdtB2.js`, which did not exist. The canvas editor had the same import.
Cloudflare's SPA fallback returned `index.html` with HTTP 200 for that URL;
browsers correctly refused to execute HTML as JavaScript.

The production build combined `build.minify: false` with enabled
`rolldownOptions.output.minify`. Vite 8.2.2's pure-CSS chunk cleanup left trailing
side-effect imports without semicolons in the emitted code while deleting the
corresponding JavaScript placeholder. Setting `build.minify: 'oxc'` aligns Vite
with its configured minifier and removes the dangling imports. Console/debugger
removal and CSS code splitting remain enabled. No package upgrades or generated
JavaScript patches were needed.

## Regression coverage

- `npm run build` now ends with `npm run check:build`; CI and `npm run deploy`'s
  predeploy build inherit this gate. It parses actual emitted JavaScript imports
  (including lazy imports and re-exports), HTML links, preload paths, and CSS URLs.
  The old build fails this check for both auth and canvas.
- `npm run check:build -- https://saas.game` checks all built files against live
  HTTP responses, including JavaScript/CSS MIME types and byte-for-byte equality.
  HTTP 200 alone is insufficient. Run this after every release.
- A dependency-light, eager root error boundary now covers landing, auth, and
  game routes. Tests inject lazy-load failures through the real route definitions
  and verify recovery controls, heading focus, and no raw error/stack disclosure.
- Reload is explicit, never automatic: an error on the whiteboard must not
  silently discard unsaved edits. Return home performs full navigation so a
  cached lazy-import rejection does not trap the user.

The previous smoke checks covered only entry assets, not the entire imported
dependency graph. This incident is why emitted-code and live-file verification
are now release requirements. Browser pointer/touch testing remains separate.
