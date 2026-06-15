import type { FractionMcqChallenge } from './challengeTypes';

export const FRACTION_BANK: FractionMcqChallenge[] = [
  {
    prompt: 'Chia hình tròn 4 phần bằng nhau, tô 3 phần. Phân số tô màu là?',
    choices: ['1/4', '3/4', '4/3', '3/3'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Trong phân số 5/8, số 5 gọi là?',
    choices: ['Mẫu số', 'Tử số', 'Thương số', 'Số chia'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Trong phân số 5/8, số 8 gọi là?',
    choices: ['Tử số', 'Mẫu số', 'Số bị chia', 'Số dư'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Phân số "một phần hai" viết là?',
    choices: ['1/2', '2/1', '1/3', '2/2'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: '6/6 bằng số nào?',
    choices: ['0', '1', '6', '1/6'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: '3 bánh chia đều 4 người. Mỗi người được bao nhiêu bánh?',
    choices: ['3/4 bánh', '4/3 bánh', '3 bánh', '1/4 bánh'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-chia',
  },
  {
    prompt: '3 : 4 viết thành phân số là?',
    choices: ['4/3', '3/4', '3 − 4', '3 × 4'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-chia',
  },
  {
    prompt: '1 hộp nho chia đều 5 túi. Mỗi túi được phần nào hộp?',
    choices: ['1/5', '5/1', '1/4', '5/5'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-chia',
  },
  {
    prompt: 'Phân số nào bằng 1/2?',
    choices: ['2/4', '1/3', '3/5', '4/6'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-bang-nhau',
  },
  {
    prompt: '1/2, 2/4 và 4/8 có quan hệ gì?',
    choices: ['Bằng nhau', 'Khác nhau hoàn toàn', 'Chỉ 1/2 và 2/4 bằng', 'Không so sánh được'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-bang-nhau',
  },
  {
    prompt: 'Rút gọn 9/12 được?',
    choices: ['3/4', '9/12', '1/3', '4/9'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-rut-gon',
  },
  {
    prompt: 'Rút gọn 12/16 được?',
    choices: ['2/3', '3/4', '4/3', '6/8'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-rut-gon',
  },
  {
    prompt: 'Quy đồng mẫu 1/4 và 3/5. Mẫu chung nhỏ nhất là?',
    choices: ['9', '20', '25', '40'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-quy-dong',
  },
  {
    prompt: '1/4 = ?/20',
    choices: ['4', '5', '6', '8'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-quy-dong',
  },
  {
    prompt: 'So sánh 3/7 và 5/7. Phân số nào lớn hơn?',
    choices: ['3/7', '5/7', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-cung-mau',
  },
  {
    prompt: 'Lan tô 1/4 giấy, Hoa tô 3/5 giấy (cùng tờ). Ai tô nhiều hơn?',
    choices: ['Lan', 'Hoa', 'Bằng nhau', 'Không đủ dữ liệu'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-khac-mau',
  },
  {
    prompt: 'Minh còn 2/3 bánh, Thảo còn 5/6 bánh. Ai còn nhiều hơn?',
    choices: ['Minh', 'Thảo', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-so-sanh-khac-mau',
  },
  {
    prompt: '7/6 so với 1 thì?',
    choices: ['Bé hơn 1', 'Bằng 1', 'Lớn hơn 1', 'Bằng 0'],
    correctIndex: 2,
    sgkRef: 'toan-phan-so-khai-niem',
  },
  {
    prompt: 'Nhân tử và mẫu cùng 2: 1/3 = ?/6',
    choices: ['1/6', '2/6', '2/3', '3/6'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-tinh-chat',
  },
  {
    prompt: 'Biển báo "ngăn 2/5 lòng đường". Phần còn lại là?',
    choices: ['2/5', '3/5', '1/5', '5/2'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
  },
];

export const FRACTION_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-phan-so-khai-niem', 'toan-phan-so-chia'],
  2: ['toan-phan-so-bang-nhau', 'toan-phan-so-rut-gon', 'toan-phan-so-quy-dong', 'toan-phan-so-tinh-chat'],
  3: [
    'toan-phan-so-khai-niem',
    'toan-phan-so-chia',
    'toan-phan-so-bang-nhau',
    'toan-phan-so-rut-gon',
    'toan-phan-so-quy-dong',
    'toan-phan-so-so-sanh-cung-mau',
    'toan-phan-so-so-sanh-khac-mau',
    'toan-phan-so-tinh-chat',
  ],
};
