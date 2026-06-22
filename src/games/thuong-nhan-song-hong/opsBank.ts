import type { OpsMcqChallenge } from './challengeTypes';

/** Ngân hàng Thương Nhân Sông Hồng — phép tính số tự nhiên (soạn theo SGK) */
export const OPS_BANK: OpsMcqChallenge[] = [
  {
    prompt: '125 859 + 541 728 = ?',
    choices: ['667 587', '666 587', '657 587', '667 497'],
    correctIndex: 0,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: '516 372 − 50 420 = ?',
    choices: ['465 952', '466 952', '455 952', '566 792'],
    correctIndex: 0,
    sgkRef: 'toan-stn-cong-tru',
  },
  {
    prompt: '75 + 25 + 46 = ? (tính nhanh nhóm 75 + 25 trước)',
    choices: ['136', '146', '126', '156'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: '3 chồng sách có 11, 15 và 10 quyển. Trung bình mỗi chồng bao nhiêu quyển?',
    choices: ['11', '12', '13', '36'],
    correctIndex: 1,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: '18 bạn tình nguyện, nam nhiều hơn nữ 4 bạn. Có bao nhiêu bạn nam?',
    choices: ['7', '9', '11', '14'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tong-hieu',
  },
  {
    prompt: '137 206 × 3 = ?',
    choices: ['411 618', '411 508', '410 618', '421 618'],
    correctIndex: 0,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: 'Một xấp lụa dài 25 m. Thương nhân có 53 xấp, tổng bao nhiêu mét lụa?',
    choices: ['1 225', '1 325', '1 425', '1 525'],
    correctIndex: 1,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: '35 × 2 × 5 = ? (tính nhanh)',
    choices: ['175', '350', '70', '300'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: '47 × 100 = ?',
    choices: ['470', '4 700', '47 000', '470 000'],
    correctIndex: 1,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: '187 284 : 6 = ?',
    choices: ['31 214', '31 124', '32 214', '30 214'],
    correctIndex: 0,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '2 300 : 100 = ?',
    choices: ['23', '230', '2 200', '230 000'],
    correctIndex: 0,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '76 bó rau chia đều cho 19 sạp ngoài chợ. Mỗi sạp được mấy bó?',
    choices: ['3', '4', '5', '6'],
    correctIndex: 1,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: '1 236 : 12 = ?',
    choices: ['103', '93', '113', '102'],
    correctIndex: 0,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: 'Ước lượng: 34 + 67 ≈ ?',
    choices: ['90', '100', '110', '101'],
    correctIndex: 1,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'Ước lượng: 27 × 6 ≈ ? (làm tròn 27 thành 30)',
    choices: ['150', '162', '180', '200'],
    correctIndex: 2,
    sgkRef: 'toan-stn-uoc-luong',
  },
  {
    prompt: 'An mua 3 bánh, Hoa mua a bánh. Tổng số bánh là biểu thức nào?',
    choices: ['3 − a', '3 + a', '3 × a', 'a − 3'],
    correctIndex: 1,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: 'Hình chữ nhật dài a, rộng b. Chu vi P = ?',
    choices: ['a × b', '(a + b) × 2', 'a + b', 'a × b × 2'],
    correctIndex: 1,
    sgkRef: 'toan-stn-bieu-thuc-chu',
  },
  {
    prompt: '4 thuyền, mỗi thuyền 15 sọt, mỗi sọt 12 quả dưa. Tổng bao nhiêu quả?',
    choices: ['480', '720', '960', '600'],
    correctIndex: 1,
    sgkRef: 'toan-stn-tinh-chat-nhan',
  },
  {
    prompt: '3 bạn hái nấm: 14, 16, 12 cây. Trung bình mỗi bạn hái bao nhiêu cây?',
    choices: ['12', '13', '14', '42'],
    correctIndex: 2,
    sgkRef: 'toan-stn-trung-binh',
  },
  {
    prompt: 'Hộp có 12 bút đen và xanh, đen ít hơn xanh 4 bút. Có bao nhiêu bút đen?',
    choices: ['4', '6', '8', '10'],
    correctIndex: 0,
    sgkRef: 'toan-stn-tong-hieu',
  },
  {
    prompt: 'Quầy phở bán 150 bát mỗi ngày. Sau 7 ngày bán được bao nhiêu bát?',
    choices: ['850', '950', '1 050', '1 150'],
    correctIndex: 2,
    sgkRef: 'toan-stn-nhan',
  },
  {
    prompt: '136 : 17 = ?',
    choices: ['6', '7', '8', '9'],
    correctIndex: 2,
    sgkRef: 'toan-stn-chia',
  },
  {
    prompt: 'a + 0 = ? (với mọi số a)',
    choices: ['0', '1', 'a', '2a'],
    correctIndex: 2,
    sgkRef: 'toan-stn-tinh-chat-cong',
  },
  {
    prompt: '31 luống × 26 cây dâu/luống = ? cây',
    choices: ['706', '806', '906', '816'],
    correctIndex: 1,
    sgkRef: 'toan-stn-nhan',
  },
];

export const OPS_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['toan-stn-cong-tru', 'toan-stn-nhan', 'toan-stn-chia'],
  2: [
    'toan-stn-tinh-chat-cong',
    'toan-stn-trung-binh',
    'toan-stn-tong-hieu',
    'toan-stn-tinh-chat-nhan',
    'toan-stn-uoc-luong',
  ],
  3: [
    'toan-stn-cong-tru',
    'toan-stn-nhan',
    'toan-stn-chia',
    'toan-stn-trung-binh',
    'toan-stn-tong-hieu',
    'toan-stn-bieu-thuc-chu',
    'toan-stn-uoc-luong',
    'toan-stn-tinh-chat-cong',
    'toan-stn-tinh-chat-nhan',
  ],
};
