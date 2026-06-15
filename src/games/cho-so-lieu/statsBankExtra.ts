import type { StatsMcqChallenge } from './challengeTypes';
import { barChartHtml } from './statsChart';

export const STATS_BANK_EXTRA: StatsMcqChallenge[] = [
  {
    prompt: 'Dãy điểm: 8, 9, 7, 10, 6. Tổng điểm là?',
    choices: ['38', '40', '42', '45'],
    correctIndex: 1,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dãy điểm: 8, 9, 7, 10, 6. Điểm trung bình là?',
    choices: ['7', '8', '9', '10'],
    correctIndex: 1,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dãy nhiệt độ: 32, 34, 33, 35, 31 °C. Nhiệt độ cao nhất?',
    choices: ['31', '33', '34', '35'],
    correctIndex: 3,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dân số qua 3 năm: 95, 96, 97 triệu. Năm nào đông dân nhất?',
    choices: ['Năm 1', 'Năm 2', 'Năm 3', 'Bằng nhau'],
    correctIndex: 2,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Theo biểu đồ, tháng nào bán ít sách nhất?',
    choices: ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    correctIndex: 0,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Sách bán (quyển)', [
      { label: 'T3', value: 80, color: '#60a5fa' },
      { label: 'T4', value: 120, color: '#3b82f6' },
      { label: 'T5', value: 100, color: '#2563eb' },
      { label: 'T6', value: 140, color: '#1d4ed8' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ, tháng 6 bán nhiều hơn tháng 3 bao nhiêu quyển?',
    choices: ['40', '50', '60', '80'],
    correctIndex: 2,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Sách bán (quyển)', [
      { label: 'T3', value: 80, color: '#60a5fa' },
      { label: 'T6', value: 140, color: '#1d4ed8' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ, tổng chó và mèo là bao nhiêu bạn?',
    choices: ['12', '14', '16', '18'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Nuôi vật', [
      { label: 'Chó', value: 8, color: '#f59e0b' },
      { label: 'Mèo', value: 6, color: '#8b5cf6' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ trái cây, cam bán nhiều hơn táo bao nhiêu kg?',
    choices: ['5', '10', '15', '20'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Chợ trái cây (kg)', [
      { label: 'Táo', value: 25, color: '#ef4444' },
      { label: 'Cam', value: 35, color: '#f97316' },
      { label: 'Chuối', value: 40, color: '#eab308' },
    ]),
  },
  {
    prompt: 'Tung xu 8 lần: S, N, S, S, N, N, S, N. Mặt N xuất hiện mấy lần?',
    choices: ['3', '4', '5', '8'],
    correctIndex: 1,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Gieo xúc xắc 12 lần, số 3 xuất hiện 4 lần. Số 3 xuất hiện bao nhiêu lần?',
    choices: ['2', '3', '4', '12'],
    correctIndex: 2,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Quay kim 20 lần: xanh 7, đỏ 8, vàng 5. Màu nào ít nhất?',
    choices: ['Xanh', 'Đỏ', 'Vàng', 'Bằng nhau'],
    correctIndex: 2,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Tung xu 6 lần toàn mặt S. Mặt S xuất hiện mấy lần?',
    choices: ['0', '3', '6', '12'],
    correctIndex: 2,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Dãy: 4, 6, 8, 10, 12. Số liền sau 10 trong dãy là?',
    choices: ['8', '10', '12', '14'],
    correctIndex: 2,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Theo biểu đồ, cà phê và chè cộng lại bao nhiêu nghìn tấn?',
    choices: ['30', '42', '45', '57'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Xuất khẩu (nghìn tấn)', [
      { label: 'Cà phê', value: 30, color: '#78350f' },
      { label: 'Chè', value: 12, color: '#16a34a' },
    ]),
  },
  {
    prompt: 'Gieo xúc xắc 5 lần: 1, 4, 4, 2, 6. Số 4 xuất hiện mấy lần?',
    choices: ['1', '2', '3', '4'],
    correctIndex: 1,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Dãy chiều cao 10 bạn có giá trị lớn nhất 145 cm, nhỏ nhất 120 cm. Khoảng chênh lệch?',
    choices: ['15', '20', '25', '30'],
    correctIndex: 2,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dãy: 15, 18, 12, 20, 10. Số lớn nhất trong dãy?',
    choices: ['15', '18', '20', '12'],
    correctIndex: 2,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Dãy điểm: 9, 8, 10, 7, 6. Trung bình là?',
    choices: ['7', '8', '9', '40'],
    correctIndex: 1,
    sgkRef: 'toan-tk-day-so',
  },
  {
    prompt: 'Theo biểu đồ, loài nào được chọn ít nhất?',
    choices: ['Chó', 'Mèo', 'Chim', 'Cá'],
    correctIndex: 2,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Nuôi vật', [
      { label: 'Chó', value: 8, color: '#f59e0b' },
      { label: 'Mèo', value: 6, color: '#8b5cf6' },
      { label: 'Chim', value: 3, color: '#22c55e' },
      { label: 'Cá', value: 5, color: '#06b6d4' },
    ]),
  },
  {
    prompt: 'Theo biểu đồ trái cây, chuối bán nhiều hơn táo bao nhiêu kg?',
    choices: ['5', '10', '15', '40'],
    correctIndex: 2,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Chợ trái cây (kg)', [
      { label: 'Táo', value: 25, color: '#ef4444' },
      { label: 'Chuối', value: 40, color: '#eab308' },
    ]),
  },
  {
    prompt: 'Tung xu 7 lần: N, S, N, N, S, S, N. Mặt N xuất hiện mấy lần?',
    choices: ['3', '4', '5', '7'],
    correctIndex: 1,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Quay kim 15 lần: đỏ 6, xanh 5, vàng 4. Màu đỏ xuất hiện mấy lần?',
    choices: ['4', '5', '6', '15'],
    correctIndex: 2,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Gieo xúc xắc 8 lần, số 1 xuất hiện 3 lần. Số 1 xuất hiện bao nhiêu lần?',
    choices: ['1', '2', '3', '8'],
    correctIndex: 2,
    sgkRef: 'toan-tk-dem-su-kien',
  },
  {
    prompt: 'Theo biểu đồ nghề nghiệp, bác sĩ nhiều hơn nông dân bao nhiêu bạn?',
    choices: ['5', '7', '10', '13'],
    correctIndex: 1,
    sgkRef: 'toan-tk-bieu-do-cot',
    chartHtml: barChartHtml('Nghề tương lai', [
      { label: 'Bác sĩ', value: 10, color: '#ef4444' },
      { label: 'Nông dân', value: 3, color: '#22c55e' },
    ]),
  },
  {
    prompt: 'Dãy số bán hàng: 50, 60, 55, 70, 65. Doanh thu cao nhất là?',
    choices: ['55', '60', '65', '70'],
    correctIndex: 3,
    sgkRef: 'toan-tk-day-so',
  },
];
