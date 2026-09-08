import { readdir, readFile } from 'node:fs/promises';
import { resolve, posix } from 'node:path';
import { pathToFileURL } from 'node:url';
import { init, parse } from 'es-module-lexer';

// Inspect emitted code, not just bundler metadata: CSS extraction can remove a
// chunk from the metadata while accidentally leaving its import in JavaScript.
export async function checkBuildFiles(files) {
  await init;
  const errors = [];
  function checkReference(importer, reference, module = false) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return;
    if (module && !reference.startsWith('.') && !reference.startsWith('/')) {
      errors.push(`${importer}: unresolved bare import ${reference}`);
      return;
    }
    const path = decodeURIComponent(reference.split(/[?#]/)[0]);
    const target = posix.normalize(path.startsWith('/') ? path.slice(1) : posix.join(posix.dirname(importer), path));
    if (!files.has(target)) errors.push(`${importer}: missing ${target}`);
  }
  if (!files.has('index.html')) errors.push('Missing index.html');
  for (const [name, bytes] of files) {
    const source = bytes.toString();
    if (/\.[cm]?js$/.test(name)) {
      const [imports] = parse(source, name);
      for (const dependency of imports) {
        if (dependency.n !== undefined) checkReference(name, dependency.n, true);
      }
      // Vite's generated preload lists use root-relative assets/ paths.
      for (const match of source.matchAll(/["'](\/?assets\/[^"']+)["']/g)) {
        checkReference('index.html', match[1]);
      }
    } else if (name.endsWith('.html')) {
      for (const match of source.matchAll(/(?:src|href)=["']([^"']+)["']/g)) checkReference(name, match[1]);
    } else if (name.endsWith('.css')) {
      for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) checkReference(name, match[1].trim());
    }
  }
  if (errors.length) throw new Error(`Build integrity failed:\n${[...new Set(errors)].join('\n')}`);
}

export async function readBuild(directory) {
  const files = new Map();
  async function visit(relative = '') {
    for (const entry of await readdir(resolve(directory, relative), { withFileTypes: true })) {
      const name = posix.join(relative, entry.name);
      if (entry.isDirectory()) await visit(name);
      else if (entry.isFile()) files.set(name, await readFile(resolve(directory, name)));
    }
  }
  await visit();
  return files;
}

export async function checkLiveBuild(files, origin) {
  const entries = [...files];
  // Bound concurrency and compare bytes as well as status/MIME: a SPA fallback
  // can return HTTP 200 for a missing module, and caches can serve older bytes.
  for (let offset = 0; offset < entries.length; offset += 4) {
    await Promise.all(entries.slice(offset, offset + 4).map(async ([name, bytes]) => {
      const response = await fetch(new URL(name, `${origin.replace(/\/$/, '')}/`), {
        signal: AbortSignal.timeout(20_000),
      });
      const type = response.headers.get('content-type') || '';
      if (!response.ok || (/\.js$/.test(name) && !/javascript/.test(type))
        || (/\.css$/.test(name) && !/text\/css/.test(type))) {
        throw new Error(`${name}: HTTP ${response.status}, unexpected content type ${type}`);
      }
      if (!bytes.equals(Buffer.from(await response.arrayBuffer()))) throw new Error(`${name}: live bytes differ from build`);
    }));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const files = await readBuild(resolve('dist'));
  await checkBuildFiles(files);
  console.log(`Build integrity passed: ${files.size} files; emitted imports and asset references resolve.`);
  const liveUrl = process.argv[2];
  if (liveUrl) {
    await checkLiveBuild(files, liveUrl);
    console.log(`Live build passed: all ${files.size} files match ${liveUrl}.`);
  }
}
