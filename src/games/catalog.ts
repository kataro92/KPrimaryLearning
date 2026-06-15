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
    id: 'thap-trieu-so',
    title: 'Tháp Triệu Số',
    subject: 'Toán',
    description: 'Số trong phạm vi 1 000 000 — đọc, so sánh, làm tròn',
    playHint: 'Chọn bia đá đúng — mỗi câu đúng xây thêm một tầng tháp.',
    achievements: { 1: 'Thợ Xây Số', 2: 'Kiến Trúc Sư Triệu', 3: 'Chủ Tháp Triệu Số' },
  },
  {
    id: 'thuong-nhan-song-hong',
    title: 'Thương Nhân Sông Hồng',
    subject: 'Toán',
    description: 'Phép tính số tự nhiên — cộng, trừ, nhân, chia',
    playHint: 'Chọn bia đá đúng — mỗi giao dịch đúng bán thêm hàng trên chợ.',
    achievements: { 1: 'Người Bán Nhí', 2: 'Thương Nhân Giỏi', 3: 'Ông Chủ Sông Hồng' },
  },
  {
    id: 'chia-banh-trang-ram',
    title: 'Chia Bánh Trăng Rằm',
    subject: 'Toán',
    description: 'Phân số — khái niệm, rút gọn, so sánh',
    playHint: 'Chọn bia đá đúng — mỗi câu đúng chia thêm bánh lên mâm.',
    achievements: { 1: 'Bạn Chia Bánh', 2: 'Thợ Bánh Khéo', 3: 'Bậc Thầy Phân Số' },
  },
  {
    id: 'do-dat-co-thanh',
    title: 'Đo Đất Cổ Thành',
    subject: 'Toán',
    description: 'Hình học & diện tích — m², dm², mm²',
    playHint: 'Chọn bia đá đúng — mỗi câu đúng tô thêm một ô đất trên bản đồ.',
    achievements: { 1: 'Thợ Đo Nhí', 2: 'Địa Chỉ Viên', 3: 'Chủ Đất Cổ Thành' },
  },
  {
    id: 'bep-bac-hoc-tro',
    title: 'Bếp Bác Học Trò',
    subject: 'Toán',
    description: 'Cộng, trừ, nhân, chia phân số',
    playHint: 'Chọn bia đá đúng — mỗi câu đúng thêm nguyên liệu vào nồi.',
    achievements: { 1: 'Bạn Bếp Nhí', 2: 'Đầu Bếp Phân Số', 3: 'Bậc Thầy Bếp Bác' },
  },
  {
    id: 'cho-so-lieu',
    title: 'Chợ Số Liệu',
    subject: 'Toán',
    description: 'Dãy số, biểu đồ cột, đếm sự kiện',
    playHint: 'Đọc biểu đồ hoặc dãy số; cấp 2–3 có lượt tung xu thật — đếm S/N rồi chọn bia đá.',
    achievements: { 1: 'Người Ghi Số', 2: 'Thợ Thống Kê Nhí', 3: 'Chủ Chợ Số Liệu' },
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
