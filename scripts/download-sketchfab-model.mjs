#!/usr/bin/env node
/**
 * Download a free Sketchfab model (glTF zip) into public/models/.
 * Requires SKETCHFAB_API_TOKEN — see public/models/trong-dong/README.md
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile, copyFile, rm, readdir, cp } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const MODELS = [
  {
    uid: 'c91e55f6db8742f09ad2d5815ca6b749',
    outDir: join(ROOT, 'public/models/trong-dong'),
    outFile: 'dong-son-drum.glb',
    name: 'Trống Đồng Đông Sơn',
  },
  {
    uid: '4450069fee444ae0920aa5babd5d9239',
    outDir: join(ROOT, 'public/models/tu-vung-hoi-an/lantern'),
    outFile: 'paper-lantern.glb',
    name: 'Japanese paper lantern (Hội An)',
  },
  {
    uid: '80f501c8b7754f43a06c7463bb34419b',
    outDir: join(ROOT, 'public/models/tinh-nham-trang-ti'),
    outFile: 'trex.glb',
    name: 'Low Poly T Rex (Walk Cycle) — Jerome Angeles',
  },
  {
    uid: 'c92be549c8194136914883309a13a6b5',
    outDir: join(ROOT, 'public/models/cuu-chuong-van-mieu'),
    outFile: 'turtle.glb',
    name: 'Sea turtle low poly',
  },
  {
    uid: 'e6758a6e5b0e44918bdad7fa19a39814',
    outDir: join(ROOT, 'public/models/trang-nguyen-toan'),
    outFile: 'mech.glb',
    name: 'Low Poly Mech',
  },
  {
    uid: '8a22e9c369d64a329c67e9a355064b2c',
    outDir: join(ROOT, 'public/models/tu-vung-hoi-an/boat'),
    outFile: 'fishing-boat.glb',
    name: 'Fishing Boat',
  },
  {
    uid: 'c071665dc11846ffb69665411cbad428',
    outDir: join(ROOT, 'public/models/tham-hiem-cuu-long/crossbow'),
    outFile: 'crossbow.glb',
    name: 'Crossbow (Minecraft) — Kosha_',
  },
  {
    uid: 'e63063d93b894b42952277574bb7860d',
    outDir: join(ROOT, 'public/models/but-sen-viet'),
    outFile: 'pen.glb',
    name: 'Low poly pen — VertexKiller (CC BY)',
  },
];

const HINH_HOC_PROPS = join(ROOT, 'public/models/hinh-hoc-thang-long/props');
const hinhHocManifest = JSON.parse(
  readFileSync(join(__dirname, 'data/hinh-hoc-sketchfab.json'), 'utf8')
);
const HINH_HOC_MODELS = hinhHocManifest.map((entry) => ({
  uid: entry.uid,
  outDir: join(HINH_HOC_PROPS, entry.id),
  outFile: `${entry.id}.glb`,
  name: `Hình học ${entry.id}: ${entry.name}`,
  tags: ['hinh-hoc'],
  entry,
}));

const ALL_MODELS = [...MODELS, ...HINH_HOC_MODELS];

const token = process.env.SKETCHFAB_API_TOKEN?.trim();
if (!token) {
  console.error('Set SKETCHFAB_API_TOKEN (Sketchfab → Settings → Password → API token).');
  process.exit(1);
}

const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length)?.trim().toLowerCase();
const skipExisting = !process.argv.includes('--force');

const apiHeaders = {
  Authorization: `Token ${token}`,
  Accept: 'application/json',
  'User-Agent': 'KVPrimaryFunLearning/1.0 (fetch:models)',
};

function matchesFilter(m) {
  if (!onlyArg) return true;
  if (onlyArg === 'hinh-hoc') return m.tags?.includes('hinh-hoc');
  const hay = `${m.name} ${m.outDir} ${m.outFile} ${m.uid} ${m.entry?.id ?? ''}`.toLowerCase();
  return hay.includes(onlyArg);
}

const CURL_BASE = ['-4', '-sS', '--fail', '--connect-timeout', '30'];

/** curl -4 — tránh timeout IPv6 của Node fetch tới api.sketchfab.com trên một số mạng. */
function curlToFile(url, outPath, extraArgs = []) {
  execFileSync('curl', [...CURL_BASE, '--max-time', '180', ...extraArgs, '-o', outPath, url], {
    stdio: 'pipe',
  });
}

function curlSketchfabJson(url) {
  const tmp = join(ROOT, '_sketchfab_meta.json');
  curlToFile(url, tmp, [
    '-H',
    `Authorization: Token ${token}`,
    '-H',
    'Accept: application/json',
    '-H',
    `User-Agent: ${apiHeaders['User-Agent']}`,
  ]);
  const text = readFileSync(tmp, 'utf8');
  return JSON.parse(text);
}

