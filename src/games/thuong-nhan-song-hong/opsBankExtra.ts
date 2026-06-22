import type { OpsMcqChallenge } from './challengeTypes';

/** Bổ sung bank L2–L3 — tính chất, trung bình, tổng–hiệu, ước lượng, biểu thức chữ */
export const OPS_BANK_EXTRA: OpsMcqChallenge[] = [
  // Tính chất cộng (L2)
  {
    prompt: '96 + 4 + 58 = ? (nhóm 96 + 4 trước)',
    choices: ['148', '158', '168', '138'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: 'a + b = b + a thể hiện tính chất gì của phép cộng?',
    choices: ['Kết hợp', 'Giao hoán', 'Cộng với 0', 'Nhân với 1'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: '(12 + 8) + 5 = 12 + (8 + 5) thể hiện tính chất gì?',
    choices: ['Giao hoán', 'Kết hợp', 'Phân phối', 'Cộng với 0'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: 'Mẹ mua hàng 325 000 + 175 000 đồng. Tính nhanh bằng cách nào?',
    choices: ['325 000 × 2', '325 000 + 175 000', '(325 + 175) × 1 000', '500 000 − 175 000'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  // Trung bình (L2)
  {
    prompt: '4 lớp có 32, 28, 30, 34 học sinh. Trung bình mỗi lớp bao nhiêu em?',
    choices: ['30', '31', '32', '124'],
    correctIndex: 1,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: '5 ngày đọc 10, 12, 8, 14, 11 trang. Trung bình mỗi ngày đọc bao nhiêu trang?',
    choices: ['10', '11', '12', '55'],
    correctIndex: 1,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: 'Tổng 4 số là 48. Trung bình mỗi số là?',
    choices: ['10', '11', '12', '48'],
    correctIndex: 2,
    sgkRef: 'toan-stn-trung-binh',
  },
  // Tổng – hiệu (L2)
  {
    prompt: 'Tuổi bố và mẹ tổng 65, bố hơn mẹ 5 tuổi. Mẹ bao nhiêu tuổi?',
    choices: ['25', '30', '35', '40'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tong-hieu',
  },
  {
    prompt: 'Hai số có tổng 50, hiệu 10. Số lớn hơn là?',
    choices: ['20', '25', '30', '40'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tong-hieu',
  },
  {
    prompt: 'Lớp có 32 học sinh, nam nhiều hơn nữ 6 em. Có bao nhiêu bạn nữ?',
    choices: ['13', '14', '15', '19'],
    correctIndex: 0,
    sgkRef: 'toan-stn-tong-hieu',
  },
  {
    prompt: 'Hai sạp bán tổng 40 kg gạo, sạp A nhiều hơn sạp B 8 kg. Sạp B bán mấy kg?',
    choices: ['14', '16', '18', '24'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tong-hieu',
  },
  // Tính chất nhân (L2)
  {
    prompt: 'a × 1 = ? (với mọi số a)',
    choices: ['0', '1', 'a', '2a'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: '25 × 4 × 5 = ? (tính nhanh)',
    choices: ['125', '250', '500', '525'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: '6 × 25 × 4 = ? (nhóm 25 × 4 trước)',
    choices: ['600', '500', '400', '650'],
    correctIndex: 0,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: '3 thuyền, mỗi thuyền 20 sọt, mỗi sọt 10 quả = ? quả',
    choices: ['300', '600', '900', '60'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  // Ước lượng (L2)
  {
    prompt: 'Ước lượng: 48 + 52 ≈ ?',
    choices: ['90', '100', '110', '150'],
    correctIndex: 1,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'Ước lượng: 198 × 5 ≈ ? (làm tròn 198 thành 200)',
    choices: ['900', '990', '1 000', '1 100'],
    correctIndex: 2,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'Cô Hà có 100 000 đồng. Kem 34 000, dầu gội 28 000, sữa tắm 41 000. Ước lượng có đủ không?',
    choices: ['Đủ', 'Không đủ', 'Vừa hết', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'Ước lượng: 408 − 203 ≈ ?',
    choices: ['200', '210', '220', '300'],
    correctIndex: 0,
    sgkRef: 'toan-stn-uoc-luong',
  },
  // Cộng trừ số lớn (L3)
  {
    prompt: '954 321 + 45 679 = ?',
    choices: ['999 000', '1 000 000', '1 001 000', '990 000'],
    correctIndex: 1,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: '800 000 − 125 480 = ?',
    choices: ['674 520', '675 520', '684 520', '725 480'],
    correctIndex: 0,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: 'Cửa hàng có vốn 412 500 đồng, lãi thêm 26 033 đồng. Tổng số tiền là?',
    choices: ['438 533', '426 033', '448 533', '386 467'],
    correctIndex: 0,
    sgkRef: 'toan-stn-cong-tru',
  },
  // Nhân chia (L3)
  {
    prompt: '43 × 1 000 = ?',
    choices: ['430', '4 300', '43 000', '430 000'],
    correctIndex: 2,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: '252 học sinh chia đều 28 em/nhóm. Có bao nhiêu nhóm?',
    choices: ['7', '8', '9', '10'],
    correctIndex: 2,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: 'Leo núi 39 km, mỗi ngày 13 km. Cần mấy ngày?',
    choices: ['2', '3', '4', '5'],
    correctIndex: 1,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '104 cúc may ÷ 13 cúc/áo. May được bao nhiêu áo?',
    choices: ['6', '7', '8', '9'],
    correctIndex: 2,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '78 bánh ÷ 16 bánh/hộp. Đóng được tối đa bao nhiêu hộp đầy?',
    choices: ['4', '5', '6', '7'],
    correctIndex: 0,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '4 500 : 100 = ?',
    choices: ['45', '450', '4 400', '45 000'],
    correctIndex: 0,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '53 vòng × 25 m/vòng = ? m',
    choices: ['1 225', '1 275', '1 325', '1 375'],
    correctIndex: 2,
    sgkRef: 'toan-stn-nhan',
  },
  // Biểu thức chữ (L3)
  {
    prompt: 'Hình chữ nhật dài a = 8 cm, rộng b = 5 cm. Diện tích S = ?',
    choices: ['13', '26', '40', '80'],
    correctIndex: 2,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: 'Hình chữ nhật dài 8 cm, rộng 5 cm. Chu vi P = ?',
    choices: ['13', '26', '40', '80'],
    correctIndex: 1,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: '3 + a khi a = 7 có giá trị bằng?',
    choices: ['4', '10', '21', '37'],
    correctIndex: 1,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: 'Bình mua b quyển sách, Lan mua 5 quyển. Tổng số quyển là?',
    choices: ['b − 5', '5 − b', '5 + b', '5 × b'],
    correctIndex: 2,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  // Tổng hợp L3
  {
    prompt: 'Thuyền chở 75 sọt hàng mỗi chuyến, đi 120 chuyến. Tổng bao nhiêu sọt?',
    choices: ['7 500', '8 500', '9 000', '9 500'],
    correctIndex: 2,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: 'Trung bình 3 bài kiểm tra: 7, 8, 9 điểm. Điểm trung bình là?',
    choices: ['7', '8', '9', '24'],
    correctIndex: 1,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: 'Ước lượng 516 372 − 50 420 có kết quả gần?',
    choices: ['400 000', '450 000', '470 000', '500 000'],
    correctIndex: 2,
    sgkRef: 'toan-stn-uoc-luong',
  },
  // Bổ sung theo chủ đề buôn bán ven sông Hồng
  {
    prompt: 'Sạp gạo thu 124 580 đồng buổi sáng, 65 420 đồng buổi chiều. Cả ngày thu bao nhiêu?',
    choices: ['180 000', '185 000', '190 000', '200 000'],
    correctIndex: 2,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: 'Thuyền chở 8 sọt cá, mỗi sọt 125 con. Tổng bao nhiêu con cá?',
    choices: ['800', '900', '1 000', '1 200'],
    correctIndex: 2,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: '960 quả cam xếp đều vào 12 sọt. Mỗi sọt mấy quả?',
    choices: ['70', '80', '90', '96'],
    correctIndex: 1,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: 'Cửa hàng có 50 000 đồng, mua hàng hết 18 600 đồng. Còn lại bao nhiêu?',
    choices: ['21 400', '31 400', '31 600', '32 400'],
    correctIndex: 1,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: '3 phiên chợ bán được 18, 22, 20 tấm vải. Trung bình mỗi phiên bán mấy tấm?',
    choices: ['18', '19', '20', '60'],
    correctIndex: 2,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: 'Thương nhân gom 25 × 4 × 7 đồng tiền xu (tính nhanh) = ?',
    choices: ['175', '350', '700', '750'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: 'Ước lượng tiền hàng: 297 000 + 198 000 ≈ ?',
    choices: ['400 000', '450 000', '500 000', '600 000'],
    correctIndex: 2,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'Tính nhanh tiền lãi: 68 + 32 + 45 (nhóm 68 + 32 trước) = ?',
    choices: ['100', '135', '145', '155'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: 'Một chuyến buôn lãi 235 600 đồng, chuyến sau lãi 164 400 đồng. Tổng lãi?',
    choices: ['390 000', '400 000', '410 000', '420 000'],
    correctIndex: 1,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: 'Mỗi sọt hàng nặng a kg. Thuyền chở 6 sọt thì nặng bao nhiêu kg?',
    choices: ['6 + a', '6 − a', '6 × a', 'a − 6'],
    correctIndex: 2,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: 'Giá 1 tấm lụa là a đồng. Mua 4 tấm hết bao nhiêu tiền?',
    choices: ['a + 4', '4 − a', '4 × a', 'a − 4'],
    correctIndex: 2,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: '330 cân gạo chia đều vào các bao 30 cân. Cần bao nhiêu bao?',
    choices: ['9', '10', '11', '12'],
    correctIndex: 2,
    sgkRef: 'toan-stn-chia',
  },
];
