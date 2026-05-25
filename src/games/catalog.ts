import type { AchievementLevel } from '@/data/types';

export interface GameAchievementNames {
  1: string;
  2: string;
  3: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  subject: string;
  description: string;
  /** Hướng dẫn chơi ngắn trên màn chọn danh hiệu */
  playHint: string;
  achievements: GameAchievementNames;
}

export const GAMES: GameDefinition[] = [
  {
    id: 'trang-nguyen-toan',
    title: 'Trạng Nguyên Toán Việt',
    subject: 'Toán',
    description: 'Trắc nghiệm toán nhanh',
    playHint: 'Chạm bia đá có đáp án đúng — mỗi câu có đồng hồ đếm ngược.',
    achievements: {
      1: 'Học Trò Chăm',
      2: 'Sĩ Tử Toán',
      3: 'Trạng Nguyên Toán',
    },
  },
  {
    id: 'but-sen-viet',
    title: 'Bút Sen Việt',
    subject: 'Tiếng Việt',
    description: 'Điền từ đúng chính tả trong câu',
    playHint: 'Gõ từ còn thiếu (Telex); nghe câu rồi gõ — không đọc đáp án.',
    achievements: { 1: 'Mầm Nét Đẹp', 2: 'Bút Non Tài Hoa', 3: 'Sen Rồng Việt' },
  },
  {
    id: 'tu-vung-hoi-an',
    title: 'Hành Trình Từ Vựng Hội An',
    subject: 'Tiếng Anh',
    description: 'Ghép từ và hình ảnh',
    playHint: 'Lật hai đèn lồng để ghép từ tiếng Anh với tiếng Việt.',
    achievements: { 1: 'Khách Lữ Hành Nhí', 2: 'Sứ Giả Đèn Lồng', 3: 'Học Giả Hội An' },
  },
  {
    id: 'trong-dong',
    title: 'Giải Mã Trống Đồng',
    subject: 'Khoa học',
    description: 'Đọc hiểu ngắn',
    playHint: 'Đọc đoạn văn, kéo mảnh ghép vào trống đồng.',
    achievements: { 1: 'Người Tìm Dấu Vết', 2: 'Nhà Khảo Cổ Nhí', 3: 'Bậc Thầy Trống Đồng' },
  },
  {
    id: 'hinh-hoc-thang-long',
    title: 'Săn Hình Học Thành Thăng Long',
    subject: 'Toán',
    description: 'Nhận dạng 7 dạng hình lớp 4',
    playHint: 'Trả lời đúng để xây thêm tầng thành; xem sổ vẽ và chọn đúng dạng hình lớp 4.',
    achievements: { 1: 'Thợ Xây Tập Sự', 2: 'Kiến Trúc Sư Nhí', 3: 'Thần Đồng Thăng Long' },
  },
  {
    id: 'doc-hieu-su-viet',
    title: 'Đọc Hiểu Sử Việt Nhí',
    subject: 'Tiếng Việt',
    description: 'Đọc hiểu đoạn văn',
    playHint: 'Đọc đoạn sử, chạm tem Đúng hoặc Sai cho mỗi câu.',
    achievements: { 1: 'Bạn Đọc Sử Nhí', 2: 'Sứ Giả Sử Việt', 3: 'Hậu Duệ Sử Gia' },
  },
  {
    id: 'hanh-trinh-su-dia',
    title: 'Hành Trình Sử & Địa',
    subject: 'Lịch sử & Địa lí',
    description: 'Kéo thẻ vào bản đồ Việt Nam',
    playHint: 'Đọc câu hỏi, kéo thẻ hoặc chạm đúng vùng trên bản đồ (Hoàng Sa, Trường Sa, Phú Quốc…).',
    achievements: { 1: 'Bạn Bản Đồ Nhí', 2: 'Nhà Địa Lý Nhí', 3: 'Sứ Giả Biển Đông' },
  },
  {
    id: 'cuu-chuong-van-mieu',
    title: 'Bảng Cửu Chương Văn Miếu',
    subject: 'Toán',
    description: 'Bảng nhân chia nhanh',
    playHint: 'Dùng bàn phím số nhập kết quả — rùa tiến khi đúng.',
    achievements: { 1: 'Người Giữ Nhịp', 2: 'Cao Thủ Nhân Chia', 3: 'Rùa Vàng Toán Học' },
  },
  {
    id: 'tham-hiem-cuu-long',
    title: 'Nhà Thám Hiểm Cửu Long',
    subject: 'Khoa học',
    description: 'FPS ngắm và chọn đáp án đúng',
    playHint: 'Ngắm bằng chuột, bấm vào đáp án đúng (click/Space) hoặc bấm 1-3.',
    achievements: { 1: 'Bạn Đồng Xanh', 2: 'Thám Hiểm Miệt Vườn', 3: 'Sứ Giả Cửu Long' },
  },
  {
    id: 'tinh-nham-trang-ti',
    title: 'Tính Nhẩm Trạng Tí',
    subject: 'Toán',
    description: 'Nhập kết quả phép tính có đếm ngược',
    playHint: 'Nhập kết quả nhanh, bấm Trống! trước khi hết giờ.',
    achievements: { 1: 'Tí Nhanh Trí', 2: 'Tí Siêu Nhẩm', 3: 'Trạng Tí Xuất Chúng' },
  },
  {
    id: 'dao-duc-nhi',
    title: 'Đạo Đức Nhí',
    subject: 'Đạo đức',
    description: 'Chọn việc làm đúng trong tình huống',
    playHint: 'Đọc tình huống, chọn hành động đúng — bấm 1, 2 hoặc 3.',
    achievements: { 1: 'Bạn Ngoan', 2: 'Trái Tim Ấm', 3: 'Người Bạn Đáng Tin' },
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}

export const ACHIEVEMENT_LEVELS: AchievementLevel[] = [1, 2, 3];