function modelAlreadyPresent(outDir, outFile) {
  if (existsSync(join(outDir, outFile))) return join(outDir, outFile);
  if (existsSync(join(outDir, 'scene.gltf'))) return join(outDir, 'scene.gltf');
  return null;
}

async function writeLicense(outDir, uid, entry) {
  let name = entry?.name ?? 'Sketchfab model';
  let author = entry?.author ?? 'Sketchfab author';
  let license = entry?.license ?? 'CC Attribution';
  try {
    const info = curlSketchfabJson(`https://api.sketchfab.com/v3/models/${uid}`);
    name = info.name ?? name;
    author = info.user?.username ? `https://sketchfab.com/${info.user.username}` : author;
    license = info.license?.label ?? license;
  } catch {
    /* keep manifest fields */
  }
  const text = `Model Information:
* title:	${name}
* source:	https://sketchfab.com/3d-models/${uid}
* author:	${author}

Model License:
* license type:	${license}
* requirements:	Author must be credited per Sketchfab / Creative Commons terms.

Game: Hình Học Thăng Long (builder ${entry?.id ?? '—'})
`;
  await writeFile(join(outDir, 'license.txt'), text, 'utf8');
}

async function downloadOne({ uid, outDir, outFile, name, entry }) {
  const existing = skipExisting ? modelAlreadyPresent(outDir, outFile) : null;
  if (existing) {
    console.log(`\n→ ${name ?? uid}\n  skip (exists): ${existing}`);
    return;
  }

  console.log(`\n→ ${name ?? uid}`);
  let meta;
  try {
    meta = curlSketchfabJson(`https://api.sketchfab.com/v3/models/${uid}/download`);
  } catch (err) {
    const hint =
      err instanceof Error && /403|CloudFront/i.test(String(err.message))
        ? '\n  Hint: Sketchfab API blocked. Check token or VPN.'
        : '';
    throw new Error(`Download API failed: ${err instanceof Error ? err.message : err}${hint}`);
  }
  const archiveUrl =
    meta.gltf?.url ?? meta.glb?.url ?? meta.source?.url ?? meta.usdz?.url;
  if (!archiveUrl) throw new Error('No gltf/glb URL in download response');

  const zipPath = join(outDir, '_sketchfab.zip');
  const extractDir = join(outDir, '_sketchfab_extract');
  await mkdir(outDir, { recursive: true });
  curlToFile(archiveUrl, zipPath, ['--max-time', '300', '-L']);

  await rm(extractDir, { recursive: true, force: true });
  await mkdir(extractDir, { recursive: true });
  execSync(`unzip -o -q "${zipPath}" -d "${extractDir}"`);

  const glb = await findFile(extractDir, '.glb');
  if (glb) {
    await copyFile(glb, join(outDir, outFile));
    console.log('Saved', join(outDir, outFile));
  } else {
    const gltf = await findFile(extractDir, '.gltf');
    if (!gltf) throw new Error('No .glb or .gltf in archive');
    const gltfRoot = dirname(gltf);
    await clearModelArtifacts(outDir);
    await copyPackage(gltfRoot, outDir);
    console.log('Saved glTF package to', outDir, `(entry: ${basename(gltf)})`);
  }

  await rm(zipPath, { force: true });
  await rm(extractDir, { recursive: true, force: true });
  await writeLicense(outDir, uid, entry);
}

async function clearModelArtifacts(outDir) {
  const keep = new Set(['README.md']);
  const entries = await readdir(outDir, { withFileTypes: true });
  for (const e of entries) {
    if (keep.has(e.name) || e.name.startsWith('_sketchfab')) continue;
    await rm(join(outDir, e.name), { recursive: true, force: true });
  }
}

async function copyPackage(srcDir, destDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const from = join(srcDir, e.name);
    const to = join(destDir, e.name);
    if (e.isDirectory()) {
      await cp(from, to, { recursive: true });
    } else {
      await copyFile(from, to);
    }
  }
}

async function findFile(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      const nested = await findFile(p, ext);
      if (nested) return nested;
    } else if (e.name.toLowerCase().endsWith(ext)) {
      return p;
    }
  }
  return null;
}

const queue = ALL_MODELS.filter(matchesFilter);
if (queue.length === 0) {
  console.error(`No models match --only=${onlyArg ?? '(none)'}`);
  process.exit(1);
}

let failed = 0;
for (const m of queue) {
  try {
    await downloadOne(m);
  } catch (err) {
    failed++;
    const detail =
      err instanceof Error
        ? err.stderr
          ? `${err.message}\n${String(err.stderr)}`
          : err.message
        : String(err);
    console.error(`  ✗ ${m.name ?? m.uid}:`, detail.slice(0, 500));
  }
}

if (failed > 0) {
  console.error(`\n${failed} download(s) failed.`);
  process.exit(1);
}
console.log('\nDone.');
