/**
 * Gán 1:1 câu oNNN → nét vẽ oNNN (đã chuyển sang generate-hinh-hoc-unique-drawings).
 * Chạy: npm run generate:hinh-hoc-drawings
 */
import { spawnSync } from 'child_process';

const r = spawnSync('npx', ['tsx', 'scripts/generate-hinh-hoc-unique-drawings.mjs'], {
  stdio: 'inherit',
  shell: true,
});
process.exit(r.status ?? 1);
