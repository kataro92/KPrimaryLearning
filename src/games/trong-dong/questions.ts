import { SCIENCE_SUPPLEMENT, type PassageRound } from './scienceSupplement';
import { SCIENCE_SUPPLEMENT_EXTRA } from './scienceSupplementExtra';

export type { PassageRound };

const ROUNDS: PassageRound[] = [
  {
    passage:
      'Trống đồng Đông Sơn là di sản văn hóa nổi tiếng của Việt Nam. Trên mặt trống thường có hình mặt trời ở giữa và các con vật xung quanh. Người xưa dùng trống trong lễ hội và sinh hoạt cộng đồng.',
    questions: [
      {
        prompt: 'Trống đồng Đông Sơn thuộc di sản nào?',
        choices: ['Văn hóa Việt Nam', 'Văn hóa Ai Cập', 'Văn hóa Hy Lạp', 'Văn hóa Nhật Bản'],
        correctIndex: 0,
      },
      {
        prompt: 'Ở giữa mặt trống thường có hình gì?',
        choices: ['Mặt trời', 'Mặt trăng', 'Ngôi sao', 'Cây tre'],
        correctIndex: 0,
      },
      {
        prompt: 'Người xưa dùng trống để làm gì?',
        choices: ['Lễ hội và sinh hoạt cộng đồng', 'Chỉ để trang trí', 'Chỉ để cất đồ', 'Chỉ để viết chữ'],
        correctIndex: 0,
      },
    ],
  },
  {
    passage:
      'Đồng là kim loại được người Việt cổ đúc thành trống, giáo, mũi tên. Khi đúc, thợ phải nấu đồng nóng chảy rồi đổ vào khuôn. Sau đó mới gọt, đánh bóng cho đẹp.',
    questions: [
      {
        prompt: 'Người Việt cổ đúc đồng thành những gì?',
        choices: ['Trống, giáo, mũi tên', 'Chỉ có bát đĩa', 'Chỉ có giấy', 'Chỉ có gỗ'],
        correctIndex: 0,
      },
      {
        prompt: 'Khi đúc đồng, thợ làm bước nào trước?',
        choices: ['Nấu đồng nóng chảy', 'Đánh bóng ngay', 'Gọt trước khi nấu', 'Sơn màu trước'],
        correctIndex: 0,
      },
    ],
  },
  {
    passage:
      'Thời tiết gồm nắng, mưa, gió, mây và thay đổi theo ngày. Con người cần theo dõi dự báo thời tiết để đi học, đi làm an toàn và bảo vệ mùa màng.',
    questions: [
      {
        prompt: 'Thời tiết có thể thay đổi theo điều gì?',
        choices: ['Theo ngày', 'Theo màu áo', 'Theo tên người', 'Theo tiếng chuông'],
        correctIndex: 0,
      },
      {
        prompt: 'Theo dõi dự báo thời tiết giúp gì?',
        choices: ['Đi lại an toàn hơn', 'Làm bài toán nhanh hơn', 'Ngủ nhiều hơn', 'Không cần chuẩn bị gì'],
        correctIndex: 0,
      },
      {
        prompt: 'Yếu tố nào KHÔNG phải thành phần thời tiết?',
        choices: ['Chiều cao của cây', 'Nắng', 'Mưa', 'Gió'],
        correctIndex: 0,
      },
      {
        prompt: 'Người nông dân theo dõi thời tiết để làm gì?',
        choices: ['Bảo vệ mùa màng', 'Trang trí nhà', 'Đổi tên ruộng', 'Vẽ bản đồ'],
        correctIndex: 0,
      },
    ],
  },
  {
    passage:
      'Nước có ba thể: rắn, lỏng và khí. Nước đá là thể rắn, nước thường là thể lỏng, hơi nước là thể khí. Khi đun nóng, nước bay hơi; khi làm lạnh, hơi nước ngưng tụ thành giọt.',
    questions: [
      {
        prompt: 'Nước đá thuộc thể nào?',
        choices: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể sáng'],
        correctIndex: 0,
      },
      {
        prompt: 'Khi đun nóng, nước chuyển thành gì?',
        choices: ['Hơi nước', 'Nước đá', 'Cát', 'Đất'],
        correctIndex: 0,
      },
      {
        prompt: 'Hơi nước ngưng tụ sẽ thành gì?',
        choices: ['Giọt nước', 'Tia lửa', 'Khói bụi', 'Không khí'],
        correctIndex: 0,
      },
      {
        prompt: 'Nước thường chúng ta uống thuộc thể nào?',
        choices: ['Thể lỏng', 'Thể rắn', 'Thể khí', 'Thể ánh sáng'],
        correctIndex: 0,
      },
    ],
  },
  {
    passage:
      'Âm thanh do vật rung động tạo ra. Tai người nghe được âm thanh trong một giới hạn nhất định. Âm thanh quá to trong thời gian dài có thể ảnh hưởng đến thính giác.',
    questions: [
      {
        prompt: 'Âm thanh được tạo ra do gì?',
        choices: ['Vật rung động', 'Vật đứng yên', 'Ánh sáng', 'Mùi hương'],
        correctIndex: 0,
      },
      {
        prompt: 'Âm thanh quá to kéo dài có thể gây gì?',
        choices: ['Hại thính giác', 'Tăng thị lực', 'Làm cây lớn nhanh', 'Làm nước đóng băng'],
        correctIndex: 0,
      },
      {
        prompt: 'Cơ quan giúp ta nghe âm thanh là gì?',
        choices: ['Tai', 'Mắt', 'Mũi', 'Da'],
        correctIndex: 0,
      },
      {
        prompt: 'Câu nào đúng về âm thanh?',
        choices: ['Không phải âm nào tai cũng nghe được', 'Tai nghe được mọi âm', 'Âm thanh không liên quan rung động', 'Âm thanh chỉ có trong sách'],
        correctIndex: 0,
      },
    ],
  },
  ...SCIENCE_SUPPLEMENT,
  ...SCIENCE_SUPPLEMENT_EXTRA,
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface DrumQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
  passage: string;
}

export function generateQuestions(level: 1 | 2 | 3): {
  questions: DrumQuestion[];
} {
  const count = level === 1 ? 6 : level === 2 ? 8 : 10;
  const flat = shuffle(
    ROUNDS.flatMap((r) =>
      r.questions.map((q) => ({
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correctIndex,
        passage: r.passage,
      }))
    )
  );
  const seen = new Set<string>();
  const picked: DrumQuestion[] = [];
  for (const item of flat) {
    if (seen.has(item.prompt)) continue;
    seen.add(item.prompt);
    picked.push(item);
    if (picked.length >= count) break;
  }
  return { questions: picked };
}

export function timePerQuestionMs(level: 1 | 2 | 3): number {
  if (level === 1) return 30000;
  if (level === 2) return 28000;
  return 25000;
}
