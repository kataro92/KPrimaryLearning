#!/usr/bin/env node
/**
 * Download a free Sketchfab model (glTF zip) into public/models/.
 * Requires SKETCHFAB_API_TOKEN — see public/models/trong-dong/README.md
 */
import { mkdir, writeFile, copyFile, rm, readdir, cp } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

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
    outDir: join(ROOT, 'public/models/tu-vung-hoi-an'),
    outFile: 'paper-lantern.glb',
    name: 'Japanese paper lantern (Hội An)',
  },
  {
    uid: '02e50ee6abc2456985944989a26d89b7',
    outDir: join(ROOT, 'public/models/tinh-nham-trang-ti'),
    outFile: 'trex.glb',
    name: 'Low-poly T-rex',
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
    outDir: join(ROOT, 'public/models/tu-vung-hoi-an'),
    outFile: 'fishing-boat.glb',
    name: 'Fishing Boat',
  },
];

const token = process.env.SKETCHFAB_API_TOKEN?.trim();
if (!token) {
  console.error('Set SKETCHFAB_API_TOKEN (Sketchfab → Settings → Password → API token).');
  process.exit(1);
}

async function downloadOne({ uid, outDir, outFile, name }) {
  console.log(`\n→ ${name ?? uid}`);
  const metaRes = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!metaRes.ok) {
    throw new Error(`Download API ${metaRes.status}: ${await metaRes.text()}`);
  }
  const meta = await metaRes.json();
  const archiveUrl = meta.gltf?.url ?? meta.glb?.url;
  if (!archiveUrl) throw new Error('No gltf/glb URL in download response');

  const zipRes = await fetch(archiveUrl);
  if (!zipRes.ok) throw new Error(`Archive fetch ${zipRes.status}`);
  const zipPath = join(outDir, '_sketchfab.zip');
  const extractDir = join(outDir, '_sketchfab_extract');
  await mkdir(outDir, { recursive: true });
  await writeFile(zipPath, Buffer.from(await zipRes.arrayBuffer()));

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

for (const m of MODELS) {
  await downloadOne(m);
}
