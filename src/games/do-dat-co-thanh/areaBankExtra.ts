import type { AreaMcqChallenge } from './challengeTypes';

export const AREA_BANK_EXTRA: AreaMcqChallenge[] = [
  {
    prompt: 'Ghép que tính tạo hình bình hành cần ít nhất mấy que?',
    choices: ['3', '4', '5', '6'],
    correctIndex: 1,
    sgkRef: 'toan-hinh-binh-hanh',
  },
  {
    prompt: 'Hình thoi có bao nhiêu cạnh?',
    choices: ['3', '4', '5', '6'],
    correctIndex: 1,
    sgkRef: 'toan-hinh-thoi',
  },
  {
    prompt: 'Hình vuông có phải hình thoi không?',
    choices: ['Có', 'Không', 'Chỉ khi cạnh 10 cm', 'Không xác định'],
    correctIndex: 0,
    sgkRef: 'toan-hinh-thoi',
  },
  {
    prompt: 'Phòng học ước lượng diện tích khoảng 40 m². Hợp lý nhất là?',
    choices: ['40 m²', '4 m²', '400 m²', '4 000 m²'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: 'Thảm 3 m × 7 m. Diện tích?',
    choices: ['10 m²', '21 m²', '24 m²', '42 m²'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: '2 m² = ? dm²',
    choices: ['20', '200', '2 000', '20 000'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: '100 dm² = ? m²',
    choices: ['0,1', '1', '10', '100'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Sàn phòng 5 m × 8 m = ? m²',
    choices: ['13', '26', '40', '80'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: 'Gạch 2 dm × 2 dm. Diện tích mỗi viên?',
    choices: ['2 dm²', '4 dm²', '4 m²', '8 dm²'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Phím máy tính 13 mm × 14 mm. Diện tích gần?',
    choices: ['27 mm²', '182 mm²', '52 mm²', '1 820 mm²'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: '500 mm² = ? cm²',
    choices: ['5', '50', '500', '5 000'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: '1 m² = 10 000 cm². 2 m² = ? cm²',
    choices: ['2 000', '20 000', '200 000', '2 000 000'],
    correctIndex: 1,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: '3 100 dm² = ? m²',
    choices: ['31', '310', '3 100', '310 000'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-mm2',
  },
  {
    prompt: 'Vườn 15 m × 10 m. Diện tích bao nhiêu m²?',
    choices: ['25', '50', '150', '1 500'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-m2',
  },
  {
    prompt: 'Hình bình hành: cạnh đối có quan hệ gì?',
    choices: ['Song song và bằng nhau', 'Vuông góc', 'Không liên quan', 'Chỉ bằng nhau'],
    correctIndex: 0,
    sgkRef: 'toan-hinh-binh-hanh',
  },
  {
    prompt: 'Lát nền 100 viên gạch 2 dm × 2 dm. Diện tích?',
    choices: ['100 dm²', '200 dm²', '400 dm²', '4 000 dm²'],
    correctIndex: 2,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'So sánh: 1 m² và 100 dm²',
    choices: ['Bằng nhau', '1 m² lớn hơn', '100 dm² lớn hơn', 'Không so sánh được'],
    correctIndex: 0,
    sgkRef: 'toan-dien-tich-dm2',
  },
  {
    prompt: 'Hình thoi có góc vuông không? (hình thoi thường)',
    choices: ['Luôn có', 'Không nhất thiết', 'Không bao giờ', 'Có 3 góc vuông'],
    correctIndex: 1,
    sgkRef: 'toan-hinh-thoi',
  },
];
