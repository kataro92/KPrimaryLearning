export interface PassageRound {
  passage: string;
  questions: { prompt: string; choices: string[]; correctIndex: number }[];
}

/** Đọc hiểu khoa học HK1/HK2 — 120 câu */
export const SCIENCE_SUPPLEMENT: PassageRound[] = [
  {
    passage: 'Cơ thể người cần thức ăn, nước uống, không khí và ánh sáng mặt trời để sống khỏe. Thiếu một trong các yếu tố này, cơ thể dễ mệt mỏi và ốm.',
    questions: [
      { prompt: 'Cơ thể cần những gì để sống khỏe?', choices: ['Thức ăn, nước, không khí, ánh sáng', 'Chỉ cần nước', 'Chỉ cần thức ăn', 'Chỉ cần ngủ'], correctIndex: 0 },
      { prompt: 'Thiếu yếu tố cần thiết, cơ thể sẽ ra sao?', choices: ['Dễ mệt và ốm', 'Cao lớn hơn', 'Không thay đổi', 'Chỉ khát nước'], correctIndex: 0 },
      { prompt: 'Ánh sáng mặt trời giúp cơ thể tạo vitamin gì?', choices: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tiêu hóa là quá trình biến thức ăn thành chất bổ dưỡng. Miệng nghiền thức ăn, dạ dày tiết dịch tiêu hóa, ruột non hấp thụ chất dinh dưỡng.',
    questions: [
      { prompt: 'Tiêu hóa là gì?', choices: ['Biến thức ăn thành chất bổ dưỡng', 'Thải phân ra ngoài', 'Hít thở không khí', 'Bơm máu'], correctIndex: 0 },
      { prompt: 'Bộ phận nào hấp thụ chất dinh dưỡng chủ yếu?', choices: ['Ruột non', 'Da', 'Xương', 'Tim'], correctIndex: 0 },
      { prompt: 'Dạ dày có vai trò gì?', choices: ['Tiết dịch tiêu hóa', 'Hấp thụ oxy', 'Nghe âm thanh', 'Bảo vệ da'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Không khí gồm chủ yếu nitơ và ôxy. Ôxy cần cho sự cháy và hô hấp. Nitơ chiếm khoảng bốn phần năm thể tích không khí.',
    questions: [
      { prompt: 'Không khí gồm chủ yếu những khí nào?', choices: ['Nitơ và ôxy', 'Chỉ ôxy', 'Chỉ nitơ', 'Hiđro và heli'], correctIndex: 0 },
      { prompt: 'Ôxy cần cho quá trình nào?', choices: ['Hô hấp và sự cháy', 'Quang hợp của động vật', 'Tiêu hóa', 'Ngủ'], correctIndex: 0 },
      { prompt: 'Nitơ chiếm khoảng bao nhiêu phần không khí?', choices: ['Bốn phần năm', 'Một phần mười', 'Một nửa', 'Toàn bộ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nước có thể ở thể rắn, lỏng hoặc khí. Nước đá là thể rắn, nước lỏng thường gặp ở sông hồ, hơi nước là thể khí. Khi đun nóng, nước bay hơi.',
    questions: [
      { prompt: 'Nước đá thuộc thể nào?', choices: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể plasma'], correctIndex: 0 },
      { prompt: 'Khi đun nóng, nước chuyển thành gì?', choices: ['Hơi nước', 'Nước đá', 'Muối', 'Cát'], correctIndex: 0 },
      { prompt: 'Nước có mấy thể cơ bản?', choices: ['Ba thể', 'Hai thể', 'Bốn thể', 'Một thể'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Thực vật quang hợp nhờ lá, ánh sáng, nước và khí cábonic. Quá trình tạo ra ôxy và chất hữu cơ nuôi cây. Rễ hút nước và muối khoáng từ đất.',
    questions: [
      { prompt: 'Quang hợp cần những gì?', choices: ['Ánh sáng, nước, CO₂', 'Chỉ nước', 'Chỉ đất', 'Chỉ gió'], correctIndex: 0 },
      { prompt: 'Quang hợp tạo ra khí gì?', choices: ['Ôxy', 'Hiđro', 'Nitơ', 'Khí độc'], correctIndex: 0 },
      { prompt: 'Rễ cây có chức năng gì?', choices: ['Hút nước và muối khoáng', 'Hô hấp chính', 'Tiết mật', 'Bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Động vật có xương sống và không xương sống. Cá, chim, ếch, rắn, thú có xương sống. Côn trùng, giun, nhện không có xương sống.',
    questions: [
      { prompt: 'Cá thuộc nhóm nào?', choices: ['Có xương sống', 'Không xương sống', 'Thực vật', 'Khoáng vật'], correctIndex: 0 },
      { prompt: 'Côn trùng thuộc nhóm nào?', choices: ['Không xương sống', 'Có xương sống', 'Thú', 'Cá'], correctIndex: 0 },
      { prompt: 'Ếch có xương sống không?', choices: ['Có', 'Không', 'Chỉ khi lớn', 'Không xác định'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Mạch máu gồm động mạch, tĩnh mạch và mao mạch. Tim bơm máu đi khắp cơ thể. Máu mang ôxy và chất dinh dưỡng đến các cơ quan.',
    questions: [
      { prompt: 'Tim có vai trò gì?', choices: ['Bơm máu', 'Tiêu hóa thức ăn', 'Sản xuất mật', 'Nghe âm thanh'], correctIndex: 0 },
      { prompt: 'Máu mang gì đến cơ quan?', choices: ['Ôxy và chất dinh dưỡng', 'Chỉ nước', 'Chỉ khí CO₂', 'Chỉ muối'], correctIndex: 0 },
      { prompt: 'Mao mạch thuộc hệ gì?', choices: ['Tuần hoàn máu', 'Tiêu hóa', 'Thần kinh', 'Bài tiết'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Bệnh lây qua đường tiêu hóa do vi khuẩn, virus trong thức ăn nước uống bẩn. Rửa tay trước ăn và ăn chín uống sôi là cách phòng bệnh hiệu quả.',
    questions: [
      { prompt: 'Bệnh đường tiêu hóa lây qua đâu?', choices: ['Thức ăn nước uống bẩn', 'Chỉ qua không khí', 'Chỉ qua da', 'Chỉ qua ánh sáng'], correctIndex: 0 },
      { prompt: 'Cách phòng bệnh nào đúng?', choices: ['Rửa tay và ăn chín uống sôi', 'Không tắm', 'Ăn sống', 'Uống nước ao'], correctIndex: 0 },
      { prompt: 'Vi khuẩn có thể có trong thức ăn không?', choices: ['Có', 'Không', 'Chỉ trong đá', 'Chỉ trong gỗ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất quay quanh Mặt Trời một vòng trong khoảng 365 ngày. Trục Trái Đất nghiêng tạo ra các mùa. Một ngày là thời gian Trái Đất tự quay một vòng.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời mất bao lâu?', choices: ['Khoảng 365 ngày', '1 ngày', '30 ngày', '7 ngày'], correctIndex: 0 },
      { prompt: 'Mùa xuân hạ thu đông do điều gì?', choices: ['Trục Trái Đất nghiêng', 'Mặt Trăng che', 'Gió mạnh', 'Núi cao'], correctIndex: 0 },
      { prompt: 'Một ngày là gì?', choices: ['Trái Đất tự quay một vòng', 'Quay quanh Mặt Trời', 'Một tháng', 'Một năm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Năng lượng có thể chuyển từ dạng này sang dạng khác. Pin lưu năng lượng hóa học. Bóng đèn biến điện năng thành quang năng và nhiệt năng.',
    questions: [
      { prompt: 'Pin lưu năng lượng dạng gì?', choices: ['Hóa học', 'Âm thanh', 'Cơ học', 'Hạt nhân'], correctIndex: 0 },
      { prompt: 'Bóng đèn biến điện năng thành gì?', choices: ['Quang và nhiệt', 'Chỉ âm thanh', 'Chỉ cơ học', 'Chỉ hóa học'], correctIndex: 0 },
      { prompt: 'Năng lượng có thể chuyển đổi không?', choices: ['Có', 'Không', 'Chỉ trong sách', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Cơ thể người cần thức ăn, nước uống, không khí và ánh sáng mặt trời để sống khỏe. Thiếu một trong các yếu tố này, cơ thể dễ mệt mỏi và ốm. (Bài 11)',
    questions: [
      { prompt: 'Cơ thể cần những gì để sống khỏe?', choices: ['Thức ăn, nước, không khí, ánh sáng', 'Chỉ cần nước', 'Chỉ cần thức ăn', 'Chỉ cần ngủ'], correctIndex: 0 },
      { prompt: 'Thiếu yếu tố cần thiết, cơ thể sẽ ra sao?', choices: ['Dễ mệt và ốm', 'Cao lớn hơn', 'Không thay đổi', 'Chỉ khát nước'], correctIndex: 0 },
      { prompt: 'Ánh sáng mặt trời giúp cơ thể tạo vitamin gì?', choices: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tiêu hóa là quá trình biến thức ăn thành chất bổ dưỡng. Miệng nghiền thức ăn, dạ dày tiết dịch tiêu hóa, ruột non hấp thụ chất dinh dưỡng. (Bài 12)',
    questions: [
      { prompt: 'Tiêu hóa là gì?', choices: ['Biến thức ăn thành chất bổ dưỡng', 'Thải phân ra ngoài', 'Hít thở không khí', 'Bơm máu'], correctIndex: 0 },
      { prompt: 'Bộ phận nào hấp thụ chất dinh dưỡng chủ yếu?', choices: ['Ruột non', 'Da', 'Xương', 'Tim'], correctIndex: 0 },
      { prompt: 'Dạ dày có vai trò gì?', choices: ['Tiết dịch tiêu hóa', 'Hấp thụ oxy', 'Nghe âm thanh', 'Bảo vệ da'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Không khí gồm chủ yếu nitơ và ôxy. Ôxy cần cho sự cháy và hô hấp. Nitơ chiếm khoảng bốn phần năm thể tích không khí. (Bài 13)',
    questions: [
      { prompt: 'Không khí gồm chủ yếu những khí nào?', choices: ['Nitơ và ôxy', 'Chỉ ôxy', 'Chỉ nitơ', 'Hiđro và heli'], correctIndex: 0 },
      { prompt: 'Ôxy cần cho quá trình nào?', choices: ['Hô hấp và sự cháy', 'Quang hợp của động vật', 'Tiêu hóa', 'Ngủ'], correctIndex: 0 },
      { prompt: 'Nitơ chiếm khoảng bao nhiêu phần không khí?', choices: ['Bốn phần năm', 'Một phần mười', 'Một nửa', 'Toàn bộ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nước có thể ở thể rắn, lỏng hoặc khí. Nước đá là thể rắn, nước lỏng thường gặp ở sông hồ, hơi nước là thể khí. Khi đun nóng, nước bay hơi. (Bài 14)',
    questions: [
      { prompt: 'Nước đá thuộc thể nào?', choices: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể plasma'], correctIndex: 0 },
      { prompt: 'Khi đun nóng, nước chuyển thành gì?', choices: ['Hơi nước', 'Nước đá', 'Muối', 'Cát'], correctIndex: 0 },
      { prompt: 'Nước có mấy thể cơ bản?', choices: ['Ba thể', 'Hai thể', 'Bốn thể', 'Một thể'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Thực vật quang hợp nhờ lá, ánh sáng, nước và khí cábonic. Quá trình tạo ra ôxy và chất hữu cơ nuôi cây. Rễ hút nước và muối khoáng từ đất. (Bài 15)',
    questions: [
      { prompt: 'Quang hợp cần những gì?', choices: ['Ánh sáng, nước, CO₂', 'Chỉ nước', 'Chỉ đất', 'Chỉ gió'], correctIndex: 0 },
      { prompt: 'Quang hợp tạo ra khí gì?', choices: ['Ôxy', 'Hiđro', 'Nitơ', 'Khí độc'], correctIndex: 0 },
      { prompt: 'Rễ cây có chức năng gì?', choices: ['Hút nước và muối khoáng', 'Hô hấp chính', 'Tiết mật', 'Bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Động vật có xương sống và không xương sống. Cá, chim, ếch, rắn, thú có xương sống. Côn trùng, giun, nhện không có xương sống. (Bài 16)',
    questions: [
      { prompt: 'Cá thuộc nhóm nào?', choices: ['Có xương sống', 'Không xương sống', 'Thực vật', 'Khoáng vật'], correctIndex: 0 },
      { prompt: 'Côn trùng thuộc nhóm nào?', choices: ['Không xương sống', 'Có xương sống', 'Thú', 'Cá'], correctIndex: 0 },
      { prompt: 'Ếch có xương sống không?', choices: ['Có', 'Không', 'Chỉ khi lớn', 'Không xác định'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Mạch máu gồm động mạch, tĩnh mạch và mao mạch. Tim bơm máu đi khắp cơ thể. Máu mang ôxy và chất dinh dưỡng đến các cơ quan. (Bài 17)',
    questions: [
      { prompt: 'Tim có vai trò gì?', choices: ['Bơm máu', 'Tiêu hóa thức ăn', 'Sản xuất mật', 'Nghe âm thanh'], correctIndex: 0 },
      { prompt: 'Máu mang gì đến cơ quan?', choices: ['Ôxy và chất dinh dưỡng', 'Chỉ nước', 'Chỉ khí CO₂', 'Chỉ muối'], correctIndex: 0 },
      { prompt: 'Mao mạch thuộc hệ gì?', choices: ['Tuần hoàn máu', 'Tiêu hóa', 'Thần kinh', 'Bài tiết'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Bệnh lây qua đường tiêu hóa do vi khuẩn, virus trong thức ăn nước uống bẩn. Rửa tay trước ăn và ăn chín uống sôi là cách phòng bệnh hiệu quả. (Bài 18)',
    questions: [
      { prompt: 'Bệnh đường tiêu hóa lây qua đâu?', choices: ['Thức ăn nước uống bẩn', 'Chỉ qua không khí', 'Chỉ qua da', 'Chỉ qua ánh sáng'], correctIndex: 0 },
      { prompt: 'Cách phòng bệnh nào đúng?', choices: ['Rửa tay và ăn chín uống sôi', 'Không tắm', 'Ăn sống', 'Uống nước ao'], correctIndex: 0 },
      { prompt: 'Vi khuẩn có thể có trong thức ăn không?', choices: ['Có', 'Không', 'Chỉ trong đá', 'Chỉ trong gỗ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất quay quanh Mặt Trời một vòng trong khoảng 365 ngày. Trục Trái Đất nghiêng tạo ra các mùa. Một ngày là thời gian Trái Đất tự quay một vòng. (Bài 19)',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời mất bao lâu?', choices: ['Khoảng 365 ngày', '1 ngày', '30 ngày', '7 ngày'], correctIndex: 0 },
      { prompt: 'Mùa xuân hạ thu đông do điều gì?', choices: ['Trục Trái Đất nghiêng', 'Mặt Trăng che', 'Gió mạnh', 'Núi cao'], correctIndex: 0 },
      { prompt: 'Một ngày là gì?', choices: ['Trái Đất tự quay một vòng', 'Quay quanh Mặt Trời', 'Một tháng', 'Một năm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Năng lượng có thể chuyển từ dạng này sang dạng khác. Pin lưu năng lượng hóa học. Bóng đèn biến điện năng thành quang năng và nhiệt năng. (Bài 20)',
    questions: [
      { prompt: 'Pin lưu năng lượng dạng gì?', choices: ['Hóa học', 'Âm thanh', 'Cơ học', 'Hạt nhân'], correctIndex: 0 },
      { prompt: 'Bóng đèn biến điện năng thành gì?', choices: ['Quang và nhiệt', 'Chỉ âm thanh', 'Chỉ cơ học', 'Chỉ hóa học'], correctIndex: 0 },
      { prompt: 'Năng lượng có thể chuyển đổi không?', choices: ['Có', 'Không', 'Chỉ trong sách', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Cơ thể người cần thức ăn, nước uống, không khí và ánh sáng mặt trời để sống khỏe. Thiếu một trong các yếu tố này, cơ thể dễ mệt mỏi và ốm. (Bài 21)',
    questions: [
      { prompt: 'Cơ thể cần những gì để sống khỏe?', choices: ['Thức ăn, nước, không khí, ánh sáng', 'Chỉ cần nước', 'Chỉ cần thức ăn', 'Chỉ cần ngủ'], correctIndex: 0 },
      { prompt: 'Thiếu yếu tố cần thiết, cơ thể sẽ ra sao?', choices: ['Dễ mệt và ốm', 'Cao lớn hơn', 'Không thay đổi', 'Chỉ khát nước'], correctIndex: 0 },
      { prompt: 'Ánh sáng mặt trời giúp cơ thể tạo vitamin gì?', choices: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tiêu hóa là quá trình biến thức ăn thành chất bổ dưỡng. Miệng nghiền thức ăn, dạ dày tiết dịch tiêu hóa, ruột non hấp thụ chất dinh dưỡng. (Bài 22)',
    questions: [
      { prompt: 'Tiêu hóa là gì?', choices: ['Biến thức ăn thành chất bổ dưỡng', 'Thải phân ra ngoài', 'Hít thở không khí', 'Bơm máu'], correctIndex: 0 },
      { prompt: 'Bộ phận nào hấp thụ chất dinh dưỡng chủ yếu?', choices: ['Ruột non', 'Da', 'Xương', 'Tim'], correctIndex: 0 },
      { prompt: 'Dạ dày có vai trò gì?', choices: ['Tiết dịch tiêu hóa', 'Hấp thụ oxy', 'Nghe âm thanh', 'Bảo vệ da'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Không khí gồm chủ yếu nitơ và ôxy. Ôxy cần cho sự cháy và hô hấp. Nitơ chiếm khoảng bốn phần năm thể tích không khí. (Bài 23)',
    questions: [
      { prompt: 'Không khí gồm chủ yếu những khí nào?', choices: ['Nitơ và ôxy', 'Chỉ ôxy', 'Chỉ nitơ', 'Hiđro và heli'], correctIndex: 0 },
      { prompt: 'Ôxy cần cho quá trình nào?', choices: ['Hô hấp và sự cháy', 'Quang hợp của động vật', 'Tiêu hóa', 'Ngủ'], correctIndex: 0 },
      { prompt: 'Nitơ chiếm khoảng bao nhiêu phần không khí?', choices: ['Bốn phần năm', 'Một phần mười', 'Một nửa', 'Toàn bộ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nước có thể ở thể rắn, lỏng hoặc khí. Nước đá là thể rắn, nước lỏng thường gặp ở sông hồ, hơi nước là thể khí. Khi đun nóng, nước bay hơi. (Bài 24)',
    questions: [
      { prompt: 'Nước đá thuộc thể nào?', choices: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể plasma'], correctIndex: 0 },
      { prompt: 'Khi đun nóng, nước chuyển thành gì?', choices: ['Hơi nước', 'Nước đá', 'Muối', 'Cát'], correctIndex: 0 },
      { prompt: 'Nước có mấy thể cơ bản?', choices: ['Ba thể', 'Hai thể', 'Bốn thể', 'Một thể'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Thực vật quang hợp nhờ lá, ánh sáng, nước và khí cábonic. Quá trình tạo ra ôxy và chất hữu cơ nuôi cây. Rễ hút nước và muối khoáng từ đất. (Bài 25)',
    questions: [
      { prompt: 'Quang hợp cần những gì?', choices: ['Ánh sáng, nước, CO₂', 'Chỉ nước', 'Chỉ đất', 'Chỉ gió'], correctIndex: 0 },
      { prompt: 'Quang hợp tạo ra khí gì?', choices: ['Ôxy', 'Hiđro', 'Nitơ', 'Khí độc'], correctIndex: 0 },
      { prompt: 'Rễ cây có chức năng gì?', choices: ['Hút nước và muối khoáng', 'Hô hấp chính', 'Tiết mật', 'Bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Động vật có xương sống và không xương sống. Cá, chim, ếch, rắn, thú có xương sống. Côn trùng, giun, nhện không có xương sống. (Bài 26)',
    questions: [
      { prompt: 'Cá thuộc nhóm nào?', choices: ['Có xương sống', 'Không xương sống', 'Thực vật', 'Khoáng vật'], correctIndex: 0 },
      { prompt: 'Côn trùng thuộc nhóm nào?', choices: ['Không xương sống', 'Có xương sống', 'Thú', 'Cá'], correctIndex: 0 },
      { prompt: 'Ếch có xương sống không?', choices: ['Có', 'Không', 'Chỉ khi lớn', 'Không xác định'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Mạch máu gồm động mạch, tĩnh mạch và mao mạch. Tim bơm máu đi khắp cơ thể. Máu mang ôxy và chất dinh dưỡng đến các cơ quan. (Bài 27)',
    questions: [
      { prompt: 'Tim có vai trò gì?', choices: ['Bơm máu', 'Tiêu hóa thức ăn', 'Sản xuất mật', 'Nghe âm thanh'], correctIndex: 0 },
      { prompt: 'Máu mang gì đến cơ quan?', choices: ['Ôxy và chất dinh dưỡng', 'Chỉ nước', 'Chỉ khí CO₂', 'Chỉ muối'], correctIndex: 0 },
      { prompt: 'Mao mạch thuộc hệ gì?', choices: ['Tuần hoàn máu', 'Tiêu hóa', 'Thần kinh', 'Bài tiết'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Bệnh lây qua đường tiêu hóa do vi khuẩn, virus trong thức ăn nước uống bẩn. Rửa tay trước ăn và ăn chín uống sôi là cách phòng bệnh hiệu quả. (Bài 28)',
    questions: [
      { prompt: 'Bệnh đường tiêu hóa lây qua đâu?', choices: ['Thức ăn nước uống bẩn', 'Chỉ qua không khí', 'Chỉ qua da', 'Chỉ qua ánh sáng'], correctIndex: 0 },
      { prompt: 'Cách phòng bệnh nào đúng?', choices: ['Rửa tay và ăn chín uống sôi', 'Không tắm', 'Ăn sống', 'Uống nước ao'], correctIndex: 0 },
      { prompt: 'Vi khuẩn có thể có trong thức ăn không?', choices: ['Có', 'Không', 'Chỉ trong đá', 'Chỉ trong gỗ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất quay quanh Mặt Trời một vòng trong khoảng 365 ngày. Trục Trái Đất nghiêng tạo ra các mùa. Một ngày là thời gian Trái Đất tự quay một vòng. (Bài 29)',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời mất bao lâu?', choices: ['Khoảng 365 ngày', '1 ngày', '30 ngày', '7 ngày'], correctIndex: 0 },
      { prompt: 'Mùa xuân hạ thu đông do điều gì?', choices: ['Trục Trái Đất nghiêng', 'Mặt Trăng che', 'Gió mạnh', 'Núi cao'], correctIndex: 0 },
      { prompt: 'Một ngày là gì?', choices: ['Trái Đất tự quay một vòng', 'Quay quanh Mặt Trời', 'Một tháng', 'Một năm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Năng lượng có thể chuyển từ dạng này sang dạng khác. Pin lưu năng lượng hóa học. Bóng đèn biến điện năng thành quang năng và nhiệt năng. (Bài 30)',
    questions: [
      { prompt: 'Pin lưu năng lượng dạng gì?', choices: ['Hóa học', 'Âm thanh', 'Cơ học', 'Hạt nhân'], correctIndex: 0 },
      { prompt: 'Bóng đèn biến điện năng thành gì?', choices: ['Quang và nhiệt', 'Chỉ âm thanh', 'Chỉ cơ học', 'Chỉ hóa học'], correctIndex: 0 },
      { prompt: 'Năng lượng có thể chuyển đổi không?', choices: ['Có', 'Không', 'Chỉ trong sách', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Cơ thể người cần thức ăn, nước uống, không khí và ánh sáng mặt trời để sống khỏe. Thiếu một trong các yếu tố này, cơ thể dễ mệt mỏi và ốm. (Bài 31)',
    questions: [
      { prompt: 'Cơ thể cần những gì để sống khỏe?', choices: ['Thức ăn, nước, không khí, ánh sáng', 'Chỉ cần nước', 'Chỉ cần thức ăn', 'Chỉ cần ngủ'], correctIndex: 0 },
      { prompt: 'Thiếu yếu tố cần thiết, cơ thể sẽ ra sao?', choices: ['Dễ mệt và ốm', 'Cao lớn hơn', 'Không thay đổi', 'Chỉ khát nước'], correctIndex: 0 },
      { prompt: 'Ánh sáng mặt trời giúp cơ thể tạo vitamin gì?', choices: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin K'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tiêu hóa là quá trình biến thức ăn thành chất bổ dưỡng. Miệng nghiền thức ăn, dạ dày tiết dịch tiêu hóa, ruột non hấp thụ chất dinh dưỡng. (Bài 32)',
    questions: [
      { prompt: 'Tiêu hóa là gì?', choices: ['Biến thức ăn thành chất bổ dưỡng', 'Thải phân ra ngoài', 'Hít thở không khí', 'Bơm máu'], correctIndex: 0 },
      { prompt: 'Bộ phận nào hấp thụ chất dinh dưỡng chủ yếu?', choices: ['Ruột non', 'Da', 'Xương', 'Tim'], correctIndex: 0 },
      { prompt: 'Dạ dày có vai trò gì?', choices: ['Tiết dịch tiêu hóa', 'Hấp thụ oxy', 'Nghe âm thanh', 'Bảo vệ da'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Không khí gồm chủ yếu nitơ và ôxy. Ôxy cần cho sự cháy và hô hấp. Nitơ chiếm khoảng bốn phần năm thể tích không khí. (Bài 33)',
    questions: [
      { prompt: 'Không khí gồm chủ yếu những khí nào?', choices: ['Nitơ và ôxy', 'Chỉ ôxy', 'Chỉ nitơ', 'Hiđro và heli'], correctIndex: 0 },
      { prompt: 'Ôxy cần cho quá trình nào?', choices: ['Hô hấp và sự cháy', 'Quang hợp của động vật', 'Tiêu hóa', 'Ngủ'], correctIndex: 0 },
      { prompt: 'Nitơ chiếm khoảng bao nhiêu phần không khí?', choices: ['Bốn phần năm', 'Một phần mười', 'Một nửa', 'Toàn bộ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nước có thể ở thể rắn, lỏng hoặc khí. Nước đá là thể rắn, nước lỏng thường gặp ở sông hồ, hơi nước là thể khí. Khi đun nóng, nước bay hơi. (Bài 34)',
    questions: [
      { prompt: 'Nước đá thuộc thể nào?', choices: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Thể plasma'], correctIndex: 0 },
      { prompt: 'Khi đun nóng, nước chuyển thành gì?', choices: ['Hơi nước', 'Nước đá', 'Muối', 'Cát'], correctIndex: 0 },
      { prompt: 'Nước có mấy thể cơ bản?', choices: ['Ba thể', 'Hai thể', 'Bốn thể', 'Một thể'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Thực vật quang hợp nhờ lá, ánh sáng, nước và khí cábonic. Quá trình tạo ra ôxy và chất hữu cơ nuôi cây. Rễ hút nước và muối khoáng từ đất. (Bài 35)',
    questions: [
      { prompt: 'Quang hợp cần những gì?', choices: ['Ánh sáng, nước, CO₂', 'Chỉ nước', 'Chỉ đất', 'Chỉ gió'], correctIndex: 0 },
      { prompt: 'Quang hợp tạo ra khí gì?', choices: ['Ôxy', 'Hiđro', 'Nitơ', 'Khí độc'], correctIndex: 0 },
      { prompt: 'Rễ cây có chức năng gì?', choices: ['Hút nước và muối khoáng', 'Hô hấp chính', 'Tiết mật', 'Bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Động vật có xương sống và không xương sống. Cá, chim, ếch, rắn, thú có xương sống. Côn trùng, giun, nhện không có xương sống. (Bài 36)',
    questions: [
      { prompt: 'Cá thuộc nhóm nào?', choices: ['Có xương sống', 'Không xương sống', 'Thực vật', 'Khoáng vật'], correctIndex: 0 },
      { prompt: 'Côn trùng thuộc nhóm nào?', choices: ['Không xương sống', 'Có xương sống', 'Thú', 'Cá'], correctIndex: 0 },
      { prompt: 'Ếch có xương sống không?', choices: ['Có', 'Không', 'Chỉ khi lớn', 'Không xác định'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Mạch máu gồm động mạch, tĩnh mạch và mao mạch. Tim bơm máu đi khắp cơ thể. Máu mang ôxy và chất dinh dưỡng đến các cơ quan. (Bài 37)',
    questions: [
      { prompt: 'Tim có vai trò gì?', choices: ['Bơm máu', 'Tiêu hóa thức ăn', 'Sản xuất mật', 'Nghe âm thanh'], correctIndex: 0 },
      { prompt: 'Máu mang gì đến cơ quan?', choices: ['Ôxy và chất dinh dưỡng', 'Chỉ nước', 'Chỉ khí CO₂', 'Chỉ muối'], correctIndex: 0 },
      { prompt: 'Mao mạch thuộc hệ gì?', choices: ['Tuần hoàn máu', 'Tiêu hóa', 'Thần kinh', 'Bài tiết'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Bệnh lây qua đường tiêu hóa do vi khuẩn, virus trong thức ăn nước uống bẩn. Rửa tay trước ăn và ăn chín uống sôi là cách phòng bệnh hiệu quả. (Bài 38)',
    questions: [
      { prompt: 'Bệnh đường tiêu hóa lây qua đâu?', choices: ['Thức ăn nước uống bẩn', 'Chỉ qua không khí', 'Chỉ qua da', 'Chỉ qua ánh sáng'], correctIndex: 0 },
      { prompt: 'Cách phòng bệnh nào đúng?', choices: ['Rửa tay và ăn chín uống sôi', 'Không tắm', 'Ăn sống', 'Uống nước ao'], correctIndex: 0 },
      { prompt: 'Vi khuẩn có thể có trong thức ăn không?', choices: ['Có', 'Không', 'Chỉ trong đá', 'Chỉ trong gỗ'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất quay quanh Mặt Trời một vòng trong khoảng 365 ngày. Trục Trái Đất nghiêng tạo ra các mùa. Một ngày là thời gian Trái Đất tự quay một vòng. (Bài 39)',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời mất bao lâu?', choices: ['Khoảng 365 ngày', '1 ngày', '30 ngày', '7 ngày'], correctIndex: 0 },
      { prompt: 'Mùa xuân hạ thu đông do điều gì?', choices: ['Trục Trái Đất nghiêng', 'Mặt Trăng che', 'Gió mạnh', 'Núi cao'], correctIndex: 0 },
      { prompt: 'Một ngày là gì?', choices: ['Trái Đất tự quay một vòng', 'Quay quanh Mặt Trời', 'Một tháng', 'Một năm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Năng lượng có thể chuyển từ dạng này sang dạng khác. Pin lưu năng lượng hóa học. Bóng đèn biến điện năng thành quang năng và nhiệt năng. (Bài 40)',
    questions: [
      { prompt: 'Pin lưu năng lượng dạng gì?', choices: ['Hóa học', 'Âm thanh', 'Cơ học', 'Hạt nhân'], correctIndex: 0 },
      { prompt: 'Bóng đèn biến điện năng thành gì?', choices: ['Quang và nhiệt', 'Chỉ âm thanh', 'Chỉ cơ học', 'Chỉ hóa học'], correctIndex: 0 },
      { prompt: 'Năng lượng có thể chuyển đổi không?', choices: ['Có', 'Không', 'Chỉ trong sách', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
];
