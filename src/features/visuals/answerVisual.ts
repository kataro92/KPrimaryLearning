const PALETTES: Array<[string, string]> = [
  ['#60a5fa', '#2563eb'],
  ['#34d399', '#059669'],
  ['#fbbf24', '#d97706'],
  ['#f472b6', '#be185d'],
  ['#a78bfa', '#7c3aed'],
  ['#fb7185', '#e11d48'],
  ['#22d3ee', '#0891b2'],
  ['#a3e635', '#65a30d'],
];

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function paletteBySeed(seed: string): [string, string] {
  return PALETTES[hashSeed(seed) % PALETTES.length] ?? PALETTES[0];
}

export function makeVisualCardDataUrl(input: {
  title: string;
  subtitle?: string;
  seed: string;
}): string {
  const [c1, c2] = paletteBySeed(input.seed);
  const title = input.title.toUpperCase().slice(0, 16);
  const subtitle = (input.subtitle ?? '').slice(0, 18);
  const monogram = title.slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="28" fill="url(#g)"/>
  <circle cx="120" cy="92" r="56" fill="rgba(255,255,255,0.22)"/>
  <circle cx="120" cy="92" r="42" fill="rgba(255,255,255,0.35)"/>
  <text x="120" y="108" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="white">${monogram}</text>
  <rect x="22" y="154" width="196" height="58" rx="14" fill="rgba(15,23,42,0.24)"/>
  <text x="120" y="180" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" font-weight="700" fill="white">${title}</text>
  <text x="120" y="201" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.95)">${subtitle}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
