// Resumable, non-destructive deploy of out/ to wieczorpanienskiwarszawa.pl (seohost).
// Skips files already present remotely with matching size, reconnects on drops,
// and uploads .htaccess LAST so the new index/redirects only flip on when complete.
import { Client } from 'basic-ftp';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, posix } from 'node:path';
import { Readable } from 'node:stream';

function env() {
  const txt = readFileSync(new URL('../.secrets/CREDENTIALS.env.template', import.meta.url), 'utf8');
  const e = {};
  for (const line of txt.split(/\r?\n/)) { const m = line.match(/^([A-Z_]+)=(.*)$/); if (m) e[m[1]] = m[2].trim(); }
  return e;
}
const e = env();
const ROOT = e.FTP_REMOTE_DIR.replace(/\/$/, '');
const outDir = new URL('../out/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/\/$/, '');

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

// All files except .htaccess (handled last), with remote path + size.
const all = walk(outDir)
  .map((f) => ({ local: f, rel: relative(outDir, f).split('\\').join('/'), size: statSync(f).size }))
  .filter((f) => f.rel !== '.htaccess');

async function connect(client, secure) {
  await client.access({ host: e.FTP_HOST, user: e.FTP_USER, password: e.FTP_PASS, port: Number(e.FTP_PORT) || 21, secure, secureOptions: { rejectUnauthorized: false } });
}
async function fresh() {
  const c = new Client(60000);
  c.ftp.verbose = false;
  try { await connect(c, true); } catch { await connect(c, false); }
  return c;
}

let client = await fresh();
console.log('Connected. Resumable deploy →', ROOT);

let uploaded = 0, skipped = 0, done = 0;
for (const f of all) {
  const remote = posix.join(ROOT, f.rel);
  // HTML pages and Next route-data (.txt) keep stable names but change content,
  // so size matching is unsafe (a same-length edit would be skipped, leaving
  // stale references to renamed JS chunks). Always re-upload those; only skip
  // content-hashed/static assets (_next/static, media, frames) by size.
  const alwaysUpload = f.rel.endsWith(".html") || f.rel.endsWith(".txt");
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      if (!alwaysUpload) {
        let remoteSize = -1;
        try { remoteSize = await client.size(remote); } catch {}
        if (remoteSize === f.size) { skipped++; break; }
      }
      await client.ensureDir(posix.dirname(remote));
      await client.uploadFrom(f.local, posix.basename(remote));
      await client.cd(ROOT);
      uploaded++;
      break;
    } catch (err) {
      if (attempt === 4) { console.error('FAILED:', f.rel, err.message); throw err; }
      console.log(`  reconnect (${f.rel}, attempt ${attempt}): ${err.message}`);
      try { client.close(); } catch {}
      client = await fresh();
    }
  }
  if (++done % 40 === 0) console.log(`  ${done}/${all.length} (uploaded ${uploaded}, skipped ${skipped})`);
}

// Flip on: upload .htaccess last.
const htaccess = readFileSync(join(outDir, '.htaccess'));
await client.cd(ROOT);
await client.uploadFrom(Readable.from(htaccess), '.htaccess');
console.log(`\n✅ Deploy complete. Uploaded ${uploaded}, skipped ${skipped} (already present). .htaccess flipped on.`);
client.close();
