/**
 * Ảnh cờ quốc gia thật — file PNG trong public/flags/world-cup-2026/.
 * Nguồn: Wikimedia Commons qua https://flagcdn.com (ISO 3166-1).
 */

const FLAG_BASE = `${import.meta.env.BASE_URL}flags/world-cup-2026/`;

/** countryId → tên file PNG (tải từ flagcdn, không tự vẽ). */
const FLAG_FILES: Record<string, string> = {
  usa: 'usa.png',
  mexico: 'mexico.png',
  canada: 'canada.png',
  brazil: 'brazil.png',
  argentina: 'argentina.png',
  france: 'france.png',
  germany: 'germany.png',
  spain: 'spain.png',
  england: 'england.png',
  japan: 'japan.png',
  morocco: 'morocco.png',
  portugal: 'portugal.png',
};

export function getCountryFlagUrl(countryId: string): string | null {
  const file = FLAG_FILES[countryId];
  return file ? `${FLAG_BASE}${file}` : null;
}

export function getCountryFlagAlt(countryName: string): string {
  return `Quốc kỳ ${countryName}`;
}
