import type { NumberMcqChallenge } from './challengeTypes';

/** Bổ sung bank L2–L3 — số lớn, làm tròn, đơn vị, bài toán rút về đơn vị, góc */
export const NUMBER_BANK_EXTRA: NumberMcqChallenge[] = [
  // Làm tròn (L2)
  {
    prompt: 'Làm tròn 456 780 đến hàng trăm nghìn được số nào?',
    choices: ['400 000', '500 000', '460 000', '450 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: 'Làm tròn 148 200 đến hàng trăm nghìn được số nào?',
    choices: ['100 000', '200 000', '150 000', '140 000'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: 'Làm tròn 672 500 đến hàng trăm nghìn được số nào?',
    choices: ['600 000', '700 000', '670 000', '680 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: 'Giá tủ lạnh 4 890 000 đồng. Làm tròn đến hàng triệu gần bằng?',
    choices: ['4 000 000', '5 000 000', '4 900 000', '4 800 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  {
    prompt: 'Khoảng cách 214 261 742 km làm tròn đến hàng trăm nghìn km là?',
    choices: ['214 260 000', '214 300 000', '214 000 000', '215 000 000'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
  // Yến, tạ, tấn (L2)
  {
    prompt: '3 tạ = ? kg',
    choices: ['30', '300', '3 000', '300 000'],
    correctIndex: 1,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: '5 yến = ? kg',
    choices: ['5', '50', '500', '5 000'],
    correctIndex: 1,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: '2 tấn 500 kg = ? kg',
    choices: ['2 050', '2 500', '250', '25 000'],
    correctIndex: 1,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: 'Voi nặng khoảng 4 tấn. Đơn vị phù hợp nhất là?',
    choices: ['kg', 'yến', 'tạ', 'tấn'],
    correctIndex: 3,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  {
    prompt: 'Mèo nặng khoảng 4 kg. 4 tấn gấp 4 kg bao nhiêu lần?',
    choices: ['10 lần', '100 lần', '1 000 lần', '10 000 lần'],
    correctIndex: 2,
    sgkRef: 'toan-doi-yen-ta-tan',
  },
  // Giây, phút (L2)
  {
    prompt: '2 phút 30 giây = ? giây',
    choices: ['120', '130', '150', '230'],
    correctIndex: 2,
    sgkRef: 'toan-thoi-gian-giay',
  },
  {
    prompt: '90 giây = ? phút ? giây',
    choices: ['1 phút 30 giây', '9 phút 0 giây', '1 phút 20 giây', '2 phút 30 giây'],
    correctIndex: 0,
    sgkRef: 'toan-thoi-gian-giay',
  },
  {
    prompt: '3 phút = ? giây',
    choices: ['60', '120', '180', '300'],
    correctIndex: 2,
    sgkRef: 'toan-thoi-gian-giay',
  },
  {
    prompt: 'Vận động viên chạy 2 phút 15 giây. Tổng số giây là?',
    choices: ['115', '125', '135', '215'],
    correctIndex: 2,
    sgkRef: 'toan-thoi-gian-giay',
  },
  {
    prompt: 'Máy ảnh chụp 3 giây/lần. Trong 1 phút chụp tối đa bao nhiêu lần?',
    choices: ['10', '20', '30', '60'],
    correctIndex: 1,
    sgkRef: 'toan-thoi-gian-giay',
  },
  // Rút về đơn vị (L2)
  {
    prompt: '6 quyển vở giá 42 000 đồng. Mua 10 quyển hết bao nhiêu đồng?',
    choices: ['60 000', '70 000', '80 000', '420 000'],
    correctIndex: 1,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: '20 viên thuốc chia đều vào 4 vỉ. Mỗi vỉ có bao nhiêu viên?',
    choices: ['4', '5', '6', '8'],
    correctIndex: 1,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: '4 kg gạo chia đều vào 8 túi. Mỗi túi có bao nhiêu gam?',
    choices: ['50 g', '500 g', '5 000 g', '400 g'],
    correctIndex: 1,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: '3 lít sữa đổ đều vào 6 cốc. Mỗi cốc có bao nhiêu ml? (1 lít = 1 000 ml)',
    choices: ['250 ml', '500 ml', '750 ml', '1 500 ml'],
    correctIndex: 1,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: '12 hộp bánh, mỗi hộp 8 cái. Có tất cả bao nhiêu cái bánh?',
    choices: ['20', '84', '96', '104'],
    correctIndex: 2,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  // So sánh & đọc số (L3)
  {
    prompt: 'Số "một triệu hai trăm ba mươi nghìn" viết là?',
    choices: ['1 230 000', '1 203 000', '1 023 000', '123 000'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: '200 000 + 60 000 + 5 000 + 400 + 20 + 3 = ?',
    choices: ['265 423', '260 523', '265 043', '256 423'],
    correctIndex: 0,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Số liền trước của 1 000 000 là?',
    choices: ['999 998', '999 999', '1 000 001', '999 990'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: 'Xếp giảm dần: 890 000; 730 000; 1 000 000. Số lớn nhất là?',
    choices: ['730 000', '890 000', '1 000 000', '560 000'],
    correctIndex: 2,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  {
    prompt: 'Dân số Hà Nội khoảng 8 triệu, TP.HCM khoảng 9 triệu. Thành phố nào đông hơn?',
    choices: ['Hà Nội', 'TP.HCM', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-so-sanh',
  },
  // Thế kỷ (L3)
  {
    prompt: 'Ba Triệu sinh năm 226 thuộc thế kỷ nào?',
    choices: ['II', 'III', 'IV', 'XXII'],
    correctIndex: 1,
    sgkRef: 'toan-the-ky',
  },
  {
    prompt: 'Năm 2024 thuộc thế kỷ nào?',
    choices: ['XIX', 'XX', 'XXI', 'XXII'],
    correctIndex: 2,
    sgkRef: 'toan-the-ky',
  },
  {
    prompt: '1 thế kỷ = ? năm',
    choices: ['10', '50', '100', '1 000'],
    correctIndex: 2,
    sgkRef: 'toan-the-ky',
  },
  // Góc (L3)
  {
    prompt: 'Góc nhọn có số đo như thế nào?',
    choices: ['Bằng 90°', 'Lớn hơn 90°', 'Nhỏ hơn 90°', 'Bằng 180°'],
    correctIndex: 2,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Góc bẹt bằng bao nhiêu độ?',
    choices: ['90°', '120°', '180°', '360°'],
    correctIndex: 2,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Kim đồng hồ lúc 6 giờ tạo góc khoảng bao nhiêu độ?',
    choices: ['90°', '120°', '150°', '180°'],
    correctIndex: 3,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Kim đồng hồ lúc 9 giờ tạo góc khoảng bao nhiêu độ?',
    choices: ['60°', '90°', '120°', '180°'],
    correctIndex: 1,
    sgkRef: 'toan-goc-co-ban',
  },
  {
    prompt: 'Góc đỉnh I đo được 60°. Đây là góc gì?',
    choices: ['Vuông', 'Nhọn', 'Tù', 'Bẹt'],
    correctIndex: 1,
    sgkRef: 'toan-goc-co-ban',
  },
  // Bài toán tổng hợp L3
  {
    prompt: '5 bút 30 000 đồng. Mua 3 bút hết bao nhiêu đồng?',
    choices: ['6 000', '15 000', '18 000', '24 000'],
    correctIndex: 2,
    sgkRef: 'toan-rut-ve-don-vi',
  },
  {
    prompt: 'Sân Thiên Trường 30 000 chỗ, Mỹ Đình 40 192 chỗ. Hai sân gộp khoảng bao nhiêu chỗ?',
    choices: ['60 000', '70 000', '70 192', '80 192'],
    correctIndex: 2,
    sgkRef: 'toan-so-trieu-doc-viet',
  },
  {
    prompt: 'Làm tròn 385 640 đến hàng trăm nghìn, rồi cộng 100 000 được?',
    choices: ['400 000', '500 000', '485 640', '600 000'],
    correctIndex: 1,
    sgkRef: 'toan-so-trieu-lam-tron',
  },
];
