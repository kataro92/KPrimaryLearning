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
    prompt: '18 bạn tình nguyện, nam nhiều hơn nữ 4. Có bao nhiêu bạn nữ?',
    choices: ['5', '7', '9', '11'],
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
    prompt: '3 tòa × 20 tầng × 10 căn = ? căn',
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
    prompt: 'Ước lượng: 412 − 198 ≈ ?',
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
    prompt: 'Số thuê bao Internet tăng thêm 26 033. Trước đó 412 500. Sau tăng là?',
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
    prompt: 'Tim đập 75 lần/phút. Trong 2 giờ đập khoảng bao nhiêu lần?',
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
];
