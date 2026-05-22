export interface ClassifyItem {
  id: string;
  label: string;
  emoji: string;
  bin: 'dong-vat' | 'thuc-vat' | 'hien-tuong';
}

export const BINS = [
  { id: 'dong-vat' as const, label: 'Động vật', emoji: '🐟' },
  { id: 'thuc-vat' as const, label: 'Thực vật', emoji: '🌿' },
  { id: 'hien-tuong' as const, label: 'Hiện tượng', emoji: '🌊' },
];

export const ITEMS: ClassifyItem[] = [
  { id: '1', label: 'Cá basa', emoji: '🐟', bin: 'dong-vat' },
  { id: '2', label: 'Cây đước', emoji: '🌳', bin: 'thuc-vat' },
  { id: '3', label: 'Cua đồng', emoji: '🦀', bin: 'dong-vat' },
  { id: '4', label: 'Măng cụt', emoji: '🍇', bin: 'thuc-vat' },
  { id: '5', label: 'Trăn nước', emoji: '🐍', bin: 'dong-vat' },
  { id: '6', label: 'Dừa nước', emoji: '🥥', bin: 'thuc-vat' },
  { id: '7', label: 'Nước lũ', emoji: '🌊', bin: 'hien-tuong' },
  { id: '8', label: 'Rừng ngập mặn', emoji: '🌴', bin: 'thuc-vat' },
  { id: '9', label: 'Cá lóc', emoji: '🐠', bin: 'dong-vat' },
  { id: '10', label: 'Sương mù', emoji: '🌫️', bin: 'hien-tuong' },
  { id: '11', label: 'Cá tra', emoji: '🐟', bin: 'dong-vat' },
  { id: '12', label: 'Lúa nước', emoji: '🌾', bin: 'thuc-vat' },
  { id: '13', label: 'Mưa giông', emoji: '⛈️', bin: 'hien-tuong' },
  { id: '14', label: 'Bèo tây', emoji: '🍃', bin: 'thuc-vat' },
  { id: '15', label: 'Cò trắng', emoji: '🕊️', bin: 'dong-vat' },
  { id: '16', label: 'Cây bần', emoji: '🌳', bin: 'thuc-vat' },
  { id: '17', label: 'Hạn mặn', emoji: '☀️', bin: 'hien-tuong' },
  { id: '18', label: 'Tôm sú', emoji: '🦐', bin: 'dong-vat' },
  { id: '19', label: 'Rau muống', emoji: '🥬', bin: 'thuc-vat' },
  { id: '20', label: 'Triều cường', emoji: '🌊', bin: 'hien-tuong' },
  { id: '21', label: 'Ốc bươu', emoji: '🐌', bin: 'dong-vat' },
  { id: '22', label: 'Cây tràm', emoji: '🌲', bin: 'thuc-vat' },
  { id: '23', label: 'Mưa phùn', emoji: '🌧️', bin: 'hien-tuong' },
  { id: '24', label: 'Chim le le', emoji: '🦆', bin: 'dong-vat' },
  { id: '25', label: 'Hoa sen', emoji: '🪷', bin: 'thuc-vat' },
  { id: '26', label: 'Gió mùa', emoji: '💨', bin: 'hien-tuong' },
  { id: '27', label: 'Cá linh', emoji: '🐟', bin: 'dong-vat' },
  { id: '28', label: 'Rau đay', emoji: '🥗', bin: 'thuc-vat' },
  { id: '29', label: 'Sét đánh', emoji: '⚡', bin: 'hien-tuong' },
  { id: '30', label: 'Ếch đồng', emoji: '🐸', bin: 'dong-vat' },
];

export function itemCount(level: 1 | 2 | 3): number {
  if (level === 1) return 6;
  if (level === 2) return 8;
  return 10;
}

export function pickItems(level: 1 | 2 | 3): ClassifyItem[] {
  const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, itemCount(level));
}

export function timePerItemMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 22000;
  return 20000;
}
