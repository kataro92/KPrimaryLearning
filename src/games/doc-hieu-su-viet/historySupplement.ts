import type { HistoryPassage } from './historyBank';
/** Lịch sử lớp 4 bổ sung — 108 nhận định */
export const HISTORY_SUPPLEMENT_DATA: [string, [string, boolean][]][] = [
  [
    "Nhà Lý do Lý Công Uẩn sáng lập năm 1009. Kinh đô đặt tại Thăng Long. Thời Lý có chùa Một Cột và Quốc Tử Giám.",
    [
      [
        "Nhà Lý do Lý Công Uẩn sáng lập.",
        true
      ],
      [
        "Kinh đô thời Lý là Thăng Long.",
        true
      ],
      [
        "Chùa Một Cột gắn với thời Lý.",
        true
      ],
      [
        "Nhà Lý sáng lập năm 938.",
        false
      ],
      [
        "Kinh đô Lý đặt tại Huế.",
        false
      ],
      [
        "Quốc Tử Giám xây thời nhà Nguyễn.",
        false
      ]
    ]
  ],
  [
    "Nhà Trần thay Lý, đẩy lùi quân Nguyên Mông ba lần. Dân tộc ta giữ vững độc lập. Thời Trần có Hội nghị Diên Hồng.",
    [
      [
        "Nhà Trần đẩy lùi quân Nguyên Mông.",
        true
      ],
      [
        "Hội nghị Diên Hồng gắn thời Trần.",
        true
      ],
      [
        "Thời Trần giữ vững độc lập.",
        true
      ],
      [
        "Trần nhường ngôi cho quân Nguyên.",
        false
      ],
      [
        "Diên Hồng là lễ hội thời Lý.",
        false
      ],
      [
        "Nguyên Mông xâm lược một lần duy nhất.",
        false
      ]
    ]
  ],
  [
    "Nhà Lê sơ do Lê Lợi lãnh đạo khởi nghĩa Lam Sơn. Chiến thắng Bạch Đằng năm 1428 kết thúc 20 năm kháng chiến chống Minh.",
    [
      [
        "Lê Lợi lãnh đạo khởi nghĩa Lam Sơn.",
        true
      ],
      [
        "Chiến thắng Bạch Đằng 1428 chống Minh.",
        true
      ],
      [
        "Nhà Lê sơ thành lập sau kháng chiến.",
        true
      ],
      [
        "Lê Lợi đầu hàng quân Minh.",
        false
      ],
      [
        "Bạch Đằng 1428 do Ngô Quyền chỉ huy.",
        false
      ],
      [
        "Kháng chiến chống Minh kéo dài 2 năm.",
        false
      ]
    ]
  ],
  [
    "Quang Trung đại phá quân Thanh năm 1789 tại Ngọc Hồi, Đống Đa. Sự kiện thể hiện tinh thần đoàn kết dân tộc.",
    [
      [
        "Quang Trung đại phá quân Thanh năm 1789.",
        true
      ],
      [
        "Trận Ngọc Hồi - Đống Đa năm 1789.",
        true
      ],
      [
        "Chiến thắng thể hiện tinh thần đoàn kết.",
        true
      ],
      [
        "Quang Trung thua quân Thanh năm 1789.",
        false
      ],
      [
        "Trận diễn ra năm 938.",
        false
      ],
      [
        "Quân Thanh giúp ta giành độc lập.",
        false
      ]
    ]
  ],
  [
    "Nguyễn Huệ lên ngôi hoàng đế năm 1788, hiệu Quang Trung. Ông chú trọng giáo dục và xây dựng đất nước.",
    [
      [
        "Nguyễn Huệ lên ngôi năm 1788.",
        true
      ],
      [
        "Hiệu Quang Trung gắn với Nguyễn Huệ.",
        true
      ],
      [
        "Quang Trung chú trọng giáo dục.",
        true
      ],
      [
        "Nguyễn Huệ là vua nhà Trần.",
        false
      ],
      [
        "Quang Trung bỏ học hành.",
        false
      ],
      [
        "1788 là năm Ngô Quyền đánh Nam Hán.",
        false
      ]
    ]
  ],
  [
    "Phan Bội Châu và Phan Chu Trinh là nhà yêu nước cuối thời Nguyễn. Cả hai đều mong muốn đất nước giàu mạnh, độc lập.",
    [
      [
        "Phan Bội Châu là nhà yêu nước.",
        true
      ],
      [
        "Phan Chu Trinh mong đất nước giàu mạnh.",
        true
      ],
      [
        "Họ hoạt động cuối thời Nguyễn.",
        true
      ],
      [
        "Phan Bội Châu là vua nhà Lý.",
        false
      ],
      [
        "Phan Chu Trinh phản đối độc lập.",
        false
      ],
      [
        "Hai ông sống thời Văn Lang.",
        false
      ]
    ]
  ],
  [
    "Cách mạng tháng Tám năm 1945 do Đảng và Bác Hồ lãnh đạo. Nhân dân giành chính quyền, lập nước Việt Nam Dân chủ Cộng hòa.",
    [
      [
        "Cách mạng tháng Tám năm 1945.",
        true
      ],
      [
        "Bác Hồ gắn với cách mạng 1945.",
        true
      ],
      [
        "Lập nước Việt Nam Dân chủ Cộng hòa.",
        true
      ],
      [
        "Cách mạng 1945 do thực dân Pháp lãnh đạo.",
        false
      ],
      [
        "Tháng Tám năm 1975.",
        false
      ],
      [
        "1945 lập nước Văn Lang.",
        false
      ]
    ]
  ],
  [
    "Chiến thắng Điện Biên Phủ năm 1954 kết thúc kháng chiến chống Pháp. Sự kiện góp phần đưa đất nước hòa bình, thống nhất.",
    [
      [
        "Điện Biên Phủ năm 1954.",
        true
      ],
      [
        "Chiến thắng chống thực dân Pháp.",
        true
      ],
      [
        "Góp phần hòa bình thống nhất.",
        true
      ],
      [
        "Điện Biên Phủ năm 938.",
        false
      ],
      [
        "Ta thua Pháp năm 1954.",
        false
      ],
      [
        "1954 kết thúc kháng chiến chống Mỹ.",
        false
      ]
    ]
  ],
  [
    "Nhà Hậu Lê do Lê Lợi mở đầu. Thời kỳ này ban hành Bộ luật Hồng Đức, thúc đẩy giáo dục và văn hóa.",
    [
      [
        "Nhà Hậu Lê do Lê Lợi mở đầu.",
        true
      ],
      [
        "Bộ luật Hồng Đức ban hành thời Hậu Lê.",
        true
      ],
      [
        "Thời Hậu Lê chú trọng giáo dục.",
        true
      ],
      [
        "Hồng Đức là luật thời nhà Nguyễn.",
        false
      ],
      [
        "Lê Lợi là vua nhà Trần.",
        false
      ],
      [
        "Hậu Lê không có đóng góp văn hóa.",
        false
      ]
    ]
  ],
  [
    "Tây Sơn do ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ lãnh đạo. Phong trào đánh đuổi chúa Nguyễn, chúa Trịnh.",
    [
      [
        "Tây Sơn do ba anh em Nguyễn lãnh đạo.",
        true
      ],
      [
        "Phong trào Tây Sơn chống chúa Trịnh Nguyễn.",
        true
      ],
      [
        "Nguyễn Huệ là nhân vật Tây Sơn.",
        true
      ],
      [
        "Tây Sơn do Ngô Quyền sáng lập.",
        false
      ],
      [
        "Tây Sơn ủng hộ thực dân Pháp.",
        false
      ],
      [
        "Nguyễn Lữ là vua nhà Lý.",
        false
      ]
    ]
  ],
  [
    "Nhà Nguyễn thống nhất đất nước năm 1802. Kinh đô đặt tại Huế. Thời Nguyễn xây kinh thành và lăng tẩm.",
    [
      [
        "Nhà Nguyễn thống nhất năm 1802.",
        true
      ],
      [
        "Kinh đô thời Nguyễn ở Huế.",
        true
      ],
      [
        "Thời Nguyễn có kinh thành Huế.",
        true
      ],
      [
        "Nhà Nguyễn thống nhất năm 938.",
        false
      ],
      [
        "Kinh đô Nguyễn là Thăng Long.",
        false
      ],
      [
        "Nhà Nguyễn do Lý Công Uẩn sáng lập.",
        false
      ]
    ]
  ],
  [
    "Trương Định cùng nhân dân Nam Kỳ chống Pháp xâm lược. Ông là tấm gương yêu nước tiêu biểu cuối thế kỷ XIX.",
    [
      [
        "Trương Định chống Pháp xâm lược.",
        true
      ],
      [
        "Ông lãnh đạo nhân dân Nam Kỳ.",
        true
      ],
      [
        "Trương Định là tấm gương yêu nước.",
        true
      ],
      [
        "Trương Định đầu hàng Pháp.",
        false
      ],
      [
        "Ông hoạt động ở miền Bắc thời Lý.",
        false
      ],
      [
        "Trương Định là vua nhà Trần.",
        false
      ]
    ]
  ],
  [
    "Hoàng Diệu bảo vệ thành Hà Nội chống quân Pháp năm 1882. Ông hy sinh anh dũng, thể hiện tinh thần bất khuất.",
    [
      [
        "Hoàng Diệu bảo vệ Hà Nội năm 1882.",
        true
      ],
      [
        "Ông hy sinh chống quân Pháp.",
        true
      ],
      [
        "Hoàng Diệu thể hiện tinh thần bất khuất.",
        true
      ],
      [
        "Hoàng Diệu mở cửa thành cho Pháp.",
        false
      ],
      [
        "1882 là năm Điện Biên Phủ.",
        false
      ],
      [
        "Hoàng Diệu là vua Quang Trung.",
        false
      ]
    ]
  ],
  [
    "Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, thống nhất đất nước. Lên ngôi hoàng đế, đặt tên nước là Đại Cồ Việt.",
    [
      [
        "Đinh Bộ Lĩnh dẹp loạn 12 sứ quân.",
        true
      ],
      [
        "Ông thống nhất đất nước.",
        true
      ],
      [
        "Đại Cồ Việt là tên nước thời Đinh.",
        true
      ],
      [
        "Đinh Bộ Lĩnh là vua nhà Lý.",
        false
      ],
      [
        "12 sứ quân xảy ra thời Nguyễn.",
        false
      ],
      [
        "Đinh Bộ Lĩnh đầu hàng giặc ngoại.",
        false
      ]
    ]
  ],
  [
    "Lý Thái Tổ dời đô về Thăng Long năm 1010. Sự kiện có ý nghĩa phát triển kinh tế văn hóa Đại Việt.",
    [
      [
        "Lý Thái Tổ dời đô về Thăng Long năm 1010.",
        true
      ],
      [
        "Thăng Long là kinh đô thời Lý.",
        true
      ],
      [
        "Dời đô góp phần phát triển Đại Việt.",
        true
      ],
      [
        "1010 dời đô về Huế.",
        false
      ],
      [
        "Lý Thái Tổ là vua nhà Trần.",
        false
      ],
      [
        "Thăng Long đặt tên thời Nguyễn.",
        false
      ]
    ]
  ],
  [
    "Trần Hưng Đạo chỉ huy cuộc kháng chiến chống Nguyên Mông. Ông viết Hịch tướng sĩ động viên quân dân.",
    [
      [
        "Trần Hưng Đạo chống Nguyên Mông.",
        true
      ],
      [
        "Ông viết Hịch tướng sĩ.",
        true
      ],
      [
        "Trần Hưng Đạo là danh tướng nhà Trần.",
        true
      ],
      [
        "Trần Hưng Đạo đầu hàng Nguyên.",
        false
      ],
      [
        "Hịch tướng sĩ viết thời Nguyễn.",
        false
      ],
      [
        "Ông là vua nhà Lê sơ.",
        false
      ]
    ]
  ],
  [
    "Lê Thánh Tông là vua sáng thời Hậu Lê. Ông chú trọng khoa cử, phát triển văn học và khoa học.",
    [
      [
        "Lê Thánh Tông là vua thời Hậu Lê.",
        true
      ],
      [
        "Ông chú trọng khoa cử.",
        true
      ],
      [
        "Thời ông văn học phát triển.",
        true
      ],
      [
        "Lê Thánh Tông là vua Tây Sơn.",
        false
      ],
      [
        "Ông bãi bỏ khoa cử.",
        false
      ],
      [
        "Lê Thánh Tông sống thời Văn Lang.",
        false
      ]
    ]
  ],
  [
    "Ngày 2 tháng 9 năm 1945, Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình. Sự kiện khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    [
      [
        "Tuyên ngôn Độc lập đọc ngày 2/9/1945.",
        true
      ],
      [
        "Bác Hồ đọc tại Ba Đình.",
        true
      ],
      [
        "Sự kiện khai sinh nước Việt Nam Dân chủ Cộng hòa.",
        true
      ],
      [
        "Tuyên ngôn đọc năm 1954.",
        false
      ],
      [
        "2/9/1945 tại Huế.",
        false
      ],
      [
        "1945 lập nước Văn Lang.",
        false
      ]
    ]
  ]
];

export const HISTORY_SUPPLEMENT: HistoryPassage[] = HISTORY_SUPPLEMENT_DATA.map(([passage, statements]) => ({
  passage,
  statements: statements.map(([text, isTrue]) => ({ text, isTrue })),
}));
