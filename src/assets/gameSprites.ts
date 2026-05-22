/** Minh họa SVG 2D theo từng game — phong cách tròn, tươi, dễ đọc */
export const GAME_SPRITE_IDS = [
  'trang-nguyen-toan',
  'net-chu-rong-tien',
  'tu-vung-hoi-an',
  'trong-dong',
  'hinh-hoc-thang-long',
  'doc-hieu-su-viet',
  'cuu-chuong-van-mieu',
  'tham-hiem-cuu-long',
  'tinh-nham-trang-ti',
] as const;

export type GameSpriteId = (typeof GAME_SPRITE_IDS)[number];

const SPRITES: Record<GameSpriteId, string> = {
  'trang-nguyen-toan': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trạng Nguyên">
    <rect width="200" height="120" fill="#e0f2fe" rx="12"/>
    <path d="M20 95 L100 35 L180 95 Z" fill="#3b82f6" opacity=".25"/>
    <rect x="55" y="48" width="90" height="50" rx="6" fill="#fef3c7" stroke="#2563eb" stroke-width="2"/>
    <circle cx="100" cy="38" r="14" fill="#fde68a" stroke="#2563eb" stroke-width="2"/>
    <rect x="70" y="58" width="60" height="8" rx="2" fill="#2563eb" opacity=".5"/>
    <text x="100" y="88" text-anchor="middle" font-size="22" font-weight="bold" fill="#facc15">★</text>
  </svg>`,

  'net-chu-rong-tien': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nét Chữ Mario Typing">
    <rect width="200" height="120" fill="#5c94fc" rx="12"/>
    <ellipse cx="50" cy="28" rx="22" ry="10" fill="#f8f8f8"/>
    <ellipse cx="150" cy="22" rx="18" ry="8" fill="#f8f8f8"/>
    <path d="M0 88 Q50 70 100 82 T200 88 L200 120 L0 120 Z" fill="#40c040"/>
    <rect x="20" y="72" width="28" height="10" fill="#c84c0c"/>
    <rect x="55" y="72" width="28" height="10" fill="#9a3a08"/>
    <rect x="90" y="72" width="28" height="10" fill="#c84c0c"/>
    <rect x="125" y="72" width="28" height="10" fill="#9a3a08"/>
    <rect x="72" y="48" width="22" height="22" fill="#f8b800" stroke="#1a1a1a" stroke-width="2"/>
    <text x="83" y="64" font-size="14" font-weight="bold" fill="#1a1a1a">ê</text>
    <rect x="38" y="58" width="18" height="24" fill="#e52521"/>
    <rect x="36" y="52" width="22" height="8" fill="#e52521"/>
    <rect x="40" y="66" width="14" height="14" fill="#214ad4"/>
    <rect x="42" y="78" width="8" height="6" fill="#6b3a16"/>
    <rect x="52" y="78" width="8" height="6" fill="#6b3a16"/>
    <rect x="155" y="52" width="30" height="36" fill="#c84c0c"/>
    <rect x="148" y="42" width="12" height="18" fill="#c84c0c"/>
    <rect x="180" y="42" width="12" height="18" fill="#c84c0c"/>
  </svg>`,

  'tu-vung-hoi-an': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hội An">
    <rect width="200" height="120" fill="#fff4d6" rx="12"/>
    <rect x="0" y="85" width="200" height="35" fill="#f59e0b" opacity=".2"/>
    <line x1="30" y1="85" x2="170" y2="85" stroke="#dc2626" stroke-width="2"/>
    <ellipse cx="50" cy="55" rx="16" ry="22" fill="#fbbf24" stroke="#dc2626" stroke-width="2"/>
    <rect x="44" y="30" width="12" height="8" fill="#dc2626"/>
    <ellipse cx="100" cy="50" rx="14" ry="20" fill="#f59e0b" stroke="#dc2626" stroke-width="2"/>
    <ellipse cx="150" cy="58" rx="16" ry="22" fill="#fde047" stroke="#dc2626" stroke-width="2"/>
    <circle cx="100" cy="25" r="18" fill="#fbbf24" opacity=".4"/>
  </svg>`,

  'trong-dong': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trống Đồng">
    <rect width="200" height="120" fill="#e8dcc8" rx="12"/>
    <ellipse cx="100" cy="72" rx="70" ry="22" fill="#cd7f32"/>
    <ellipse cx="100" cy="65" rx="62" ry="18" fill="#b8860b"/>
    <circle cx="100" cy="62" r="22" fill="#daa520" stroke="#5c4033" stroke-width="2"/>
    <circle cx="100" cy="62" r="8" fill="#5c4033"/>
    <path d="M70 58 Q100 48 130 58" stroke="#5c4033" stroke-width="2" fill="none"/>
    <path d="M75 68 Q100 78 125 68" stroke="#5c4033" stroke-width="1.5" fill="none"/>
    <circle cx="55" cy="40" r="6" fill="#8b7355" opacity=".5"/>
    <circle cx="145" cy="38" r="5" fill="#8b7355" opacity=".5"/>
  </svg>`,

  'hinh-hoc-thang-long': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thăng Long">
    <rect width="200" height="120" fill="#e2e8f0" rx="12"/>
    <rect x="25" y="45" width="150" height="55" fill="#94a3b8" opacity=".4" rx="4"/>
    <rect x="40" y="55" width="35" height="35" fill="#64748b" stroke="#1e40af" stroke-width="2"/>
    <rect x="85" y="60" width="50" height="25" fill="#b45309" stroke="#1e40af" stroke-width="2"/>
    <polygon points="145,55 175,85 115,85" fill="#1e40af" opacity=".7"/>
    <rect x="30" y="38" width="20" height="12" fill="#64748b"/>
    <rect x="150" y="35" width="25" height="15" fill="#64748b"/>
  </svg>`,

  'doc-hieu-su-viet': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sử Việt">
    <rect width="200" height="120" fill="#fee2e2" rx="12"/>
    <rect x="55" y="30" width="90" height="65" rx="4" fill="#fff" stroke="#dc2626" stroke-width="2"/>
    <line x1="65" y1="45" x2="135" y2="45" stroke="#1e3a8a" stroke-width="2"/>
    <line x1="65" y1="58" x2="120" y2="58" stroke="#64748b" stroke-width="2"/>
    <line x1="65" y1="71" x2="130" y2="71" stroke="#64748b" stroke-width="2"/>
    <rect x="140" y="25" width="28" height="18" fill="#dc2626"/>
    <polygon points="154,25 168,32 154,39" fill="#fbbf24"/>
    <circle cx="40" cy="50" r="14" fill="#fde68a" stroke="#dc2626" stroke-width="2"/>
  </svg>`,

  'cuu-chuong-van-mieu': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Văn Miếu">
    <rect width="200" height="120" fill="#e0e7ff" rx="12"/>
    <rect x="45" y="25" width="22" height="70" fill="#78716c" rx="2"/>
    <rect x="75" y="30" width="22" height="65" fill="#4f46e5" rx="2"/>
    <rect x="105" y="28" width="22" height="68" fill="#78716c" rx="2"/>
    <ellipse cx="155" cy="88" rx="28" ry="14" fill="#a8a29e"/>
    <ellipse cx="155" cy="82" rx="22" ry="10" fill="#78716c"/>
    <circle cx="155" cy="75" r="8" fill="#fbbf24"/>
    <text x="100" y="105" text-anchor="middle" font-size="14" fill="#4f46e5" font-weight="bold">× ÷</text>
  </svg>`,

  'tham-hiem-cuu-long': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cửu Long">
    <rect width="200" height="120" fill="#d1fae5" rx="12"/>
    <path d="M0 75 Q50 65 100 75 T200 70 L200 120 L0 120 Z" fill="#0ea5e9" opacity=".35"/>
    <path d="M55 78 L145 78 L130 95 L70 95 Z" fill="#78350f"/>
    <rect x="85" y="68" width="30" height="12" fill="#059669"/>
    <circle cx="40" cy="45" r="16" fill="#22c55e" opacity=".6"/>
    <ellipse cx="165" cy="50" rx="12" ry="20" fill="#16a34a" opacity=".5"/>
    <circle cx="100" cy="55" r="10" fill="#fde68a"/>
  </svg>`,

  'tinh-nham-trang-ti': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trạng Tí">
    <rect width="200" height="120" fill="#dcfce7" rx="12"/>
    <path d="M30 95 L170 95 L160 55 L40 55 Z" fill="#16a34a" opacity=".3"/>
    <rect x="70" y="40" width="60" height="45" rx="4" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
    <text x="100" y="68" text-anchor="middle" font-size="20" font-weight="bold" fill="#f97316">7+8</text>
    <ellipse cx="55" cy="70" rx="12" ry="18" fill="#22c55e"/>
    <circle cx="55" cy="52" r="10" fill="#fde68a"/>
    <circle cx="145" cy="48" r="14" fill="#f97316" opacity=".5"/>
  </svg>`,
};

export function getGameSpriteSvg(gameId: string): string {
  return SPRITES[gameId as GameSpriteId] ?? SPRITES['trang-nguyen-toan'];
}

export function gameSpriteDataUrl(gameId: string): string {
  const svg = getGameSpriteSvg(gameId).trim();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Chèn minh họa vào phần tử (hero / thumbnail) */
export function mountGameSprite(container: HTMLElement, gameId: string, variant: 'hero' | 'thumb' | 'card'): void {
  container.innerHTML = getGameSpriteSvg(gameId);
  const svg = container.querySelector('svg');
  if (svg) {
    svg.classList.add('game-sprite__svg');
    if (variant === 'hero') svg.classList.add('game-sprite__svg--hero');
    if (variant === 'thumb') svg.classList.add('game-sprite__svg--thumb');
    if (variant === 'card') svg.classList.add('game-sprite__svg--card');
  }
}
