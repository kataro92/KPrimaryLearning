#!/usr/bin/env node
/**
 * Download looping BGM (OGG) from soundimage.org into public/audio/bgm/.
 * Eric Matyas — CC BY 4.0 — https://soundimage.org
 *
 * Usage: node scripts/download-bgm.mjs [--only=dao-duc-nhi]
 */
import { mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public/audio/bgm');
const BASE = 'https://soundimage.org/wp-content/uploads/2025/10';

/** Upbeat / playful tracks for primary learners (looping OGG on soundimage.org). */
const TRACKS = [
  {
    gameId: 'dao-duc-nhi',
    outFile: 'dao-duc-nhi.ogg',
    source: 'Good-Morning-Doctor-Weird.ogg',
    title: 'Good Morning Doctor Weird',
  },
  {
    gameId: 'doc-hieu-su-viet',
    outFile: 'doc-hieu-su-viet.ogg',
    source: 'Puzzle-Dreams.ogg',
    title: 'Puzzle Dreams',
  },
  {
    gameId: 'hanh-trinh-su-dia',
    outFile: 'hanh-trinh-su-dia.ogg',
    source: 'Cool-Adventure-Intro.ogg',
    title: 'Cool Adventure Intro',
  },
  {
    gameId: 'but-sen-viet',
    outFile: 'but-sen-viet.ogg',
    source: 'Fishbowl-Circus.ogg',
    title: 'Fishbowl Circus',
  },
  {
    gameId: 'trong-dong',
    outFile: 'trong-dong.ogg',
    source: 'Monkey-Drama.ogg',
    title: 'Monkey Drama',
  },
  {
    gameId: 'hinh-hoc-thang-long',
    outFile: 'hinh-hoc-thang-long.ogg',
    source: 'Whimsical-Popsicle.ogg',
    title: 'Whimsical Popsicle',
  },
  {
    gameId: 'cuu-chuong-van-mieu',
    outFile: 'cuu-chuong-van-mieu.ogg',
    source: 'Monkey-Island-Band_Looping.ogg',
    title: 'Monkey Island Band',
  },
  {
    gameId: 'tham-hiem-cuu-long',
    outFile: 'tham-hiem-cuu-long.ogg',
    source: 'Arcade-Fantasy.ogg',
    title: 'Arcade Fantasy',
  },
  {
    gameId: 'trang-nguyen-toan',
    outFile: 'trang-nguyen-toan.ogg',
    source: 'Arcade-Adventures_Looping.ogg',
    title: 'Arcade Adventures',
  },
  {
    gameId: 'tinh-nham-trang-ti',
    outFile: 'tinh-nham-trang-ti.ogg',
    source: 'Coin-Op-Chaos_Looping.ogg',
    title: 'Coin-Op Chaos',
  },
  {
    gameId: 'tu-vung-hoi-an',
    outFile: 'tu-vung-hoi-an.ogg',
    source: 'Bustling-Village.ogg',
    title: 'Bustling Village',
  },
];

const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length)?.trim().toLowerCase();
const force = process.argv.includes('--force');

function curlToFile(url, outPath) {
  execFileSync('curl', ['-4', '-sS', '--fail', '-L', '-o', outPath, url], { stdio: 'pipe' });
}

async function downloadOne(track) {
  const dest = join(OUT_DIR, track.outFile);
  if (!force && existsSync(dest)) {
    console.log(`skip ${track.outFile} (exists)`);
    return;
  }
  const url = `${BASE}/${track.source}`;
  console.log(`→ ${track.gameId}: ${track.title}`);
  await mkdir(OUT_DIR, { recursive: true });
  const tmp = `${dest}.part`;
  curlToFile(url, tmp);
  await rename(tmp, dest);
  console.log(`  saved ${dest}`);
}

const queue = TRACKS.filter((t) => !onlyArg || `${t.gameId} ${t.outFile}`.toLowerCase().includes(onlyArg));
if (queue.length === 0) {
  console.error(`No tracks match --only=${onlyArg ?? ''}`);
  process.exit(1);
}

let failed = 0;
for (const t of queue) {
  try {
    await downloadOne(t);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${t.outFile}:`, err instanceof Error ? err.message : err);
  }
}

if (failed) process.exit(1);
console.log('\nDone. Attribution: Eric Matyas (soundimage.org), CC BY 4.0');
