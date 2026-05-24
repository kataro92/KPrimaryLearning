export type FeedbackKind = 'correct' | 'wrong' | 'timeout' | 'start';

const LINES: Record<string, Record<FeedbackKind, string[]>> = {
  'trang-nguyen-toan': {
    correct: ['Con tính nhanh như Trạng Nguyên rồi!', 'Thêm một câu đúng, bảng vàng đợi con.', 'Đúng rồi! Cùng chinh phục câu tiếp theo nhé.'],
    wrong: ['Cố lên, sĩ tử giỏi không bỏ cuộc.', 'Không sao, mình thử lại nhé!', 'Gần đúng rồi, con bình tĩnh làm lại.'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút, con làm được ngay.'],
    start: ['Chạm bia đá đúng để ghi điểm Trạng Nguyên!'],
  },
  'tu-vung-hoi-an': {
    correct: ['Đèn lồng sáng lên vì con ghép đúng!', 'Tuyệt lắm! Con vừa tìm đúng từ mới.', 'Đi tiếp nào, Hội An còn nhiều thử thách.'],
    wrong: ['Chưa khớp, thử cặp khác nhé!', 'Không sao, mình thử lại nhé!', 'Gần đúng rồi, con bình tĩnh làm lại.'],
    timeout: ['Hết thời gian rồi, chơi lại nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Lật đèn lồng, ghép từ tiếng Anh với tiếng Việt.'],
  },
  'trong-dong': {
    correct: ['Con đã tìm đúng manh mối rồi!', 'Giỏi quá! Bí mật trống đồng sắp mở ra.', 'Mảnh ghép khớp rồi!'],
    wrong: ['Thử lại nhé, nhà khảo cổ nhí rất kiên trì.', 'Không sao, mình thử mảnh khác.', 'Gần đúng rồi, con bình tĩnh làm lại.'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Kéo mảnh ghép vào trống đồng để giải mã.'],
  },
  'hinh-hoc-thang-long': {
    correct: ['Khối hình này con xử lý rất chuẩn!', 'Thành Thăng Long đang dần hoàn thiện rồi.', 'Xây đúng! Thành cao thêm!'],
    wrong: ['Cố thêm chút nữa, con xây giỏi lắm.', 'Chưa khớp hình, thử lại nhé!', 'Không sao, mình thử lại nhé!'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Nhìn đồ vật 3D bên trái, chọn hình vuông, chữ nhật hay tam giác.'],
  },
  'doc-hieu-su-viet': {
    correct: ['Con đọc rất tốt, ý chính đúng rồi.', 'Hiểu sử giỏi lắm!', 'Thêm một câu nữa là mở trang sử mới.'],
    wrong: ['Bình tĩnh đọc lại, con sẽ làm được ngay.', 'Đọc kỹ đoạn văn nhé!', 'Không sao, mình thử lại nhé!'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Đọc đoạn sử, chạm tem Đúng hoặc Sai.'],
  },
  'cuu-chuong-van-mieu': {
    correct: ['Nhanh và đúng! Rùa Vàng cổ vũ con.', 'Giữ nhịp thật tốt, con làm rất chắc.', 'Rùa tiến thêm một bước!'],
    wrong: ['Thử lại phép này nhé, con sắp vượt qua.', 'Chưa đúng, rùa nghỉ một nhịp!', 'Không sao, mình thử lại nhé!'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Gõ kết quả bằng bàn phím số, giúp rùa tiến lên!'],
  },
  'tham-hiem-cuu-long': {
    correct: ['Phân loại chuẩn quá, nhà thám hiểm nhí ơi!', 'Con vừa khám phá đúng một vùng mới.', 'Xuồng đầy hàng rồi!'],
    wrong: ['Chưa đúng loại, thử món tiếp theo!', 'Không sao, mình thử lại nhé!', 'Gần đúng rồi, con bình tĩnh làm lại.'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Ngắm thật chuẩn và bấm vào đáp án đúng!'],
  },
  'tinh-nham-trang-ti': {
    correct: ['Nhẩm nhanh quá! Trạng Tí cũng bất ngờ.', 'Đúng rồi! Con vừa vượt thêm một mốc.', 'Chuỗi 5! Trạng Tí xuất chúng!'],
    wrong: ['Cố thêm câu nữa, danh hiệu đang chờ con.', 'Chưa khớp, gõ lại nhé!', 'Không sao, mình thử lại nhé!'],
    timeout: ['Hết giờ rồi, thử câu sau nhé!', 'Cố thêm chút nữa nhé!'],
    start: ['Gõ kết quả nhanh, bấm Trống! khi xong.'],
  },
};

const FALLBACK: Record<FeedbackKind, string[]> = {
  correct: ['Chính xác! Con làm rất tốt.', 'Giỏi quá! Thêm một câu đúng rồi.'],
  wrong: ['Không sao, mình thử lại nhé!', 'Gần đúng rồi, con bình tĩnh làm lại.'],
  timeout: ['Hết giờ rồi, thử câu sau nhé!'],
  start: ['Cùng bắt đầu lượt chơi nhé!'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function gameFeedbackLine(gameId: string, kind: FeedbackKind): string {
  const bank = LINES[gameId]?.[kind] ?? FALLBACK[kind];
  return pick(bank);
}
