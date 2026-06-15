import type { AreaMcqChallenge } from './challengeTypes';

export const AREA_BANK: AreaMcqChallenge[] = [
  {
    prompt: 'Hình bình hành có đặc điểm nào?',
    choices: [
      'Hai cặp cạnh đối song song và bằng nhau',
      'Bốn cạnh bằng nhau',
      'Có một góc vuông',
      'Không có cạnh song song',
    ],
    correctIndex: 0,
    sgkRef: 'toan-hinh-binh-hanh',
  },
  {
    prompt: 'Vật nào thường có dạng hình bình hành?',
    choices: ['Ô cửa sổ', 'Quả cam', 'Hình tròn', 'Hình cầu'],
    correctIndex: 0,
    sgkRef: 'toan-hinh-binh-hanh',
  },
  {
    prompt: 'Hình thoi có đặc điểm nào?',
    choices: [
      'Bốn cạnh bằng nhau, cạnh đối song song',
      'Hai cạnh dài hai cạnh ngắn',
      'Chỉ có 3 cạnh',
      'Không có cạnh bằng nhau',
    ],
    correctIndex: 0,
    sgkRef: 'toan-hinh-thoi',
  },
  {
    prompt: 'Hình nào giống ô trên bàn cờ?',
    choices: ['Hình vuông', 'Hình thoi', 'Hình tròn', 'Hình tam giác'],
    correctIndex: 1,
    sgkRef: 'toan-hinh-thoi',
  },
  {
    prompt: 'Tấm thảm dài 8 m, rộng 6 m. Diện tích là?',
    choices: ['14 m²', '28 m²', '48 m²', '86 m²'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: 'Vườn vuông cạnh 12 m. Diện tích là?',
    choices: ['24 m²', '48 m²', '120 m²', '144 m²'],
    correctIndex: 3,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: '1 m² = ? dm²',
    choices: ['10', '100', '1 000', '10 000'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Viên gạch 4 dm × 4 dm có diện tích?',
    choices: ['8 dm²', '16 dm²', '16 m²', '4 dm²'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Phòng lát 250 viên gạch 4 dm × 4 dm. Diện tích phòng?',
    choices: ['250 dm²', '1 000 dm²', '4 000 dm²', '10 000 dm²'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: '1 cm² = ? mm²',
    choices: ['10', '100', '1 000', '10 000'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: 'Thẻ nhớ khoảng 14 mm × 13 mm. Diện tích gần?',
    choices: ['27 mm²', '182 mm²', '1 820 mm²', '52 mm²'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: '6 200 dm² = ? m²',
    choices: ['62', '620', '6,2', '6 200'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: 'Diện tích đo bằng đơn vị nào?',
    choices: ['mét (m)', 'mét vuông (m²)', 'kilôgam (kg)', 'giây (s)'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: 'Hình chữ nhật 5 m × 4 m có diện tích?',
    choices: ['9 m²', '18 m²', '20 m²', '25 m²'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: '1 dm² tạo bằng hình vuông cạnh bao nhiêu dm?',
    choices: ['1 dm', '2 dm', '10 dm', '100 dm'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Hình kim cương thường là dạng hình gì?',
    choices: ['Hình thoi', 'Hình tròn', 'Hình elip', 'Hình lập phương'],
    correctIndex: 0,
    sgkRef: 'toan-hinh-thoi',
  },
  {
    prompt: 'Mái che nghiêng thường giống hình gì?',
    choices: ['Hình bình hành', 'Hình cầu', 'Hình trụ', 'Hình nón'],
    correctIndex: 0,
    sgkRef: 'toan-hinh-binh-hanh',
  },
  {
    prompt: 'Sân chơi khoảng 1 m² thì kích thước gần bằng?',
    choices: ['1 m × 1 m', '10 m × 10 m', '1 cm × 1 cm', '100 m × 100 m'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-m2',
  },
];

export const AREA_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-hinh-binh-hanh', 'toan-hinh-thoi', 'toan-dien-tich-m2'],
  2: ['toan-dien-tich-dm2', 'toan-dien-tich-m2', 'toan-hinh-binh-hanh', 'toan-hinh-thoi'],
  3: [
    'toan-hinh-binh-hanh',
    'toan-hinh-thoi',
    'toan-dien-tich-m2',
    'toan-dien-tich-dm2',
    'toan-dien-tich-mm2',
  ],
};
