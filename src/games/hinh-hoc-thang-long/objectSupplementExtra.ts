import type { ObjectItem } from './objectBank';

/**
 * Bổ sung thêm — cân bằng 7 dạng hình (đặc biệt thoi, bình hành, thang, tròn).
 * Nhãn khớp minh họa qua objectResolver (o001–o100).
 */
export const OBJECT_SUPPLEMENT_EXTRA: ObjectItem[] = [
  // Hình thoi
  { id: 'o251', label: 'Gạch men xiên', shape: 'rhombus', minLevel: 2 },
  { id: 'o252', label: 'Gạch men xiên', shape: 'rhombus', minLevel: 3 },
  { id: 'o253', label: 'Gạch men xiên', shape: 'rhombus', minLevel: 2 },
  { id: 'o254', label: 'Miếng kim cương giấy', shape: 'rhombus', minLevel: 3 },
  { id: 'o255', label: 'Miếng kim cương giấy', shape: 'rhombus', minLevel: 1 },
  { id: 'o256', label: 'Miếng kim cương giấy', shape: 'rhombus', minLevel: 3 },
  { id: 'o257', label: 'Hình thoi trang trí', shape: 'rhombus', minLevel: 2 },
  { id: 'o258', label: 'Hình thoi trang trí', shape: 'rhombus', minLevel: 3 },
  { id: 'o259', label: 'Hình thoi trang trí', shape: 'rhombus', minLevel: 1 },
  { id: 'o260', label: 'Viên thoi giấy', shape: 'rhombus', minLevel: 2 },
  { id: 'o261', label: 'Viên thoi giấy', shape: 'rhombus', minLevel: 3 },
  { id: 'o262', label: 'Viên thoi giấy', shape: 'rhombus', minLevel: 2 },

  // Hình bình hành
  { id: 'o263', label: 'Xà beng nhỏ', shape: 'parallelogram', minLevel: 2 },
  { id: 'o264', label: 'Xà beng nhỏ', shape: 'parallelogram', minLevel: 3 },
  { id: 'o265', label: 'Xà beng nhỏ', shape: 'parallelogram', minLevel: 2 },
  { id: 'o266', label: 'Cuộn băng dính', shape: 'parallelogram', minLevel: 1 },
  { id: 'o267', label: 'Cuộn băng dính', shape: 'parallelogram', minLevel: 3 },
  { id: 'o268', label: 'Cuộn băng dính', shape: 'parallelogram', minLevel: 1 },
  { id: 'o269', label: 'Chuồn chuồn giấy', shape: 'parallelogram', minLevel: 2 },
  { id: 'o270', label: 'Chuồn chuồn giấy', shape: 'parallelogram', minLevel: 3 },
  { id: 'o271', label: 'Chuồn chuồn giấy', shape: 'parallelogram', minLevel: 2 },
  { id: 'o272', label: 'Miếng decal xiên', shape: 'parallelogram', minLevel: 3 },
  { id: 'o273', label: 'Miếng decal xiên', shape: 'parallelogram', minLevel: 1 },
  { id: 'o274', label: 'Miếng decal xiên', shape: 'parallelogram', minLevel: 3 },

  // Hình thang
  { id: 'o275', label: 'Mái nhà ngói', shape: 'trapezoid', minLevel: 1 },
  { id: 'o276', label: 'Mái nhà ngói', shape: 'trapezoid', minLevel: 3 },
  { id: 'o277', label: 'Mái nhà ngói', shape: 'trapezoid', minLevel: 1 },
  { id: 'o278', label: 'Mái chùa', shape: 'trapezoid', minLevel: 2 },
  { id: 'o279', label: 'Mái chùa', shape: 'trapezoid', minLevel: 3 },
  { id: 'o280', label: 'Mái chùa', shape: 'trapezoid', minLevel: 2 },
  { id: 'o281', label: 'Mái hiên che', shape: 'trapezoid', minLevel: 1 },
  { id: 'o282', label: 'Mái hiên che', shape: 'trapezoid', minLevel: 3 },
  { id: 'o283', label: 'Mái hiên che', shape: 'trapezoid', minLevel: 1 },
  { id: 'o284', label: 'Lều cắm trại', shape: 'trapezoid', minLevel: 2 },
  { id: 'o285', label: 'Lều cắm trại', shape: 'trapezoid', minLevel: 3 },
  { id: 'o286', label: 'Lều cắm trại', shape: 'trapezoid', minLevel: 2 },

  // Hình tròn
  { id: 'o287', label: 'Mặt đồng hồ', shape: 'circle', minLevel: 1 },
  { id: 'o288', label: 'Mặt đồng hồ', shape: 'circle', minLevel: 3 },
  { id: 'o289', label: 'Mặt đồng hồ', shape: 'circle', minLevel: 1 },
  { id: 'o290', label: 'Bánh quy tròn', shape: 'circle', minLevel: 2 },
  { id: 'o291', label: 'Bánh quy tròn', shape: 'circle', minLevel: 3 },
  { id: 'o292', label: 'Bánh quy tròn', shape: 'circle', minLevel: 2 },
  { id: 'o293', label: 'Lót ly tròn', shape: 'circle', minLevel: 1 },
  { id: 'o294', label: 'Lót ly tròn', shape: 'circle', minLevel: 3 },
  { id: 'o295', label: 'Lót ly tròn', shape: 'circle', minLevel: 1 },
  { id: 'o296', label: 'Miếng bánh flan', shape: 'circle', minLevel: 2 },
  { id: 'o297', label: 'Miếng bánh flan', shape: 'circle', minLevel: 3 },
  { id: 'o298', label: 'Miếng bánh flan', shape: 'circle', minLevel: 2 },

  // Hình tam giác (minh họa rõ)
  { id: 'o299', label: 'Miếng pizza', shape: 'triangle', minLevel: 1 },
  { id: 'o300', label: 'Miếng pizza', shape: 'triangle', minLevel: 3 },
  { id: 'o301', label: 'Miếng pizza', shape: 'triangle', minLevel: 1 },
  { id: 'o302', label: 'Cánh diều', shape: 'triangle', minLevel: 2 },
  { id: 'o303', label: 'Cánh diều', shape: 'triangle', minLevel: 3 },
  { id: 'o304', label: 'Cánh diều', shape: 'triangle', minLevel: 2 },
  { id: 'o305', label: 'Kim tự tháp', shape: 'triangle', minLevel: 1 },
  { id: 'o306', label: 'Kim tự tháp', shape: 'triangle', minLevel: 3 },
  { id: 'o307', label: 'Kim tự tháp', shape: 'triangle', minLevel: 1 },
  { id: 'o308', label: 'Miếng onigiri', shape: 'triangle', minLevel: 2 },
  { id: 'o309', label: 'Miếng onigiri', shape: 'triangle', minLevel: 3 },
  { id: 'o310', label: 'Miếng onigiri', shape: 'triangle', minLevel: 2 },

  // Hình vuông
  { id: 'o311', label: 'Khối Rubik', shape: 'square', minLevel: 2 },
  { id: 'o312', label: 'Khối Rubik', shape: 'square', minLevel: 3 },
  { id: 'o313', label: 'Khối Rubik', shape: 'square', minLevel: 2 },
  { id: 'o314', label: 'Viên xúc xắc', shape: 'square', minLevel: 1 },
  { id: 'o315', label: 'Viên xúc xắc', shape: 'square', minLevel: 3 },
  { id: 'o316', label: 'Viên xúc xắc', shape: 'square', minLevel: 1 },
  { id: 'o317', label: 'Khối Lego', shape: 'square', minLevel: 2 },
  { id: 'o318', label: 'Khối Lego', shape: 'square', minLevel: 3 },
  { id: 'o319', label: 'Khối Lego', shape: 'square', minLevel: 2 },

  // Hình chữ nhật
  { id: 'o320', label: 'Thước kẻ', shape: 'rect', minLevel: 1 },
  { id: 'o321', label: 'Thước kẻ', shape: 'rect', minLevel: 3 },
  { id: 'o322', label: 'Thước kẻ', shape: 'rect', minLevel: 1 },
  { id: 'o323', label: 'Cửa phòng', shape: 'rect', minLevel: 2 },
  { id: 'o324', label: 'Cửa phòng', shape: 'rect', minLevel: 3 },
  { id: 'o325', label: 'Cửa phòng', shape: 'rect', minLevel: 2 },
  { id: 'o326', label: 'Cuốn sách', shape: 'rect', minLevel: 1 },
  { id: 'o327', label: 'Cuốn sách', shape: 'rect', minLevel: 3 },
  { id: 'o328', label: 'Cuốn sách', shape: 'rect', minLevel: 2 },
];
