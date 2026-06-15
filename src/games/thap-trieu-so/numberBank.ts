import type { NumberMcqChallenge } from './challengeTypes';

/** Ngân hàng Tháp Triệu Số — số trong phạm vi 1 000 000 (soạn theo SGK, không copy đề) */
export const NUMBER_BANK: NumberMcqChallenge[] = [
  {
    prompt: 'Số "năm trăm sáu mươi nghìn" viết là số nào?',
    choices: ['560 000', '506 000', '650 000', '56 000'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Sân vận động có 40 192 chỗ ngồi. Hàng nghìn là bao nhiêu?',
    choices: ['0', '1', '4', '9'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Số nào lớn hơn: 264 115 hay 266 115?',
    choices: ['264 115', '266 115', 'Bằng nhau', 'Không so sánh được'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: 'Xếp tăng dần: 730 000; 560 000; 890 000. Số ở giữa là?',
    choices: ['560 000', '730 000', '890 000', '1 000 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: 'Làm tròn 299 460 đến hàng trăm nghìn được số nào?',
    choices: ['200 000', '300 000', '299 000', '400 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: 'Làm tròn 214 261 742 km đến hàng triệu (theo SGK) gần bằng?',
    choices: ['214 000 000', '214 260 000', '215 000 000', '200 000 000'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: '1 tấn = ? kg',
    choices: ['100', '1 000', '10 000', '100 000'],
    correctIndex: 1,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: 'Xe chở 13 tấn khoai. Cầu chịu tải 5 tấn. Xe có qua cầu được không?',
    choices: ['Được', 'Không được', 'Chỉ qua nửa xe', 'Không đủ dữ liệu'],
    correctIndex: 1,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: '1 phút 45 giây = ? giây',
    choices: ['45', '60', '105', '145'],
    correctIndex: 2,
    sgkRef: 'toan-thoi-gian-giay',
  },
  {
    prompt: 'Năm 1890 (Bác Hồ sinh) thuộc thế kỷ nào?',
    choices: ['XVIII', 'XIX', 'XX', 'XXI'],
    correctIndex: 1,
    sgkRef: 'toan-the-ky',
  },
  {
    prompt: '5 bút chì giá 30 000 đồng. Mua 8 bút hết bao nhiêu đồng?',
    choices: ['48 000', '40 000', '36 000', '60 000'],
    correctIndex: 0,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: 'Góc vuông bằng bao nhiêu độ?',
    choices: ['45°', '60°', '90°', '180°'],
    correctIndex: 2,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Đọc số 123 145: chữ số 3 ở hàng nào (đếm từ phải)?',
    choices: ['Đơn vị', 'Chục', 'Trăm', 'Nghìn'],
    correctIndex: 2,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: '1 000 000 đọc là?',
    choices: ['Một nghìn', 'Một triệu', 'Một tỉ', 'Một trăm nghìn'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Số liền sau của 999 999 là?',
    choices: ['999 998', '1 000 000', '1 000 001', '999 990'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: '10 837 = 10 000 + 800 + 30 + ?',
    choices: ['7', '37', '800', '10'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Kim đồng hồ lúc 3 giờ tạo góc khoảng bao nhiêu độ?',
    choices: ['30°', '60°', '90°', '180°'],
    correctIndex: 2,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Tai nghe giá 260 000 đồng. Làm tròn đến hàng trăm nghìn là?',
    choices: ['200 000', '300 000', '260 000', '270 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: '2 yến = ? kg (1 yến = 10 kg)',
    choices: ['2', '10', '20', '200'],
    correctIndex: 2,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: 'Năm 1975 thuộc thế kỷ nào?',
    choices: ['XVIII', 'XIX', 'XX', 'XXI'],
    correctIndex: 2,
    sgkRef: 'toan-the-ky',
  },
  {
    prompt: 'Chia 24 lít sữa đều vào 6 chai. Mỗi chai có bao nhiêu lít?',
    choices: ['3', '4', '5', '6'],
    correctIndex: 1,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: 'Góc tù lớn hơn góc vuông bao nhiêu độ?',
    choices: ['Nhỏ hơn 90°', 'Bằng 90°', 'Lớn hơn 90° và nhỏ hơn 180°', 'Bằng 180°'],
    correctIndex: 2,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'So sánh: 3 366 967 và 264 115. Số nào lớn hơn?',
    choices: ['264 115', '3 366 967', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: 'Máy ảnh chụp 2 giây/lần. 30 giây chụp được tối đa bao nhiêu lần?',
    choices: ['10', '15', '20', '60'],
    correctIndex: 1,
    sgkRef: 'toan-thoi-gian-giay',
  },
];

/** `sgkRef` được phép theo cấp danh hiệu */
export const NUMBER_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-so-trieu-doc-viet', 'toan-so-trieu-so-sanh', 'toan-the-ky'],
  2: [
    'toan-so-trieu-lam-tron',
    'toan-doi-yen-ta-tan',
    'toan-thoi-gian-giay',
    'toan-rut-ve-don-vi',
  ],
  3: [
    'toan-so-trieu-doc-viet',
    'toan-so-trieu-so-sanh',
    'toan-so-trieu-lam-tron',
    'toan-rut-ve-don-vi',
    'toan-goc-co-ban',
    'toan-doi-yen-ta-tan',
    'toan-thoi-gian-giay',
    'toan-the-ky',
  ],
};
