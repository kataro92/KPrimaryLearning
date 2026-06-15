import type { StatsMcqChallenge } from './challengeTypes';
import { barChartHtml } from './statsChart';

export const STATS_BANK: StatsMcqChallenge[] = [
  {
    prompt: 'Dãy điểm bóng rổ: 12, 16, 19, 7, 20. Điểm cao nhất là?',
    choices: ['12', '16', '19', '20'],
    correctIndex: 3,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dãy điểm: 12, 16, 19, 7, 20. Điểm thấp nhất là?',
    choices: ['7', '12', '16', '20'],
    correctIndex: 0,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Sách bán tháng 3: 120, tháng 4: 150. Tháng nào bán nhiều hơn?',
    choices: ['Tháng 3', 'Tháng 4', 'Bằng nhau', 'Không biết'],
    correctIndex: 1,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Chiều cao 4 bạn: 130, 135, 128, 140 cm. Bạn cao nhất cao bao nhiêu cm?',
    choices: ['128', '135', '140', '130'],
    correctIndex: 2,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Theo biểu đồ, loài vật nào được chọn nuôi nhiều nhất?',
    choices: ['Chó', 'Mèo', 'Bằng nhau', 'Chim'],
    correctIndex: 0,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Bạn chọn nuôi (lớp 4A)', [
      { label: 'Chó', value: 8, color: '#f59e0b' },
      { label: 'Mèo', value: 6, color: '#8b5cf6' },
      { label: 'Chim', value: 3, color: '#22c55e' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ, chó nhiều hơn mèo bao nhiêu bạn?',
    choices: ['1', '2', '3', '8'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Bạn chọn nuôi (lớp 4A)', [
      { label: 'Chó', value: 8, color: '#f59e0b' },
      { label: 'Mèo', value: 6, color: '#8b5cf6' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ xuất khẩu 2020, mặt hàng nào nhiều nhất?',
    choices: ['Hạt điều', 'Cà phê', 'Chè', 'Bằng nhau'],
    correctIndex: 0,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Xuất khẩu (nghìn tấn)', [
      { label: 'Điều', value: 45, color: '#d97706' },
      { label: 'Cà phê', value: 30, color: '#78350f' },
      { label: 'Chè', value: 12, color: '#16a34a' },
    ]),
  },
  {
    prompt: 'Tung đồng xu 5 lần: S, N, S, S, N. Mặt S xuất hiện mấy lần?',
    choices: ['2', '3', '4', '5'],
    correctIndex: 1,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Gieo xúc xắc 10 lần, số 6 xuất hiện 2 lần. Số 6 xuất hiện bao nhiêu lần?',
    choices: ['1', '2', '6', '10'],
    correctIndex: 1,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Quay kim 10 lần: xanh 4, đỏ 3, vàng 3. Màu nào nhiều nhất?',
    choices: ['Xanh', 'Đỏ', 'Vàng', 'Bằng nhau'],
    correctIndex: 0,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Dãy: 5, 8, 8, 10, 12. Số 8 xuất hiện mấy lần?',
    choices: ['1', '2', '3', '4'],
    correctIndex: 1,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Theo biểu đồ, nghề được chọn nhiều thứ hai là?',
    choices: ['Bác sĩ', 'Giáo viên', 'Kỹ sư', 'Nông dân'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Nghề tương lai (lớp 4A)', [
      { label: 'Bác sĩ', value: 10, color: '#ef4444' },
      { label: 'Giáo viên', value: 8, color: '#3b82f6' },
      { label: 'Kỹ sư', value: 5, color: '#a855f7' },
      { label: 'Nông dân', value: 3, color: '#22c55e' },
    ]),
  },
];

export const STATS_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-tk-day-so', 'toan-tk-bieu-do-cot'],
  2: ['toan-tk-bieu-do-cot', 'toan-tk-dem-su-kien', 'toan-tk-day-so'],
  3: ['toan-tk-day-so', 'toan-tk-bieu-do-cot', 'toan-tk-dem-su-kien'],
};
