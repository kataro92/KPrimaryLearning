import type { FracOpsMcqChallenge } from './challengeTypes';

export const FRAC_OPS_BANK: FracOpsMcqChallenge[] = [
  {
    prompt: '5/9 + 2/9 = ?',
    choices: ['7/9', '7/18', '3/9', '10/9'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-cong-cung-mau',
  },
  {
    prompt: '2/9 + 5/9 = ? (đội sửa đường 2 ngày)',
    choices: ['7/9', '7/18', '3/9', '1/9'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-cong-cung-mau',
  },
  {
    prompt: '2/5 + 1/5 = ? (vòi nước chảy vào bể)',
    choices: ['3/5', '3/10', '1/5', '4/5'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-cong-cung-mau',
  },
  {
    prompt: '7/8 − 2/8 = ?',
    choices: ['5/8', '5/16', '9/8', '1/8'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-tru-cung-mau',
  },
  {
    prompt: '3/4 − 1/4 = ? (dung lượng ổ cứng)',
    choices: ['1/4', '1/2', '2/4', '4/4'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-tru-cung-mau',
  },
  {
    prompt: '1/4 + 1/2 = ? (quy đồng mẫu rồi cộng)',
    choices: ['2/6', '3/4', '1/3', '2/4'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-cong-khac-mau',
  },
  {
    prompt: '1/3 + 2/5 = ?',
    choices: ['3/8', '11/15', '3/15', '5/8'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-cong-khac-mau',
  },
  {
    prompt: 'Ngày 1 xây 1/4 tường, ngày 2 xây 1/2 tường. Hai ngày làm được?',
    choices: ['2/6', '3/4', '1/4', '5/8'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-cong-khac-mau',
  },
  {
    prompt: 'Vườn cải rốt 3/10, bắp cải 2/5. Bắp cải rộng hơn bao nhiêu?',
    choices: ['1/10', '1/5', '3/10', '5/10'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-tru-khac-mau',
  },
  {
    prompt: '5/6 − 1/3 = ?',
    choices: ['4/3', '1/2', '1/3', '4/6'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-tru-khac-mau',
  },
  {
    prompt: '3/4 × 1/2 = ? (chiều dài × chiều rộng)',
    choices: ['3/8', '4/6', '1/2', '3/6'],
    correctIndex: 0,
    sgkRef: 'toan-ptps-nhan',
  },
  {
    prompt: '2/3 × 3/5 = ?',
    choices: ['5/8', '6/15', '2/5', '1/3'],
    correctIndex: 2,
    sgkRef: 'toan-ptps-nhan',
  },
  {
    prompt: '3/4 của 12 quả bóng là bao nhiêu quả?',
    choices: ['6', '8', '9', '12'],
    correctIndex: 2,
    sgkRef: 'toan-ptps-phan-so-cua-so',
  },
  {
    prompt: '2/5 của 660 kg cà phê là bao nhiêu kg?',
    choices: ['220', '264', '330', '440'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-phan-so-cua-so',
  },
  {
    prompt: '3/4 của 20 quyển sách là bao nhiêu quyển?',
    choices: ['12', '15', '16', '18'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-phan-so-cua-so',
  },
  {
    prompt: '3/4 : 1/3 = ? (nhân với phân số đảo ngược)',
    choices: ['1/4', '9/4', '4/9', '3/12'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-chia',
  },
  {
    prompt: '1/2 : 1/4 = ?',
    choices: ['1/8', '2', '1/2', '4'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-chia',
  },
  {
    prompt: '2/5 : 1/3 = ?',
    choices: ['2/15', '6/5', '3/10', '1/5'],
    correctIndex: 1,
    sgkRef: 'toan-ptps-chia',
  },
];

export const FRAC_OPS_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-ptps-cong-cung-mau', 'toan-ptps-tru-cung-mau'],
  2: ['toan-ptps-cong-khac-mau', 'toan-ptps-tru-khac-mau', 'toan-ptps-phan-so-cua-so'],
  3: [
    'toan-ptps-cong-cung-mau',
    'toan-ptps-tru-cung-mau',
    'toan-ptps-cong-khac-mau',
    'toan-ptps-tru-khac-mau',
    'toan-ptps-nhan',
    'toan-ptps-phan-so-cua-so',
    'toan-ptps-chia',
  ],
};
