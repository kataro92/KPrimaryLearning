import type { FractionMcqChallenge } from './challengeTypes';

/** Câu có hình tô phần — L1/L2 nhận biết phân số */
export const FRACTION_VISUAL_BANK: FractionMcqChallenge[] = [
  {
    prompt: 'Hình tròn chia 4 phần bằng nhau, tô 3 phần. Phân số tô màu là?',
    choices: ['1/4', '3/4', '4/3', '3/3'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'circle', parts: 4, shaded: 3 },
  },
  {
    prompt: 'Hình tròn chia 4 phần, tô 1 phần. Phân số là?',
    choices: ['1/4', '1/2', '3/4', '4/1'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'circle', parts: 4, shaded: 1 },
  },
  {
    prompt: 'Hình tròn chia 2 phần bằng nhau, tô 1 phần. Phân số là?',
    choices: ['1/2', '2/1', '1/3', '2/2'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'circle', parts: 2, shaded: 1 },
  },
  {
    prompt: 'Hình vuông chia 4 phần, tô 2 phần. Phân số là?',
    choices: ['1/4', '1/2', '2/4', '4/2'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-bang-nhau',
    visual: { shape: 'rect', parts: 4, shaded: 2, cols: 2 },
  },
  {
    prompt: 'Hình chia 8 phần bằng nhau, tô 5 phần. Phân số là?',
    choices: ['5/8', '8/5', '3/8', '5/5'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'rect', parts: 8, shaded: 5, cols: 4 },
  },
  {
    prompt: 'Hình chia 6 phần, tô 4 phần. Phân số là?',
    choices: ['2/3', '4/6', '1/2', '4/3'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-rut-gon',
    visual: { shape: 'rect', parts: 6, shaded: 4, cols: 3 },
  },
  {
    prompt: 'Hình tròn chia 5 phần, tô 2 phần. Phân số là?',
    choices: ['2/5', '5/2', '3/5', '2/2'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'circle', parts: 5, shaded: 2 },
  },
  {
    prompt: 'Hình chia 3 phần, tô hết. Phân số bằng?',
    choices: ['1/3', '2/3', '1', '3/1'],
    correctIndex: 2,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'rect', parts: 3, shaded: 3, cols: 3 },
  },
  {
    prompt: 'Hình tròn chia 6 phần, tô 1 phần. Phân số là?',
    choices: ['1/6', '1/5', '5/6', '6/1'],
    correctIndex: 0,
    sgkRef: 'toan-phan-so-chia',
    visual: { shape: 'circle', parts: 6, shaded: 1 },
  },
  {
    prompt: 'Hình vuông chia 4 phần, tô 3 phần. Phân số là?',
    choices: ['1/4', '3/4', '4/3', '1/3'],
    correctIndex: 1,
    sgkRef: 'toan-phan-so-khai-niem',
    visual: { shape: 'rect', parts: 4, shaded: 3, cols: 2 },
  },
];
