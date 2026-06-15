import type { FractionMcqChallenge } from './challengeTypes';

export const FRACTION_BANK_EXTRA: FractionMcqChallenge[] = [
  {
    prompt: 'Chia hình vuông 8 phần bằng nhau, tô 5 phần. Phân số là?',
    choices: ['5/8', '8/5', '3/8', '5/5'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Phân số "ba phần năm" viết là?',
    choices: ['3/5', '5/3', '3/3', '5/5'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Dây lụa cắt 6 đoạn bằng nhau. Mỗi đoạn là phần nào của dây?',
    choices: ['1/5', '1/6', '6/1', '1/7'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-chia',
  },
  {
    prompt: '1 hộp nho chia 4 túi. Mỗi túi được?',
    choices: ['1/4 hộp', '4 hộp', '1/3 hộp', '4/4 hộp'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-chia',
  },
  {
    prompt: '2/5 và 4/10 có quan hệ gì?',
    choices: ['Bằng nhau', '2/5 lớn hơn', '4/10 lớn hơn', 'Không liên quan'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-bang-nhau',
  },
  {
    prompt: '3/6 rút gọn được?',
    choices: ['1/2', '1/3', '2/3', '3/2'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-rut-gon',
  },
  {
    prompt: '15/20 rút gọn được?',
    choices: ['3/4', '5/4', '1/4', '15/20'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-rut-gon',
  },
  {
    prompt: '3/5 = ?/20',
    choices: ['10', '12', '15', '16'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-quy-dong',
  },
  {
    prompt: '1/6 và 3/5 quy đồng mẫu 30. 1/6 = ?/30',
    choices: ['5', '6', '10', '15'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-quy-dong',
  },
  {
    prompt: 'Chia tử và mẫu cùng 3: 6/9 = ?',
    choices: ['2/3', '3/2', '1/3', '6/9'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-tinh-chat',
  },
  {
    prompt: '4/8 = 1/2 vì đã làm gì?',
    choices: ['Chia tử và mẫu cùng 4', 'Cộng thêm 4', 'Nhân mẫu với 2', 'Đổi chỗ tử mẫu'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-tinh-chat',
  },
  {
    prompt: 'So sánh 2/9 và 7/9. Phân số lớn hơn là?',
    choices: ['2/9', '7/9', 'Bằng nhau', '9/9'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-cung-mau',
  },
  {
    prompt: 'So sánh 1/4 và 2/4. Phân số nào bé hơn?',
    choices: ['1/4', '2/4', 'Bằng nhau', 'Không so sánh'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-so-sanh-cung-mau',
  },
  {
    prompt: '2/3 và 5/6 quy đồng mẫu 6. 2/3 = ?/6',
    choices: ['2', '3', '4', '5'],
    correctIndex: 2,
    sgkRef: 'toan-phan-so-so-sanh-khac-mau',
  },
  {
    prompt: 'So sánh 2/3 và 5/6 sau quy đồng. Phân số lớn hơn?',
    choices: ['2/3', '5/6', 'Bằng nhau', '1/2'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-khac-mau',
  },
  {
    prompt: 'Nam dán 1/6 pano, Trang dán 3/5 pano. Ai dán nhiều hơn?',
    choices: ['Nam', 'Trang', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-khac-mau',
  },
  {
    prompt: 'Phân số nào lớn hơn 1?',
    choices: ['5/6', '4/4', '7/6', '2/5'],
    correctIndex: 2,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: '5/5 + 1/5 = ? (cùng mẫu, chưa học cộng — nhận biết)',
    choices: ['6/5', '6/10', '1/5', '5/5'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
  },
];
