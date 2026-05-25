#!/usr/bin/env node
/**
 * Tải SGK lớp 4 từ thư viện Trường Nguyễn Văn Trỗi (PM) → pdfs/
 *
 *   npm run fetch:sgk
 *   node scripts/fetch-sgk-pdfs.mjs --id tv-ctst-t1
 *   node scripts/fetch-sgk-pdfs.mjs --refresh   # cập nhật link PDF từ trang /sach/
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PDF_DIR = join(ROOT, 'pdfs');
const CATALOG_PATH = join(__dirname, 'data/sgk-library-nguyenvantroi.json');

const args = process.argv.slice(2);
const onlyId = args.includes('--id') ? args[args.indexOf('--id') + 1] : null;
const refresh = args.includes('--refresh');
const dryRun = args.includes('--dry-run');

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));

async function resolveDownloadUrl(book) {
  if (!refresh && book.downloadUrl) return book.downloadUrl;
  if (!book.pageUrl) return null;
  const res = await fetch(book.pageUrl, { redirect: 'follow' });
  const html = await res.text();
  const m = html.match(
    /href="(https:\/\/nguyenvantroipm\.edu\.vn\/wp-content\/uploads\/[^"?]+\.pdf)\?action=tai_ve"/i,
  );
  return m?.[1] ? `${m[1]}?action=tai_ve` : null;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  if (!res.body) throw new Error('No response body');

  const total = Number(res.headers.get('content-length') || 0);
  let done = 0;
  const nodeStream = Readable.fromWeb(res.body);
  nodeStream.on('data', (chunk) => {
    done += chunk.length;
    if (total > 0 && done % (2 * 1024 * 1024) < chunk.length) {
      process.stdout.write(`  … ${Math.round((done / total) * 100)}%\r`);
    }
  });

  await pipeline(nodeStream, createWriteStream(dest));
  if (total > 0) process.stdout.write('\n');
  return dest;
}

async function main() {
  mkdirSync(PDF_DIR, { recursive: true });
  const books = catalog.books.filter((b) => !onlyId || b.id === onlyId);
  if (onlyId && books.length === 0) {
    console.error(`Không tìm thấy id "${onlyId}" trong catalog.`);
    process.exit(1);
  }

  for (const book of books) {
    const dest = join(PDF_DIR, book.localFile);
    if (existsSync(dest) && !args.includes('--force')) {
      console.log(`⏭  ${book.localFile} (đã có, dùng --force để tải lại)`);
      continue;
    }

    const url = await resolveDownloadUrl(book);
    if (!url) {
      console.warn(`⚠  ${book.id}: không có link tải — mở ${book.pageUrl}`);
      continue;
    }

    console.log(`⬇  ${book.title}`);
    console.log(`   → ${book.localFile}`);
    if (dryRun) {
      console.log(`   ${url}`);
      continue;
    }

    try {
      await download(url, dest);
      console.log(`✓  ${dest}`);
    } catch (e) {
      console.error(`✗  ${book.id}: ${e.message}`);
    }
  }

  console.log('\nGợi ý: bổ sung sách KNTT (Khoa học, Sử–Địa…) vào pdfs/ thủ công hoặc khi trường đăng thêm trên thư viện.');
  console.log('Chỉ mục: docs/content/SGK_DOWNLOAD_SOURCES.md');
}

main();
