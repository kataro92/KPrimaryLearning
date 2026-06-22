#!/usr/bin/env node
/**
 * Lightweight canvas inspection for World Cup 2026 standalone page.
 * Requires dev server: npm run dev — then npm run inspect:wc-canvas
 */
import { mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

const args = process.argv.slice(2);
const port = process.env.PORT ?? '5173';
const base = `http://127.0.0.1:${port}/world-cup-2026.html`;
const outDir = path.resolve('artifacts/world-cup-canvas');

async function fetchBuffer(url: string): Promise<Buffer> {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    lib.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  try {
    const html = await fetchBuffer(base);
    const hasCanvas = html.toString('utf8').includes('wc-three-root');
    const report = {
      url: base,
      htmlBytes: html.length,
      hasCanvasMount: hasCanvas,
      note: 'Full pixel sampling requires Playwright; this script verifies the page serves and mount exists.',
      timestamp: new Date().toISOString(),
    };
    await writeFile(path.join(outDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (!hasCanvasMount) process.exit(1);
  } catch (err) {
    console.error('Start dev server first: npm run dev');
    console.error(err);
    process.exit(1);
  }
}

main();
