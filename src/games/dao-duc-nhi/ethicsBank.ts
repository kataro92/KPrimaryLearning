import type { EthicsChallenge } from './challengeTypes';

/**
 * Tình huống rút gọn theo SGK Đạo đức 4 CTST (Bài 1–12).
 * Không sao chép nguyên sách; ý và chuẩn mực bám bài học.
 */
export const ETHICS_BANK: EthicsChallenge[] = [
  // Bài 1 — Người lao động quanh em
  {
    scenario: 'Tin nói với Bin: «Nghề kiểm lâm thì có gì đáng tự hào đâu!»',
    question: 'Em nên làm gì?',
    choices: [
      'Nhắc Tin tôn trọng mọi nghề lao động',
      'Đồng ý vì nghề kiểm lâm không quan trọng',
      'Im lặng để khỏi mất bạn',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-01',
  },
  {
    scenario: 'Bạn nói: «Mình không thích làm nghề thợ xây vì bẩn lắm.»',
    question: 'Ý kiến nào đúng?',
    choices: [
      'Mọi nghề lao động chân tay hay trí óc đều đáng quý',
      'Chỉ nghề sạch sẽ mới đáng làm',
      'Thợ xây không cần được tôn trọng',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-01',
  },
  {
    scenario: 'Cô lao công nhặt rác giúp sân trường sạch đẹp.',
    question: 'Em thể hiện biết ơn bằng cách nào?',
    choices: ['Cảm ơn và không xả rác bừa bãi', 'Coi đó là việc của cô', 'Trêu chọc cô'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-01',
  },
  // Bài 2 — Em biết ơn người lao động
  {
    scenario: 'Em thấy bác nông dân đang gặt lúa dưới trời nắng.',
    question: 'Việc làm nào thể hiện lòng biết ơn?',
    choices: [
      'Không làm hỏng ruộng, trân trọng gạo',
      'Chạy qua ruộng cho vui',
      'Nói bác nông dân nghề này dễ',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-02',
  },
  {
    scenario: 'Bạn cho rằng không cần nói cảm ơn người lao động.',
    question: 'Em nghĩ sao?',
    choices: [
      'Nên nói và làm việc cụ thể để thể hiện biết ơn',
      'Chỉ cần nghĩ trong lòng',
      'Chỉ cảm ơn người nổi tiếng',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-02',
  },
  // Bài 3 — Em cảm thông, giúp đỡ người gặp khó khăn
  {
    scenario: 'Bạn bị ngã ở sân trường, khóc vì đau.',
    question: 'Em làm gì?',
    choices: ['An ủi và giúp bạn đứng dậy', 'Cười bạn', 'Bỏ đi'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-03',
  },
  {
    scenario: 'Cô giáo nhắc lớp quyên góp sách vở cho bạn vùng lũ.',
    question: 'Em nên?',
    choices: [
      'Tham gia nếu có thể, chia sẻ với người khó khăn',
      'Chỉ khi được thưởng',
      'Từ chối vì không liên quan',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-03',
  },
  // Bài 4 — Em yêu lao động
  {
    scenario: 'Nhóm được phân công quét lớp sau giờ ra chơi.',
    question: 'Em chọn cách nào?',
    choices: ['Làm đều phần việc của mình', 'Nhờ bạn làm hết', 'Trốn việc'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-04',
  },
  {
    scenario: 'Bạn nói lao động nhà chỉ là việc của người lớn.',
    question: 'Em phản hồi thế nào?',
    choices: [
      'Trẻ em cũng có thể làm việc phù hợp lứa tuổi',
      'Đúng, mình không cần làm gì',
      'Chỉ học, không cần lao động',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-04',
  },
  // Bài 5 — Em tích cực tham gia lao động
  {
    scenario: 'Lớp trồng cây xanh trong sân trường.',
    question: 'Em tham gia thế nào?',
    choices: ['Tích cực trồng và tưới cây', 'Đứng xem', 'Phá cây bạn trồng'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-05',
  },
  // Bài 6 — Em tôn trọng tài sản của người khác
  {
    scenario: 'Em thích đồ chơi của bạn và muốn lấy về nhà.',
    question: 'Em làm gì?',
    choices: ['Xin phép mượn, không tự ý lấy', 'Lấy luôn vì là bạn thân', 'Giấu đồ chơi'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-06',
  },
  {
    scenario: 'Bạn vẽ đẹp trên vở. Em muốn tô thêm.',
    question: 'Việc nào đúng?',
    choices: ['Hỏi bạn trước khi đụng vào vở', 'Tô thêm cho bất ngờ', 'Xé trang vở'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-06',
  },
  // Bài 7 — Em bảo vệ của công
  {
    scenario: 'Em thấy bạn viết bậy lên tường nhà văn hóa.',
    question: 'Em nên?',
    choices: ['Khuyên bạn dừng và báo thầy cô', 'Viết thêm cho vui', 'Quay video đăng mạng'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-07',
  },
  {
    scenario: 'Ghế trong lớp học bị gãy do bạn nhảy lên.',
    question: 'Em làm gì?',
    choices: ['Báo cô và không làm hỏng của công', 'Giấu không ai biết', 'Đổ lỗi bạn khác'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-07',
  },
  // Bài 8 — Em thiết lập quan hệ bạn bè
  {
    scenario: 'Bạn mới chuyển trường, ngại nói chuyện.',
    question: 'Em làm gì?',
    choices: ['Chào hỏi và mời bạn chơi cùng', 'Trêu bạn', 'Bỏ mặc bạn một mình'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-08',
  },
  {
    scenario: 'Nhóm bạn không cho một bạn chơi cùng.',
    question: 'Em chọn cách nào?',
    choices: ['Mời bạn ấy tham gia, không loại trừ', 'Theo đám bạn bỏ rơi', 'Cười nhạo bạn'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-08',
  },
  // Bài 9 — Em duy trì quan hệ bạn bè
  {
    scenario: 'Bạn giận em vì hiểu nhầm.',
    question: 'Em nên?',
    choices: ['Nói chuyện nhẹ nhàng để giải quyết', 'Đánh bạn', 'Nói xấu bạn'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-09',
  },
  {
    scenario: 'Bạn nhờ em giữ bí mật chuyện buồn.',
    question: 'Em làm gì?',
    choices: ['Lắng nghe và khuyên bạn tìm người lớn tin cậy', 'Kể cho cả lớp', 'Chế giễu bạn'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-09',
  },
  // Bài 10 — Em quý trọng đồng tiền
  {
    scenario: 'Em nhặt được ví tiền trong sân trường.',
    question: 'Em làm gì?',
    choices: ['Giao cho thầy cô hoặc nhà trường', 'Giữ lại', 'Chia tiền với bạn'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-10',
  },
  {
    scenario: 'Bạn khoe tiền tiêu vặt để mua đồ không cần thiết.',
    question: 'Em nghĩ sao về đồng tiền?',
    choices: [
      'Tiền cần tiết kiệm, dùng đúng mục đích',
      'Càng tiêu càng tốt',
      'Tiền không quan trọng',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-10',
  },
  // Bài 11 — Quyền trẻ em
  {
    scenario: 'Người lớn bắt em làm việc nặng, nguy hiểm.',
    question: 'Em có quyền gì?',
    choices: [
      'Được bảo vệ, không bị bóc lột lao động',
      'Phải làm mọi việc người lớn bảo',
      'Không được phản đối',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-11',
  },
  {
    scenario: 'Em muốn được nghe ý kiến khi gia đình chọn lớp học thêm.',
    question: 'Điều này thuộc quyền nào?',
    choices: ['Quyền được lắng nghe ý kiến', 'Không có quyền gì', 'Chỉ người lớn quyết định'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-11',
  },
  // Bài 12 — Bổn phận của trẻ em
  {
    scenario: 'Em được quyền học tập, nhưng hay trốn học đi chơi.',
    question: 'Bổn phận của em là gì?',
    choices: ['Đi học đều và học tập chăm chỉ', 'Chỉ chơi vì còn nhỏ', 'Để bạn học thay'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-12',
  },
  {
    scenario: 'Em có quyền vui chơi, nhưng chưa làm bài tập.',
    question: 'Em cân bằng thế nào?',
    choices: [
      'Hoàn thành bổn phận học tập trước khi chơi',
      'Chơi cả ngày không cần học',
      'Bắt bạn làm hộ bài',
    ],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-12',
  },
  {
    scenario: 'Em thấy bạn bị bắt nạt trên mạng.',
    question: 'Bổn phận của em?',
    choices: ['Báo người lớn và ủng hộ bạn', 'Tham gia bắt nạt', 'Quay clip đăng'],
    correctIndex: 0,
    sgkRef: 'dao-duc-bai-12',
  },
];

export const ETHICS_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
  1: ['dao-duc-bai-01', 'dao-duc-bai-02', 'dao-duc-bai-03', 'dao-duc-bai-04'],
  2: ['dao-duc-bai-05', 'dao-duc-bai-06', 'dao-duc-bai-07', 'dao-duc-bai-08', 'dao-duc-bai-09'],
  3: ['dao-duc-bai-10', 'dao-duc-bai-11', 'dao-duc-bai-12'],
};
