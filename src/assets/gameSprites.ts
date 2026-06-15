/** Minh họa SVG 2D — thumbnail Home + màn chọn game */
export const GAME_SPRITE_IDS = [
  'trang-nguyen-toan',
  'but-sen-viet',
  'tu-vung-hoi-an',
  'trong-dong',
  'doc-hieu-su-viet',
  'hanh-trinh-su-dia',
  'cuu-chuong-van-mieu',
  'tham-hiem-cuu-long',
  'tinh-nham-trang-ti',
  'thap-trieu-so',
  'thuong-nhan-song-hong',
  'chia-banh-trang-ram',
  'do-dat-co-thanh',
  'bep-bac-hoc-tro',
  'cho-so-lieu',
  'dao-duc-nhi',
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

  'but-sen-viet': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bút Sen Việt">
    <defs>
      <linearGradient id="bs-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="100%" stop-color="#fde68a"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#bs-bg)" rx="12"/>
    <rect x="24" y="28" width="112" height="64" rx="4" fill="#fff7ed" stroke="#b45309" stroke-width="2"/>
    <line x1="36" y1="48" x2="124" y2="48" stroke="#78350f" stroke-width="2"/>
    <line x1="36" y1="62" x2="108" y2="62" stroke="#a8a29e" stroke-width="2"/>
    <rect x="72" y="54" width="36" height="18" rx="3" fill="#f8b800" stroke="#1a1a1a" stroke-width="1.5"/>
    <text x="90" y="67" text-anchor="middle" font-size="11" font-weight="800" fill="#1a1a1a" font-family="system-ui,sans-serif">ê</text>
    <path d="M148 88 L168 38 L178 88 Z" fill="#1c1917"/>
    <rect x="160" y="28" width="8" height="14" fill="#dc2626"/>
    <ellipse cx="164" cy="92" rx="10" ry="4" fill="#1c1917" opacity=".35"/>
    <circle cx="42" cy="22" r="6" fill="#dc2626" opacity=".5"/>
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

  'hanh-trinh-su-dia': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hành Trình Sử và Địa">
    <defs>
      <linearGradient id="sd-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#93c5fd"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#sd-sea)" rx="12"/>
    <path d="M72 88 L88 52 L104 68 L118 44 L132 72 L148 58 L162 88 Z" fill="#22c55e" stroke="#14532d" stroke-width="2"/>
    <circle cx="158" cy="52" r="5" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="168" cy="72" r="6" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="42" cy="78" r="5" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <rect x="78" y="94" width="44" height="14" rx="4" fill="#fef9c3" stroke="#1e3a8a" stroke-width="2"/>
    <text x="100" y="104" text-anchor="middle" font-size="8" font-weight="800" fill="#1e3a8a" font-family="system-ui,sans-serif">Hoàng Sa</text>
    <path d="M118 28 L128 38 L108 38 Z" fill="#fbbf24" stroke="#1e3a8a" stroke-width="1.5"/>
    <line x1="118" y1="28" x2="100" y2="50" stroke="#1e3a8a" stroke-width="1.5" stroke-dasharray="3 2"/>
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
  'dao-duc-nhi': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đạo Đức Nhí">
    <rect width="200" height="120" fill="#fdf2f8" rx="12"/>
    <path d="M100 28 C78 28 62 44 62 66 C62 88 78 98 100 98 C122 98 138 88 138 66 C138 44 122 28 100 28Z" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
    <path d="M100 42 C88 42 78 52 78 64 C78 76 88 82 100 88 C112 82 122 76 122 64 C122 52 112 42 100 42Z" fill="#fce7f3"/>
    <text x="100" y="112" text-anchor="middle" font-size="11" font-weight="700" fill="#9d174d" font-family="system-ui,sans-serif">Đạo đức</text>
  </svg>`,

  'thap-trieu-so': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tháp Triệu Số">
    <defs>
      <linearGradient id="tts-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7dd3fc"/>
        <stop offset="55%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#fef9c3"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#tts-sky)" rx="12"/>
    <ellipse cx="100" cy="108" rx="70" ry="8" fill="#78716c" opacity=".35"/>
    <g transform="translate(100 88)">
      <polygon points="0,-52 -14,0 14,0" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <rect x="-22" y="0" width="44" height="14" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
      <rect x="-26" y="16" width="52" height="14" rx="3" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
      <rect x="-30" y="32" width="60" height="14" rx="3" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <rect x="-36" y="50" width="72" height="12" rx="3" fill="#78716c" stroke="#44403c" stroke-width="1.5"/>
    </g>
    <rect x="52" y="28" width="96" height="36" rx="5" fill="#475569" stroke="#facc15" stroke-width="2"/>
    <text x="100" y="52" text-anchor="middle" font-size="13" font-weight="800" fill="#f8fafc" font-family="system-ui,sans-serif">1 000 000</text>
  </svg>`,

  'thuong-nhan-song-hong': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thương Nhân Sông Hồng">
    <defs>
      <linearGradient id="snsh-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#86efac"/>
        <stop offset="45%" stop-color="#bbf7d0"/>
        <stop offset="100%" stop-color="#7dd3fc"/>
      </linearGradient>
      <pattern id="snsh-awn" width="20" height="18" patternUnits="userSpaceOnUse">
        <rect width="10" height="18" fill="#dc2626"/>
        <rect x="10" width="10" height="18" fill="#fef08a"/>
      </pattern>
    </defs>
    <rect width="200" height="120" fill="url(#snsh-bg)" rx="12"/>
    <rect x="38" y="38" width="124" height="18" fill="url(#snsh-awn)" rx="4"/>
    <rect x="42" y="54" width="116" height="32" fill="#d6d3d1" stroke="#57534e" stroke-width="2"/>
    <text x="58" y="72" font-size="14">🍎</text>
    <text x="82" y="72" font-size="14">🥬</text>
    <text x="106" y="72" font-size="14">🐟</text>
    <text x="130" y="72" font-size="14">🍚</text>
    <path d="M20 98 Q100 82 180 98 L180 120 L20 120 Z" fill="#38bdf8" opacity=".85"/>
    <path d="M30 102 Q100 90 170 102" stroke="#0284c7" stroke-width="2" fill="none" opacity=".6"/>
    <rect x="68" y="22" width="64" height="22" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
    <text x="100" y="37" text-anchor="middle" font-size="9" font-weight="800" fill="#78350f" font-family="system-ui,sans-serif">125 859 + ?</text>
  </svg>`,

  'chia-banh-trang-ram': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chia Bánh Trăng Rằm">
    <defs>
      <linearGradient id="cbtr-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="40%" stop-color="#312e81"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <radialGradient id="cbtr-moon" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </radialGradient>
    </defs>
    <rect width="200" height="120" fill="url(#cbtr-sky)" rx="12"/>
    <circle cx="158" cy="32" r="22" fill="url(#cbtr-moon)" opacity=".95"/>
    <circle cx="150" cy="26" r="4" fill="#fde68a" opacity=".5"/>
    <circle cx="168" cy="36" r="3" fill="#fde68a" opacity=".4"/>
    <rect x="48" y="62" width="104" height="38" rx="6" fill="#78350f" stroke="#fcd34d" stroke-width="2"/>
    <text x="68" y="86" font-size="16">🥮</text>
    <text x="92" y="86" font-size="16">🥮</text>
    <text x="116" y="86" font-size="16">🥮</text>
    <circle cx="36" cy="48" r="22" fill="none" stroke="#fcd34d" stroke-width="3"/>
    <path d="M36 26 L36 70 A22 22 0 0 1 36 26 Z" fill="#f59e0b"/>
    <text x="36" y="52" text-anchor="middle" font-size="10" font-weight="800" fill="#78350f" font-family="system-ui,sans-serif">½</text>
  </svg>`,

  'do-dat-co-thanh': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đo Đất Cổ Thành">
    <defs>
      <linearGradient id="ddct-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a8a29e"/>
        <stop offset="45%" stop-color="#d6d3d1"/>
        <stop offset="100%" stop-color="#86efac"/>
      </linearGradient>
      <pattern id="ddct-wall" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect width="6" height="8" fill="#78716c"/>
        <rect x="6" width="6" height="8" fill="#a8a29e"/>
      </pattern>
    </defs>
    <rect width="200" height="120" fill="url(#ddct-bg)" rx="12"/>
    <rect x="52" y="30" width="96" height="72" rx="6" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
    <rect x="58" y="24" width="84" height="8" fill="url(#ddct-wall)" rx="2"/>
    <g transform="translate(60 38)">
      <rect width="18" height="18" rx="2" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <rect x="22" width="18" height="18" rx="2" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <rect x="44" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="66" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect y="22" width="18" height="18" rx="2" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <rect x="22" y="22" width="18" height="18" rx="2" fill="#4ade80" stroke="#15803d" stroke-width="1"/>
      <rect x="44" y="22" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="66" y="22" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect y="44" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="22" y="44" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="44" y="44" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="66" y="44" width="18" height="18" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1" stroke-dasharray="3 2"/>
    </g>
    <text x="148" y="98" font-size="9" font-weight="800" fill="#44403c" font-family="system-ui,sans-serif">m²</text>
    <polygon points="100,18 112,34 88,34" fill="#78716c" opacity=".8"/>
  </svg>`,

  'bep-bac-hoc-tro': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bếp Bác Học Trò">
    <defs>
      <linearGradient id="bbht-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="55%" stop-color="#fed7aa"/>
        <stop offset="100%" stop-color="#fdba74"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#bbht-bg)" rx="12"/>
    <rect x="78" y="28" width="44" height="12" rx="4" fill="#57534e"/>
    <path d="M72 40 L128 40 L118 88 Q100 96 82 88 Z" fill="#292524" stroke="#1c1917" stroke-width="2"/>
    <ellipse cx="100" cy="40" rx="56" ry="8" fill="#78716c" stroke="#44403c" stroke-width="2"/>
    <text x="88" y="62" font-size="12">🥕</text>
    <text x="104" y="68" font-size="12">🧅</text>
    <text x="92" y="78" font-size="11">🍚</text>
    <rect x="68" y="92" width="64" height="10" rx="3" fill="#1c1917"/>
    <rect x="48" y="22" width="44" height="28" rx="4" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="70" y="40" text-anchor="middle" font-size="11" font-weight="800" fill="#ea580c" font-family="system-ui,sans-serif">¾</text>
    <rect x="108" y="22" width="44" height="28" rx="4" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="130" y="40" text-anchor="middle" font-size="11" font-weight="800" fill="#ea580c" font-family="system-ui,sans-serif">+</text>
  </svg>`,

  'cho-so-lieu': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chợ Số Liệu">
    <defs>
      <linearGradient id="csl-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="45%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#csl-bg)" rx="12"/>
    <text x="100" y="22" text-anchor="middle" font-size="9" font-weight="800" fill="#78350f" font-family="system-ui,sans-serif">Chợ Số Liệu</text>
    <g transform="translate(52 30)">
      <rect x="0" y="50" width="14" height="28" rx="3" fill="#3b82f6"/>
      <rect x="20" y="34" width="14" height="44" rx="3" fill="#22c55e"/>
      <rect x="40" y="42" width="14" height="36" rx="3" fill="#f59e0b"/>
      <rect x="60" y="26" width="14" height="52" rx="3" fill="#ef4444"/>
      <rect x="80" y="38" width="14" height="40" rx="3" fill="#8b5cf6"/>
      <rect x="-4" y="78" width="102" height="8" rx="2" fill="#a16207"/>
    </g>
    <circle cx="158" cy="72" r="18" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <text x="158" y="77" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f" font-family="system-ui,sans-serif">S</text>
    <circle cx="36" cy="72" r="14" fill="#e7e5e4" stroke="#a8a29e" stroke-width="2"/>
    <text x="36" y="76" text-anchor="middle" font-size="9" font-weight="800" fill="#57534e" font-family="system-ui,sans-serif">N</text>
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
