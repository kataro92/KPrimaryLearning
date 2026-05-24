export interface HistoryPassage {
  passage: string;
  statements: { text: string; isTrue: boolean }[];
}

import { HISTORY_SUPPLEMENT_DATA } from './historySupplement';
import { HISTORY_SUPPLEMENT_EXTRA_DATA } from './historySupplementExtra';

/** Ngân hàng đọc hiểu lịch sử lớp 4 — nhận định đúng/sai học thuật (HK1/HK2) */
const PASSAGE_DATA: [string, [string, boolean][]][] = [
  [
    'Nhà nước Văn Lang thời các vua Hùng là nhà nước đầu tiên của nước ta. Người dân khi đó sống bằng trồng lúa nước, chăn nuôi và làm nghề thủ công.',
    [
      ['Văn Lang là nhà nước đầu tiên của nước ta.', true],
      ['Thời Văn Lang, người dân biết trồng lúa nước.', true],
      ['Người Văn Lang còn biết chăn nuôi và làm nghề thủ công.', true],
      ['Nhà nước đầu tiên của nước ta là nhà Lý.', false],
      ['Thời Văn Lang, người dân chủ yếu làm nghề đánh cá biển khơi.', false],
      ['Văn Lang hình thành sau thời kỳ nhà Nguyễn.', false],
      ['Các vua Hùng là nhân vật gắn với thời kỳ Văn Lang.', true],
    ],
  ],
  [
    'Giỗ Tổ Hùng Vương nhằm tưởng nhớ công lao dựng nước của các vua Hùng. Đây là ngày thể hiện lòng biết ơn với nguồn cội dân tộc.',
    [
      ['Giỗ Tổ Hùng Vương tưởng nhớ công lao dựng nước của các vua Hùng.', true],
      ['Ngày Giỗ Tổ thể hiện lòng biết ơn nguồn cội.', true],
      ['Giỗ Tổ Hùng Vương gắn với truyền thống tôn vinh cha ông dựng nước.', true],
      ['Giỗ Tổ Hùng Vương là lễ hội tưởng nhớ Ngô Quyền.', false],
      ['Giỗ Tổ chỉ có ở miền Nam, không có ở miền Bắc.', false],
      ['Giỗ Tổ Hùng Vương diễn ra vào ngày 30 tháng 4.', false],
    ],
  ],
  [
    'Âu Lạc do An Dương Vương lập nên. Thành Cổ Loa là kinh đô thời Âu Lạc, thể hiện trình độ xây dựng thành luỹ cao của người Việt cổ.',
    [
      ['Âu Lạc do An Dương Vương lập nên.', true],
      ['Thành Cổ Loa là kinh đô thời Âu Lạc.', true],
      ['Cổ Loa cho thấy kỹ thuật xây thành luỹ của người Việt cổ.', true],
      ['An Dương Vương là vua của nhà Trần.', false],
      ['Kinh đô Âu Lạc đặt tại Thăng Long.', false],
      ['Cổ Loa là thành được xây thời Quang Trung.', false],
      ['Âu Lạc hình thành sau năm 1975.', false],
    ],
  ],
  [
    'Hai Bà Trưng là Trưng Trắc và Trưng Nhị. Hai bà đứng lên khởi nghĩa chống quân Đông Hán, bảo vệ non sông. Người dân nhớ ơn hai bà và lập đền thờ ở nhiều nơi.',
    [
      ['Hai Bà Trưng gồm Trưng Trắc và Trưng Nhị.', true],
      ['Hai Bà Trưng khởi nghĩa chống quân Đông Hán.', true],
      ['Nhân dân lập đền thờ để tưởng nhớ Hai Bà Trưng.', true],
      ['Hai Bà Trưng lãnh đạo khởi nghĩa chống quân Nam Hán.', false],
      ['Hai Bà Trưng là hai vị vua nhà Lý.', false],
      ['Hai Bà Trưng khởi nghĩa vào năm 938.', false],
      ['Hai Bà Trưng được nhân dân coi là tấm gương yêu nước.', true],
    ],
  ],
  [
    'Khởi nghĩa Hai Bà Trưng thể hiện tinh thần yêu nước và quyết tâm giữ gìn đất nước. Sự kiện này được ghi vào sách giáo khoa Lịch sử lớp 4.',
    [
      ['Khởi nghĩa Hai Bà Trưng thể hiện tinh thần yêu nước.', true],
      ['Hai Bà Trưng là nhân vật lịch sử được học ở lớp 4.', true],
      ['Hai bà khởi nghĩa nhằm bảo vệ non sông.', true],
      ['Hai Bà Trưng đầu hàng quân Đông Hán ngay khi mới nổi dậy.', false],
      ['Khởi nghĩa Hai Bà Trưng xảy ra thời nhà Nguyễn.', false],
      ['Hai Bà Trưng chỉ huy quân Đông Hán.', false],
    ],
  ],
  [
    'Năm 938, Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng. Đây là trận đánh quan trọng, đánh dấu kết thúc hơn một nghìn năm Bắc thuộc và mở ra thời kỳ độc lập lâu dài cho đất nước.',
    [
      ['Ngô Quyền đánh bại quân Nam Hán năm 938.', true],
      ['Trận Bạch Đằng năm 938 do Ngô Quyền giành thắng lợi.', true],
      ['Chiến thắng năm 938 mở ra thời kỳ độc lập lâu dài.', true],
      ['Trận Bạch Đằng năm 938 kết thúc thời kỳ Bắc thuộc kéo dài.', true],
      ['Ngô Quyền thua quân Nam Hán trên sông Bạch Đằng.', false],
      ['Trận Bạch Đằng năm 938 do Lê Lợi chỉ huy.', false],
      ['Ngô Quyền giành thắng lợi vào năm 1288.', false],
    ],
  ],
  [
    'Sau chiến thắng Bạch Đằng năm 938, nước ta không còn bị các triều đại phong kiến phương Bắc đô hộ trực tiếp. Sự kiện này có ý nghĩa lớn trong lịch sử dân tộc.',
    [
      ['Sau năm 938, nước ta thoát khỏi ách đô hộ của phong kiến phương Bắc.', true],
      ['Chiến thắng Bạch Đằng năm 938 có ý nghĩa lịch sử lớn.', true],
      ['Ngô Quyền là nhân vật gắn với chiến thắng năm 938.', true],
      ['Sau năm 938, nước ta vẫn tiếp tục bị Bắc thuộc thêm 500 năm.', false],
      ['Chiến thắng năm 938 không liên quan đến độc lập dân tộc.', false],
      ['Ngô Quyền là vua nhà Trần.', false],
    ],
  ],
  [
    'Năm 981, quân và dân nhà Lê đại phá quân Tống xâm lược trên sông Bạch Đằng. Lê Hoàn là nhân vật lãnh đạo cuộc kháng chiến thắng lợi.',
    [
      ['Năm 981, quân dân nhà Lê đánh bại quân Tống.', true],
      ['Trận trên sông Bạch Đằng năm 981 chống quân Tống.', true],
      ['Lê Hoàn lãnh đạo kháng chiến chống quân Tống.', true],
      ['Năm 981, quân Tống giành thắng lợi trên Bạch Đằng.', false],
      ['Lê Hoàn là vua nhà Lý.', false],
      ['Trận Bạch Đằng năm 981 do Ngô Quyền chỉ huy.', false],
      ['Kháng chiến năm 981 diễn ra ở Điện Biên Phủ.', false],
    ],
  ],
  [
    'Năm 1010, vua Lý Công Uẩn dời đô từ Hoa Lư ra Đại La và đổi tên thành Thăng Long. Quyết định này giúp đất nước có vị trí thuận lợi để phát triển lâu dài.',
    [
      ['Lý Công Uẩn dời đô vào năm 1010.', true],
      ['Kinh đô được dời từ Hoa Lư ra Đại La.', true],
      ['Đại La được đổi tên thành Thăng Long.', true],
      ['Việc dời đô năm 1010 có ý nghĩa phát triển lâu dài.', true],
      ['Lý Công Uẩn dời đô từ Thăng Long về Hoa Lư.', false],
      ['Năm 1010, kinh đô đổi tên thành Huế.', false],
      ['Lý Công Uẩn là vua nhà Trần.', false],
    ],
  ],
  [
    'Thăng Long nghĩa là rồng bay lên, thể hiện mong muốn đất nước hưng thịnh. Khu vực Thăng Long sau này trở thành trung tâm chính trị quan trọng của nước ta.',
    [
      ['Thăng Long có nghĩa là rồng bay lên.', true],
      ['Thăng Long trở thành trung tâm chính trị quan trọng.', true],
      ['Tên Thăng Long gắn với mong muốn đất nước hưng thịnh.', true],
      ['Thăng Long là tên gọi của kinh đô thời Lý.', true],
      ['Thăng Long có nghĩa là sông lớn.', false],
      ['Thăng Long chỉ là tên một làng nhỏ, không phải kinh đô.', false],
      ['Thăng Long được đặt tên thời vua Quang Trung.', false],
    ],
  ],
  [
    'Thời nhà Lý, đất nước ta phát triển mạnh về nông nghiệp, thủ công và thương mại. Nhiều chùa, đình, làng nghề được hình thành trong giai đoạn này.',
    [
      ['Thời nhà Lý, nông nghiệp và thủ công phát triển.', true],
      ['Thời Lý hình thành nhiều làng nghề và công trình văn hóa.', true],
      ['Nhà Lý là một triều đại trong lịch sử nước ta.', true],
      ['Thời Lý, đất nước không có hoạt động thương mại.', false],
      ['Nhà Lý tồn tại trước thời Văn Lang.', false],
      ['Thời Lý, kinh đô đặt tại Cổ Loa.', false],
    ],
  ],
  [
    'Thời Trần, quân dân ta ba lần đánh bại quân Mông - Nguyên. Tinh thần đoàn kết và chiến lược đúng đắn đã giúp bảo vệ bờ cõi.',
    [
      ['Quân dân nhà Trần ba lần đánh bại quân Mông - Nguyên.', true],
      ['Tinh thần đoàn kết góp phần vào chiến thắng thời Trần.', true],
      ['Nhà Trần bảo vệ được độc lập trước quân xâm lược.', true],
      ['Kháng chiến thời Trần thể hiện lòng yêu nước.', true],
      ['Nhà Trần thua trận trước quân Mông - Nguyên cả ba lần.', false],
      ['Kháng chiến thời Trần diễn ra trước thời nhà Lý.', false],
      ['Quân Mông - Nguyên là đồng minh của nhà Trần.', false],
    ],
  ],
  [
    'Trần Hưng Đạo là tướng tài thời nhà Trần, có công lớn trong kháng chiến chống quân Mông - Nguyên. Ông được nhân dân kính trọng và nhắc đến trong sách Lịch sử lớp 4.',
    [
      ['Trần Hưng Đạo là tướng tài thời nhà Trần.', true],
      ['Trần Hưng Đạo có công trong kháng chiến chống Mông - Nguyên.', true],
      ['Trần Hưng Đạo là nhân vật lịch sử lớp 4 cần biết.', true],
      ['Trần Hưng Đạo là vua đầu tiên của nhà Lý.', false],
      ['Trần Hưng Đạo chỉ huy quân Mông - Nguyên.', false],
      ['Trần Hưng Đạo gắn với chiến thắng Điện Biên Phủ.', false],
    ],
  ],
  [
    'Năm 1426, Lê Lợi phát động khởi nghĩa Lam Sơn chống quân Minh xâm lược. Phong trào khởi nghĩa lan rộng và giành được nhiều thắng lợi.',
    [
      ['Lê Lợi phát động khởi nghĩa Lam Sơn năm 1426.', true],
      ['Khởi nghĩa Lam Sơn chống quân Minh xâm lược.', true],
      ['Lê Lợi là nhân vật lãnh đạo khởi nghĩa Lam Sơn.', true],
      ['Khởi nghĩa Lam Sơn lan rộng và giành thắng lợi.', true],
      ['Lê Lợi khởi nghĩa chống quân Thanh năm 1789.', false],
      ['Khởi nghĩa Lam Sơn bắt đầu năm 938.', false],
      ['Lê Lợi là vua nhà Trần.', false],
    ],
  ],
  [
    'Chiến thắng Chi Lăng năm 1427 do Lê Lợi lãnh đạo, quyết định thắng lợi của cuộc kháng chiến chống quân Minh. Đây là một trong những trận đánh tiêu biểu thời bậc vua Lê.',
    [
      ['Chiến thắng Chi Lăng diễn ra năm 1427.', true],
      ['Lê Lợi lãnh đạo cuộc kháng chiến có trận Chi Lăng.', true],
      ['Chi Lăng là trận quan trọng trong kháng chiến chống Minh.', true],
      ['Chi Lăng gắn với thời kỳ khởi nghĩa Lam Sơn.', true],
      ['Chi Lăng là trận hải chiến trên biển Đông.', false],
      ['Chi Lăng diễn ra năm 1954.', false],
      ['Chi Lăng do Nguyễn Huệ chỉ huy.', false],
    ],
  ],
  [
    'Quang Trung - Nguyễn Huệ chỉ huy nghĩa quân Tây Sơn và đại phá quân Thanh vào mùa xuân năm 1789. Chiến thắng Ngọc Hồi - Đống Đa là mốc son trong lịch sử.',
    [
      ['Nguyễn Huệ còn được gọi là Quang Trung.', true],
      ['Nghĩa quân Tây Sơn đại phá quân Thanh năm 1789.', true],
      ['Chiến thắng Ngọc Hồi - Đống Đa diễn ra năm 1789.', true],
      ['Quang Trung là nhân vật lịch sử tiêu biểu thời Tây Sơn.', true],
      ['Nguyễn Huệ chỉ huy quân Thanh xâm lược.', false],
      ['Chiến thắng Ngọc Hồi - Đống Đa diễn ra năm 1427.', false],
      ['Quang Trung là vua nhà Lý.', false],
    ],
  ],
  [
    'Chiến thắng năm 1789 bảo vệ độc lập và thể hiện tinh thần quyết chiến bảo vệ Tổ quốc. Người dân ta tự hào về chiến công của vua Quang Trung và nghĩa quân Tây Sơn.',
    [
      ['Chiến thắng năm 1789 bảo vệ độc lập Tổ quốc.', true],
      ['Nghĩa quân Tây Sơn thể hiện tinh thần quyết chiến bảo vệ nước.', true],
      ['Vua Quang Trung được nhân dân tôn vinh chiến công.', true],
      ['Năm 1789, quân Thanh giành thắng lợi tại Thăng Long.', false],
      ['Chiến thắng năm 1789 không có ý nghĩa lịch sử.', false],
      ['Quang Trung đầu hàng quân Thanh.', false],
    ],
  ],
  [
    'Nguyễn Trãi có công lớn trong khởi nghĩa Lam Sơn và viết Bình Ngô đại cáo. Tác phẩm thể hiện tinh thần độc lập dân tộc sau khi đánh đuổi quân Minh.',
    [
      ['Nguyễn Trãi có công trong khởi nghĩa Lam Sơn.', true],
      ['Nguyễn Trãi viết Bình Ngô đại cáo.', true],
      ['Bình Ngô đại cáo thể hiện tinh thần độc lập dân tộc.', true],
      ['Nguyễn Trãi là vua nhà Trần.', false],
      ['Bình Ngô đại cáo viết thời Quang Trung.', false],
      ['Nguyễn Trãi chỉ huy quân Mông - Nguyên.', false],
    ],
  ],
  [
    'Từ năm 1858, thực dân Pháp xâm lược nước ta. Nhân dân ta liên tục đứng lên kháng chiến, bảo vệ độc lập và chủ quyền dân tộc.',
    [
      ['Từ năm 1858, thực dân Pháp xâm lược nước ta.', true],
      ['Nhân dân ta kháng chiến chống thực dân Pháp.', true],
      ['Phong trào kháng chiến nhằm bảo vệ độc lập dân tộc.', true],
      ['Thực dân Pháp xâm lược nước ta từ năm 938.', false],
      ['Năm 1858, nước ta là thuộc địa của Mỹ.', false],
      ['Nhân dân ta không kháng chiến trước thực dân Pháp.', false],
    ],
  ],
  [
    'Chiến dịch Điện Biên Phủ năm 1954 là chiến thắng lớn của quân và dân ta. Chiến thắng này góp phần chấm dứt chiến tranh xâm lược của thực dân Pháp ở Việt Nam.',
    [
      ['Chiến dịch Điện Biên Phủ diễn ra năm 1954.', true],
      ['Điện Biên Phủ là chiến thắng lớn của quân và dân ta.', true],
      ['Chiến thắng Điện Biên Phủ chống thực dân Pháp.', true],
      ['Điện Biên Phủ có ý nghĩa lịch sử quan trọng.', true],
      ['Điện Biên Phủ diễn ra năm 1789.', false],
      ['Đối phương ở Điện Biên Phủ là quân Mông - Nguyên.', false],
      ['Điện Biên Phủ là trận đánh trên biển.', false],
    ],
  ],
  [
    'Bạch Đằng, Chi Lăng, Đống Đa là những địa danh gắn với chiến công chống ngoại xâm của dân tộc. Các địa danh này được nhắc đến trong nhiều bài học lịch sử lớp 4.',
    [
      ['Bạch Đằng là địa danh lịch sử.', true],
      ['Chi Lăng gắn với chiến công chống ngoại xâm.', true],
      ['Đống Đa gắn với chiến thắng chống quân Thanh năm 1789.', true],
      ['Ba địa danh này được học trong lịch sử lớp 4.', true],
      ['Đống Đa là tên một loài cây ăn quả.', false],
      ['Chi Lăng là tên một con sông ở miền Nam hiện nay.', false],
      ['Bạch Đằng chỉ là tên một ngôi làng nhỏ, không liên quan lịch sử.', false],
    ],
  ],
  [
    'Hoa Lư từng là kinh đô thời Đinh - Tiền Lê trước khi vua Lý Công Uẩn dời đô ra Thăng Long. Hoa Lư nằm ở vùng đất Ninh Bình ngày nay.',
    [
      ['Hoa Lư từng là kinh đô thời Đinh - Tiền Lê.', true],
      ['Trước năm 1010, kinh đô đặt tại Hoa Lư.', true],
      ['Hoa Lư thuộc vùng đất Ninh Bình ngày nay.', true],
      ['Hoa Lư là kinh đô thời nhà Nguyễn cuối thế kỷ XIX.', false],
      ['Lý Công Uẩn dời đô từ Thăng Long về Hoa Lư năm 1010.', false],
      ['Hoa Lư là kinh đô thời Quang Trung.', false],
    ],
  ],
  [
    'Nhà nước Đại Việt thời Lý tiếp nối các triều đại trước, xây dựng nền độc lập lâu dài. Đây là giai đoạn đất nước có luật pháp, quân đội và nền văn hóa phát triển.',
    [
      ['Đại Việt thời Lý là giai đoạn đất nước phát triển.', true],
      ['Thời Lý, nước ta có luật pháp và quân đội.', true],
      ['Nhà Lý tiếp nối truyền thống độc lập dân tộc.', true],
      ['Đại Việt thời Lý là tên gọi của nước ta thời kỳ đó.', true],
      ['Thời Lý, nước ta là thuộc địa của nhà Tống.', false],
      ['Nhà Lý không có quân đội.', false],
      ['Đại Việt chỉ xuất hiện thời thực dân Pháp.', false],
    ],
  ],
  [
    'Lịch sử giúp chúng ta hiểu về quá khứ, biết ơn cha ông và thêm yêu Tổ quốc. Học lịch sử cũng rèn cho học sinh khả năng đọc hiểu và ghi nhớ sự kiện.',
    [
      ['Học lịch sử giúp hiểu về quá khứ.', true],
      ['Học lịch sử giúp bồi dưỡng lòng yêu nước.', true],
      ['Học lịch sử rèn kỹ năng đọc hiểu.', true],
      ['Lịch sử giúp biết ơn công lao cha ông.', true],
      ['Học lịch sử không cần hiểu ý nghĩa sự kiện.', false],
      ['Lịch sử chỉ học tên riêng, không học mốc thời gian.', false],
      ['Học lịch sử không liên quan đến hiểu biết dân tộc.', false],
    ],
  ],
  [
    'Khi đọc một đoạn lịch sử, học sinh cần xác định nhân vật, thời gian, địa điểm và ý nghĩa sự kiện. Đây là kỹ năng đọc hiểu cơ bản trong môn Lịch sử lớp 4.',
    [
      ['Đọc hiểu lịch sử cần nắm nhân vật và thời gian.', true],
      ['Đọc hiểu lịch sử cần xác định địa điểm sự kiện.', true],
      ['Đọc hiểu lịch sử cần tìm ý nghĩa của sự kiện.', true],
      ['Kỹ năng đọc hiểu giúp trả lời câu hỏi đúng/sai chính xác.', true],
      ['Khi đọc lịch sử, không cần quan tâm mốc năm.', false],
      ['Đọc hiểu lịch sử chỉ cần đọc lướt, không cần suy luận.', false],
      ['Ý nghĩa sự kiện không thuộc nội dung đọc hiểu.', false],
    ],
  ],
  [
    'Triều đại là thời kỳ một dòng họ cai trị đất nước. Nhà Lý, nhà Trần, nhà Lê là các triều đại lớn được học trong chương trình lịch sử lớp 4.',
    [
      ['Triều đại là thời kỳ một dòng họ cai trị.', true],
      ['Nhà Lý, nhà Trần, nhà Lê là triều đại lớp 4 học.', true],
      ['Mỗi triều đại có những sự kiện lịch sử riêng.', true],
      ['Học triều đại giúp sắp xếp sự kiện theo thời gian.', true],
      ['Triều đại là tên gọi của một trận đánh.', false],
      ['Nhà Lý và nhà Trần là cùng một triều đại.', false],
      ['Triều đại chỉ dùng để chỉ thời kỳ thuộc địa.', false],
    ],
  ],
  [
    'Sông Bạch Đằng gắn với nhiều trận đánh chống ngoại xâm: năm 938, năm 981 và năm 1288. Đây là minh chứng cho truyền thống đánh giặc giỏi của dân tộc.',
    [
      ['Sông Bạch Đằng gắn với nhiều trận chống ngoại xâm.', true],
      ['Trên Bạch Đằng có trận đánh năm 938.', true],
      ['Trên Bạch Đằng có trận đánh năm 1288.', true],
      ['Bạch Đằng thể hiện truyền thống đánh giặc của dân tộc.', true],
      ['Bạch Đằng chỉ có một trận duy nhất trong lịch sử.', false],
      ['Trận Bạch Đằng năm 938 do Trần Hưng Đạo chỉ huy.', false],
      ['Sông Bạch Đằng nằm ở tỉnh An Giang.', false],
    ],
  ],
  [
    'Năm 1288, quân dân nhà Trần đánh bại quân Mông - Nguyên trên sông Bạch Đằng. Trần Quốc Tuấn là nhân vật tiêu biểu của cuộc kháng chiến lần thứ ba.',
    [
      ['Năm 1288, quân dân nhà Trần thắng trên Bạch Đằng.', true],
      ['Trận Bạch Đằng năm 1288 chống quân Mông - Nguyên.', true],
      ['Trần Quốc Tuấn gắn với kháng chiến chống Mông - Nguyên.', true],
      ['Chiến thắng năm 1288 bảo vệ độc lập dân tộc.', true],
      ['Năm 1288, quân Mông - Nguyên chiếm Thăng Long lâu dài.', false],
      ['Trần Quốc Tuấn là vua nhà Lý.', false],
      ['Trận Bạch Đằng năm 1288 do Lê Lợi chỉ huy.', false],
    ],
  ],
  [
    'Ngày 2 tháng 9 năm 1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình. Sự kiện này khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    [
      ['Ngày 2-9-1945 có Tuyên ngôn Độc lập.', true],
      ['Chủ tịch Hồ Chí Minh đọc Tuyên ngôn tại Ba Đình.', true],
      ['Sự kiện năm 1945 khai sinh nhà nước dân chủ cộng hòa.', true],
      ['Tuyên ngôn Độc lập có ý nghĩa lịch sử trọng đại.', true],
      ['Tuyên ngôn Độc lập đọc năm 1954.', false],
      ['Tuyên ngôn Độc lập đọc tại Điện Biên Phủ.', false],
      ['Ngày 2-9-1945 là ngày chiến thắng Bạch Đằng.', false],
    ],
  ],
  [
    'Các di tích lịch sử như đền Hùng, Cổ Loa, Văn Miếu giúp học sinh hiểu thêm về quá khứ. Bảo tồn di tích là cách giữ gìn giá trị văn hóa dân tộc.',
    [
      ['Di tích lịch sử giúp hiểu về quá khứ.', true],
      ['Đền Hùng, Cổ Loa là di tích lịch sử - văn hóa.', true],
      ['Bảo tồn di tích giúp giữ giá trị dân tộc.', true],
      ['Tham quan di tích là hoạt động học tập bổ ích.', true],
      ['Di tích lịch sử không có giá trị giáo dục.', false],
      ['Cổ Loa là công trình xây thời thực dân Pháp.', false],
      ['Đền Hùng chỉ là nơi vui chơi, không liên quan lịch sử.', false],
    ],
  ],
  [
    'Trong lịch sử, nhân dân ta nhiều lần đoàn kết chống giặc ngoại xâm. Tinh thần yêu nước là động lực quan trọng trong các cuộc kháng chiến.',
    [
      ['Nhân dân ta từng đoàn kết chống ngoại xâm.', true],
      ['Tinh thần yêu nước là động lực kháng chiến.', true],
      ['Lịch sử Việt Nam có nhiều cuộc kháng chiến thắng lợi.', true],
      ['Đoàn kết dân tộc góp phần bảo vệ độc lập.', true],
      ['Nhân dân ta không từng kháng chiến chống xâm lược.', false],
      ['Yêu nước không liên quan đến kháng chiến.', false],
      ['Các cuộc kháng chiến đều do một người thực hiện.', false],
    ],
  ],
  [
    'Khi học về một sự kiện lịch sử, cần đặt câu hỏi: Sự việc xảy ra khi nào? Ở đâu? Ai tham gia? Vì sao quan trọng? Cách học này giúp nhớ bài lâu và hiểu sâu.',
    [
      ['Học sự kiện cần biết thời gian và địa điểm.', true],
      ['Học sự kiện cần biết nhân vật tham gia.', true],
      ['Học sự kiện cần tìm hiểu ý nghĩa.', true],
      ['Đặt câu hỏi khi học giúp hiểu sâu hơn.', true],
      ['Học lịch sử chỉ cần học thuộc tên, không cần thời gian.', false],
      ['Ý nghĩa sự kiện không quan trọng khi học.', false],
      ['Không cần biết ai tham gia sự kiện.', false],
    ],
  ],
  ...HISTORY_SUPPLEMENT_DATA,
  ...HISTORY_SUPPLEMENT_EXTRA_DATA,
];

export const HISTORY_PASSAGES: HistoryPassage[] = PASSAGE_DATA.map(([passage, statements]) => ({
  passage,
  statements: statements.map(([text, isTrue]) => ({ text, isTrue })),
}));

/** Tổng số nhận định trong ngân hàng */
export const HISTORY_STATEMENT_COUNT = HISTORY_PASSAGES.reduce(
  (n, r) => n + r.statements.length,
  0
);
