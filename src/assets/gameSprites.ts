/** Minh họa SVG 2D — thumbnail Home + màn chọn game */
export const GAME_SPRITE_IDS = [
  'trang-nguyen-toan',
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
  'trang-nguyen-toan': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trạng Nguyên Toán">
    <defs>
      <linearGradient id="tn-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>
      <linearGradient id="tn-floor" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1e3a8a" stop-opacity=".35"/>
        <stop offset="100%" stop-color="#2563eb" stop-opacity=".15"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#tn-bg)" rx="12"/>
    <ellipse cx="100" cy="108" rx="88" ry="14" fill="url(#tn-floor)"/>
    <rect x="28" y="78" width="22" height="28" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
    <rect x="150" y="78" width="22" height="28" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
    <g transform="translate(100 62)">
      <rect x="-18" y="-8" width="36" height="32" rx="4" fill="#1d4ed8"/>
      <rect x="-14" y="-22" width="28" height="16" rx="3" fill="#3b82f6"/>
      <rect x="-22" y="-2" width="10" height="22" rx="2" fill="#2563eb"/>
      <rect x="12" y="-2" width="10" height="22" rx="2" fill="#2563eb"/>
      <rect x="-8" y="18" width="7" height="14" rx="2" fill="#1e40af"/>
      <rect x="1" y="18" width="7" height="14" rx="2" fill="#1e40af"/>
      <circle cx="0" cy="-28" r="9" fill="#60a5fa"/>
      <rect x="-5" y="-38" width="10" height="6" rx="1" fill="#93c5fd"/>
      <rect x="-20" y="-18" width="8" height="3" fill="#facc15" opacity=".9"/>
      <rect x="12" y="-18" width="8" height="3" fill="#facc15" opacity=".9"/>
    </g>
    <rect x="62" y="42" width="76" height="52" rx="5" fill="#475569" stroke="#facc15" stroke-width="2"/>
    <text x="100" y="62" text-anchor="middle" font-size="11" font-weight="800" fill="#f8fafc" font-family="system-ui,sans-serif">3 × 7 = ?</text>
    <circle cx="78" cy="78" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="78" y="82" text-anchor="middle" font-size="10" font-weight="800" fill="#facc15" font-family="system-ui,sans-serif">A</text>
    <circle cx="100" cy="78" r="9" fill="#1e40af" stroke="#facc15" stroke-width="2"/>
    <text x="100" y="82" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">B</text>
    <circle cx="122" cy="78" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="122" y="82" text-anchor="middle" font-size="10" font-weight="800" fill="#facc15" font-family="system-ui,sans-serif">C</text>
  </svg>`,

  'tu-vung-hoi-an': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Từ vựng Hội An">
    <defs>
      <linearGradient id="ha-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="55%" stop-color="#7c2d12"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <radialGradient id="ha-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="120" fill="url(#ha-sky)" rx="12"/>
    <circle cx="165" cy="28" r="16" fill="#fde68a" opacity=".85"/>
    <path d="M0 72 Q55 58 100 68 T200 64 L200 120 L0 120 Z" fill="#0c4a6e"/>
    <path d="M0 78 Q60 70 110 76 T200 74 L200 120 L0 120 Z" fill="#0369a1" opacity=".7"/>
    <path d="M48 70 L152 70 L138 88 L62 88 Z" fill="#78350f"/>
    <path d="M58 66 L142 66 L130 70 L70 70 Z" fill="#92400e"/>
    <rect x="88" y="58" width="24" height="10" fill="#b45309"/>
    <g transform="translate(62 38)">
      <ellipse cx="0" cy="18" rx="14" ry="20" fill="#fbbf24" stroke="#dc2626" stroke-width="2"/>
      <rect x="-6" y="0" width="12" height="8" fill="#dc2626"/>
      <ellipse cx="0" cy="18" rx="8" ry="11" fill="url(#ha-glow)" opacity=".6"/>
      <text x="0" y="22" text-anchor="middle" font-size="9" font-weight="800" fill="#7c2d12" font-family="system-ui,sans-serif">cat</text>
    </g>
    <g transform="translate(138 34)">
      <ellipse cx="0" cy="20" rx="15" ry="22" fill="#f59e0b" stroke="#dc2626" stroke-width="2"/>
      <rect x="-7" y="2" width="14" height="8" fill="#dc2626"/>
      <ellipse cx="0" cy="20" rx="8" ry="12" fill="url(#ha-glow)" opacity=".55"/>
      <text x="0" y="24" text-anchor="middle" font-size="9" font-weight="800" fill="#7c2d12" font-family="system-ui,sans-serif">mèo</text>
    </g>
    <path d="M95 52 L100 44 L105 52 Z" fill="#fde047" opacity=".5"/>
  </svg>`,

  'trong-dong': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trống Đồng">
    <defs>
      <radialGradient id="td-bronze" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#f0c878"/>
        <stop offset="55%" stop-color="#cd7f32"/>
        <stop offset="100%" stop-color="#8b5a2b"/>
      </radialGradient>
    </defs>
    <rect width="200" height="120" fill="#e8dcc8" rx="12"/>
    <ellipse cx="100" cy="98" rx="72" ry="10" fill="#c4b5a0" opacity=".5"/>
    <ellipse cx="100" cy="78" rx="78" ry="24" fill="#a67c52"/>
    <ellipse cx="100" cy="72" rx="70" ry="20" fill="url(#td-bronze)"/>
    <ellipse cx="100" cy="68" rx="58" ry="16" fill="#b8860b" opacity=".35"/>
    <circle cx="100" cy="64" r="24" fill="#daa520" stroke="#5c4033" stroke-width="2"/>
    <circle cx="100" cy="64" r="10" fill="#5c4033"/>
    <g stroke="#5c4033" stroke-width="1.5" fill="none" opacity=".85">
      <path d="M76 58 Q100 48 124 58"/>
      <path d="M72 66 Q100 76 128 66"/>
      <path d="M80 72 Q100 62 120 72"/>
      <circle cx="100" cy="64" r="18"/>
    </g>
    <g opacity=".7">
      <path d="M48 52 Q52 44 56 52" stroke="#8b7355" stroke-width="2" fill="none"/>
      <path d="M144 50 Q148 42 152 50" stroke="#8b7355" stroke-width="2" fill="none"/>
    </g>
    <rect x="118" y="28" width="28" height="20" rx="3" fill="#fef3c7" stroke="#b8860b" stroke-width="1.5" transform="rotate(8 132 38)"/>
    <path d="M124 32 L132 36 L124 40 Z" fill="#cd7f32"/>
  </svg>`,

  'hinh-hoc-thang-long': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hình học Thăng Long">
    <defs>
      <linearGradient id="hl-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#hl-sky)" rx="12"/>
    <rect x="18" y="52" width="164" height="48" fill="#94a3b8" opacity=".45" rx="4"/>
    <rect x="30" y="42" width="18" height="28" fill="#64748b"/>
    <rect x="152" y="40" width="18" height="30" fill="#64748b"/>
    <polygon points="100,28 128,48 72,48" fill="#b45309" opacity=".9"/>
    <rect x="38" y="58" width="32" height="32" fill="#3b82f6" stroke="#1e40af" stroke-width="2" rx="2"/>
    <rect x="84" y="62" width="44" height="24" fill="#f59e0b" stroke="#1e40af" stroke-width="2" rx="2"/>
    <polygon points="142,58 168,88 116,88" fill="#22c55e" stroke="#1e40af" stroke-width="2"/>
    <circle cx="54" cy="74" r="6" fill="#f8fafc" opacity=".5"/>
    <circle cx="106" cy="74" r="6" fill="#f8fafc" opacity=".5"/>
    <circle cx="142" cy="72" r="6" fill="#f8fafc" opacity=".5"/>
    <rect x="72" y="94" width="56" height="8" rx="2" fill="#78716c"/>
  </svg>`,

  'doc-hieu-su-viet': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đọc hiểu Sử Việt">
    <defs>
      <linearGradient id="sv-paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff7ed"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="#fee2e2" rx="12"/>
    <rect x="48" y="22" width="104" height="76" rx="4" fill="url(#sv-paper)" stroke="#dc2626" stroke-width="2"/>
    <line x1="58" y1="38" x2="142" y2="38" stroke="#1e3a8a" stroke-width="2.5"/>
    <line x1="58" y1="52" x2="128" y2="52" stroke="#64748b" stroke-width="2"/>
    <line x1="58" y1="64" x2="135" y2="64" stroke="#64748b" stroke-width="2"/>
    <line x1="58" y1="76" x2="118" y2="76" stroke="#64748b" stroke-width="2"/>
    <rect x="28" y="32" width="18" height="56" rx="2" fill="#dc2626" opacity=".85"/>
    <circle cx="37" cy="88" r="10" fill="#fbbf24" stroke="#dc2626" stroke-width="1.5"/>
    <g transform="translate(148 34)">
      <circle cx="0" cy="0" r="16" fill="#22c55e" stroke="#166534" stroke-width="2"/>
      <text x="0" y="5" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">Đúng</text>
    </g>
    <g transform="translate(148 72)">
      <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <text x="0" y="5" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">Sai</text>
    </g>
    <polygon points="168,18 178,24 168,30" fill="#fbbf24"/>
  </svg>`,

  'cuu-chuong-van-mieu': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cửu chương Văn Miếu">
    <defs>
      <linearGradient id="vm-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e0e7ff"/>
        <stop offset="100%" stop-color="#c7d2fe"/>
      </linearGradient>
      <radialGradient id="vm-shell" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="100%" stop-color="#15803d"/>
      </radialGradient>
    </defs>
    <rect width="200" height="120" fill="url(#vm-sky)" rx="12"/>
    <rect x="52" y="28" width="14" height="58" fill="#78716c" rx="2"/>
    <rect x="72" y="24" width="16" height="62" fill="#4f46e5" rx="2"/>
    <rect x="94" y="26" width="14" height="60" fill="#78716c" rx="2"/>
    <rect x="114" y="30" width="14" height="56" fill="#4f46e5" rx="2"/>
    <polygon points="80,22 120,22 100,12" fill="#4f46e5"/>
    <ellipse cx="158" cy="88" rx="32" ry="14" fill="#a8a29e"/>
    <ellipse cx="158" cy="82" rx="26" ry="11" fill="url(#vm-shell)"/>
    <ellipse cx="152" cy="76" rx="8" ry="10" fill="#86efac"/>
    <circle cx="168" cy="76" r="5" fill="#166534"/>
    <circle cx="148" cy="80" r="4" fill="#166534"/>
    <rect x="68" y="48" width="64" height="40" rx="4" fill="#fef3c7" stroke="#4f46e5" stroke-width="2"/>
    <text x="100" y="68" text-anchor="middle" font-size="16" font-weight="800" fill="#4f46e5" font-family="system-ui,sans-serif">7 × 8</text>
    <text x="100" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="#78716c" font-family="system-ui,sans-serif">= ?</text>
  </svg>`,

  'tham-hiem-cuu-long': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thám hiểm Cửu Long">
    <defs>
      <linearGradient id="cl-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6ee7b7"/>
        <stop offset="100%" stop-color="#0ea5e9"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="#d1fae5" rx="12"/>
    <path d="M0 58 Q45 48 95 55 T200 52 L200 120 L0 120 Z" fill="url(#cl-water)" opacity=".75"/>
    <path d="M0 68 Q50 62 100 68 T200 65 L200 120 L0 120 Z" fill="#059669" opacity=".25"/>
    <ellipse cx="42" cy="42" rx="22" ry="14" fill="#22c55e" opacity=".55"/>
    <ellipse cx="168" cy="38" rx="18" ry="26" fill="#16a34a" opacity=".45"/>
    <circle cx="178" cy="72" r="8" fill="#fde68a"/>
    <rect x="58" y="24" width="84" height="58" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2"/>
    <rect x="64" y="30" width="72" height="46" rx="2" fill="#fef3c7"/>
    <line x1="70" y1="42" x2="130" y2="42" stroke="#78350f" stroke-width="2"/>
    <line x1="70" y1="54" x2="118" y2="54" stroke="#a8a29e" stroke-width="2"/>
    <line x1="70" y1="66" x2="124" y2="66" stroke="#a8a29e" stroke-width="2"/>
    <g stroke="#059669" stroke-width="2.5" stroke-linecap="round">
      <line x1="100" y1="88" x2="100" y2="104"/>
      <line x1="92" y1="96" x2="108" y2="96"/>
    </g>
    <rect x="66" y="78" width="22" height="12" rx="2" fill="#dcfce7" stroke="#059669" stroke-width="1.5"/>
    <text x="77" y="87" text-anchor="middle" font-size="7" font-weight="800" fill="#166534" font-family="system-ui,sans-serif">ĐV</text>
    <rect x="92" y="78" width="22" height="12" rx="2" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="103" y="87" text-anchor="middle" font-size="7" font-weight="800" fill="#92400e" font-family="system-ui,sans-serif">TV</text>
    <rect x="118" y="78" width="22" height="12" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
    <text x="129" y="87" text-anchor="middle" font-size="7" font-weight="800" fill="#0369a1" font-family="system-ui,sans-serif">TT</text>
  </svg>`,

  'tinh-nham-trang-ti': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tính nhẩm Trạng Tí">
    <defs>
      <linearGradient id="tt-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bbf7d0"/>
        <stop offset="100%" stop-color="#86efac"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#tt-sky)" rx="12"/>
    <polygon points="155,48 175,28 185,55" fill="#78716c"/>
    <polygon points="165,50 180,35 188,58" fill="#ef4444" opacity=".7"/>
    <path d="M20 95 L180 95 L170 70 L30 70 Z" fill="#16a34a" opacity=".35"/>
    <ellipse cx="48" cy="78" rx="14" ry="22" fill="#22c55e" opacity=".5"/>
    <g transform="translate(118 52)">
      <path d="M-28 38 L-18 8 L-8 38 Z" fill="#15803d"/>
      <path d="M-22 38 L-14 14 L-6 38 Z" fill="#22c55e"/>
      <rect x="-32" y="36" width="28" height="10" rx="3" fill="#166534"/>
      <ellipse cx="-18" cy="2" rx="16" ry="14" fill="#4ade80"/>
      <path d="M-34 0 L-28 -6 L-22 0 L-26 8 Z" fill="#fde047"/>
      <circle cx="-8" cy="4" r="3" fill="#1e293b"/>
      <rect x="-38" y="18" width="10" height="6" rx="2" fill="#15803d"/>
    </g>
    <ellipse cx="100" cy="98" rx="36" ry="10" fill="#ca8a04" opacity=".35"/>
    <rect x="68" y="58" width="64" height="36" rx="6" fill="#fef9c3" stroke="#f97316" stroke-width="2"/>
    <text x="100" y="82" text-anchor="middle" font-size="18" font-weight="800" fill="#ea580c" font-family="system-ui,sans-serif">12 − 5</text>
    <circle cx="152" cy="88" r="14" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
    <text x="152" y="93" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">=7</text>
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
