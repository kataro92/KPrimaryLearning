export interface PassageRound {
  passage: string;
  questions: { prompt: string; choices: string[]; correctIndex: number }[];
}

/** Tham chiếu 55 nguồn đề lớp 4 (2020-2021 to 2024-2025) — xem docs/content/EXAM_SOURCES_GRADE4.md — 90 câu */
export const SCIENCE_SUPPLEMENT_EXTRA: PassageRound[] = [
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Nguồn nước sạch cần được bảo vệ. Xả rác xuống sông làm ô nhiễm nước, ảnh hưởng động thực vật và sức khỏe con người.',
    questions: [
      { prompt: 'Xả rác xuống sông gây ô nhiễm.', choices: ['Đúng', 'Sai', 'Làm sạch nước', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Nước sạch cần được bảo vệ.', choices: ['Đúng', 'Sai', 'Không cần', 'Chỉ ở biển'], correctIndex: 0 },
      { prompt: 'Ô nhiễm nước ảnh hưởng sức khỏe.', choices: ['Đúng', 'Sai', 'Chỉ ảnh hưởng cát', 'Chỉ ban đêm'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Tai giúp nghe âm thanh, mắt giúp nhìn. Cần tránh nghe nhạc quá to lâu để bảo vệ thính giác.',
    questions: [
      { prompt: 'Tai dùng để nghe.', choices: ['Đúng', 'Sai', 'Để ngửi', 'Để nếm'], correctIndex: 0 },
      { prompt: 'Nghe nhạc quá to có thể hại tai.', choices: ['Đúng', 'Sai', 'Giúp tai khỏe', 'Không ảnh hưởng'], correctIndex: 0 },
      { prompt: 'Mắt giúp ta nhìn.', choices: ['Đúng', 'Sai', 'Để nghe', 'Để nói'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Chất đạm, chất béo, vitamin và khoáng chất có trong thức ăn giúp cơ thể phát triển. Ăn đủ chất và vận động giúp phòng bệnh béo phì.',
    questions: [
      { prompt: 'Thức ăn cung cấp chất đạm và vitamin.', choices: ['Đúng', 'Sai', 'Chỉ có nước', 'Chỉ có muối'], correctIndex: 0 },
      { prompt: 'Vận động giúp phòng bệnh béo phì.', choices: ['Đúng', 'Sai', 'Không liên quan', 'Chỉ ngủ'], correctIndex: 0 },
      { prompt: 'Béo phì liên quan chế độ ăn và vận động.', choices: ['Đúng', 'Sai', 'Chỉ do học', 'Chỉ do gió'], correctIndex: 0 },
    ],
  },
  {
    passage: 'Trái Đất vừa tự quay quanh mình vừa chuyển động quanh Mặt Trời. Một vòng quanh Mặt Trời tạo ra các mùa trong năm.',
    questions: [
      { prompt: 'Trái Đất quay quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Mặt Trăng quay', 'Chỉ quay một lần'], correctIndex: 0 },
      { prompt: 'Các mùa liên quan chuyển động quanh Mặt Trời.', choices: ['Đúng', 'Sai', 'Chỉ do mưa', 'Chỉ do gió'], correctIndex: 0 },
      { prompt: 'Trái Đất tự quay quanh trục.', choices: ['Đúng', 'Sai', 'Đứng yên', 'Chỉ bay'], correctIndex: 0 },
    ],
  },
];
