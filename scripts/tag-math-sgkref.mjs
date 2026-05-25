#!/usr/bin/env node
/** Gắn sgkRef vào mcqBank.ts / mathBank.ts từ scripts/data/sgk-toan-hk1-sgkref.json */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const rules = JSON.parse(
  fs.readFileSync(path.join(root, 'scripts/data/sgk-toan-hk1-sgkref.json'), 'utf8')
);

function inferBai(prompt) {
  const p = prompt.toLowerCase();
  for (const r of rules.ranges) {
    if (r.keywords.some((k) => p.includes(k.toLowerCase()))) {
      const b = r.baiStart + Math.floor(Math.random() * (r.baiEnd - r.baiStart + 1));
      return b;
    }
  }
  return rules.defaultBai;
}

function tagFile(relPath, exportName) {
  const file = path.join(root, relPath);
  let src = fs.readFileSync(file, 'utf8');
  if (src.includes('sgkRef:')) {
    console.log(`Skip ${relPath} (already tagged)`);
    return;
  }
  src = src.replace(
    /export interface (\w+) \{\n  prompt: string;/,
    'export interface $1 {\n  prompt: string;\n  sgkRef?: string;'
  );
  src = src.replace(
    /(\{ prompt: '[^']+', choices: \[[^\]]+\], correctIndex: \d+ \})/g,
    (m) => {
      const pm = m.match(/prompt: '([^']+)'/);
      if (!pm) return m;
      const bai = inferBai(pm[1]);
      const ref = `toan-hk1-bai-${String(bai).padStart(2, '0')}`;
      return m.replace(' }', `, sgkRef: '${ref}' }`);
    }
  );
  fs.writeFileSync(file, src);
  console.log(`Tagged ${relPath}`);
}

tagFile('src/games/trang-nguyen-toan/mcqBank.ts', 'MCQ_BANK');
tagFile('src/games/trang-nguyen-toan/mcqBankExtra.ts', 'MCQ_BANK_EXTRA');
tagFile('src/games/tinh-nham-trang-ti/mathBank.ts', 'MATH_BANK');
tagFile('src/games/tinh-nham-trang-ti/mathBankExtra.ts', 'MATH_BANK_EXTRA');
tagFile('src/games/cuu-chuong-van-mieu/mathBank.ts', 'MATH_BANK');
tagFile('src/games/cuu-chuong-van-mieu/mathBankExtra.ts', 'MATH_BANK_EXTRA');
