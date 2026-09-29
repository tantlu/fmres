export interface PlayerProfile {
  id: string;
  name: string;
  age: number;
  club: string;
  nationality: string;
  position: string;
  secondaryPositions?: string[];
  pa: number; // Potential Ability out of 200 or 5 stars
  ca: number; // Current Ability
  value: string;
  wage: string;
  image: string;
  role: string;
  foot: 'Trái' | 'Phải' | 'Cả hai';
  strengths: string[];
  weaknesses: string[];
  scoutReport: string;
  attributes: {
    pace: number;
    acceleration: number;
    finishing: number;
    passing: number;
    dribbling: number;
    vision: number;
    composure: number;
    workRate: number;
    stamina: number;
    tackling: number;
  };
  tier: 'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem';
}

export const FM26_PLAYERS: PlayerProfile[] = [
  {
    id: 'yamal-lamine',
    name: 'Lamine Yamal',
    age: 18,
    club: 'Barcelona',
    nationality: 'Tây Ban Nha',
    position: 'AMR',
    secondaryPositions: ['AML', 'AMC'],
    pa: 195,
    ca: 168,
    value: '€140M - €180M',
    wage: '€180k/tuần',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    role: 'Inside Forward / Inverted Winger',
    foot: 'Trái',
    strengths: ['Rê bóng ma thuật', 'Tầm nhìn nhạy bén', 'Tự tin trong các trận cầu đinh', 'Kỹ thuật dứt điểm góc xa'],
    weaknesses: ['Thể lực ở cuối trận', 'Tranh chấp bóng bổng'],
    scoutReport: 'Cầu thủ trẻ số một thế giới trong FM26. Khả năng định đoạt trận đấu từ cánh phải tương tự Lionel Messi thời trẻ. Sở hữu chỉ số Flair và Dribbling cao chót vót ngay từ mùa giải đầu tiên.',
    attributes: {
      pace: 16,
      acceleration: 17,
      finishing: 15,
      passing: 17,
      dribbling: 18,
      vision: 18,
      composure: 16,
      workRate: 14,
      stamina: 14,
      tackling: 8
    },
    tier: 'Wonderkid'
  },
  {
    id: 'endrick-felipe',
    name: 'Endrick',
    age: 19,
    club: 'Real Madrid',
    nationality: 'Brazil',
    position: 'ST',
    secondaryPositions: ['AMR'],
    pa: 190,
    ca: 158,
    value: '€75M - €110M',
    wage: '€120k/tuần',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
    role: 'Advanced Forward / Poacher',
    foot: 'Trái',
    strengths: ['Sức càn lướt dũng mãnh', 'Khả năng sút sấm sét', 'Tốc độ bứt phá cự ly ngắn', 'Tâm lý thi đấu lì lợm'],
    weaknesses: ['Phối hợp bóng ngắn', 'Chuyền bóng sáng tạo'],
    scoutReport: 'Mẫu tiền đạo săn bàn hiện đại kết hợp giữa tốc độ của Ronaldo de Lima và sức mạnh càn lướt của Adriano. Rất thích hợp với các sơ đồ phản công nhanh hoặc gegenpress cường độ cao.',
    attributes: {
      pace: 17,
      acceleration: 18,
      finishing: 16,
      passing: 12,
      dribbling: 16,
      vision: 13,
      composure: 16,
      workRate: 16,
      stamina: 15,
      tackling: 9
    },
    tier: 'Wonderkid'
  },
  {
    id: 'arda-guler',
    name: 'Arda Güler',
    age: 20,
    club: 'Real Madrid',
    nationality: 'Thổ Nhĩ Kỳ',
    position: 'AMC',
    secondaryPositions: ['AMR', 'MC'],
    pa: 186,
    ca: 152,
    value: '€55M - €80M',
    wage: '€95k/tuần',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    role: 'Enganche / Advanced Playmaker',
    foot: 'Trái',
    strengths: ['Nhãn quan chiến thuật thiên tài', 'Sút xa hiểm hóc', 'Đá phạt cố định đẳng cấp', 'Đỡ bước một mềm mại'],
    weaknesses: ['Sức mạnh tranh chấp', 'Tốc độ đường trường'],
    scoutReport: 'Nhạc trưởng cổ điển cực hiếm trong FM26. Khi được xếp đá Trequartista hoặc AP (Attack), Arda có thể tạo ra hơn 15 đường kiến tạo mỗi mùa giải với các đường chọc khe xé toang hàng thủ đối phương.',
    attributes: {
      pace: 14,
      acceleration: 15,
      finishing: 14,
      passing: 18,
      dribbling: 17,
      vision: 18,
      composure: 17,
      workRate: 13,
      stamina: 14,
      tackling: 7
    },
    tier: 'Wonderkid'
  },
  {
    id: 'warren-zaire-emery',
    name: 'Warren Zaïre-Emery',
    age: 19,
    club: 'Paris Saint-Germain',
    nationality: 'Pháp',
    position: 'MC',
    secondaryPositions: ['DM'],
    pa: 188,
    ca: 156,
    value: '€85M - €120M',
    wage: '€140k/tuần',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
    role: 'Box-to-Box Midfielder / Carrilero',
    foot: 'Phải',
    strengths: ['Nền tảng thể lực phi thường', 'Tư duy chiến thuật vượt tuổi', 'Tranh chấp bóng dũng cảm', 'Phát động tấn công chuẩn xác'],
    weaknesses: ['Khả năng sút xa cần cải thiện'],
    scoutReport: 'Trụ cột tuyến giữa hoàn hảo cho bất kỳ đội bóng nào hướng đến chức vô địch Champions League. Trưởng thành vượt bậc về tâm lý và chỉ số Work Rate đạt mức tối đa.',
    attributes: {
      pace: 16,
      acceleration: 15,
      finishing: 12,
      passing: 16,
      dribbling: 15,
      vision: 16,
      composure: 16,
      workRate: 18,
      stamina: 18,
      tackling: 15
    },
    tier: 'Wonderkid'
  },
  {
    id: 'pau-cubarsi',
    name: 'Pau Cubarsí',
    age: 18,
    club: 'Barcelona',
    nationality: 'Tây Ban Nha',
    position: 'DC',
    secondaryPositions: ['DM'],
    pa: 187,
    ca: 150,
    value: '€60M - €90M',
    wage: '€70k/tuần',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
    role: 'Ball Playing Defender (BPD)',
    foot: 'Phải',
    strengths: ['Chuyền dài vượt tuyến thượng thừa', 'Đọc tình huống thông minh', 'Cắt bóng chuẩn xác', 'Bình tĩnh trước áp lực'],
    weaknesses: ['Tốc độ tối đa', 'Sức mạnh cơ bắp'],
    scoutReport: 'Hình mẫu trung vệ chơi chân chuẩn La Masia. Những đường chuyền chéo sân từ phần sân nhà mở toang cánh cho các tiền đạo cánh bứt tốc. Điểm Passing và Composure thuộc hàng top trung vệ giải đấu.',
    attributes: {
      pace: 13,
      acceleration: 14,
      finishing: 7,
      passing: 17,
      dribbling: 14,
      vision: 16,
      composure: 18,
      workRate: 15,
      stamina: 15,
      tackling: 16
    },
    tier: 'Wonderkid'
  },
  {
    id: 'franco-mastantuono',
    name: 'Franco Mastantuono',
    age: 18,
    club: 'River Plate',
    nationality: 'Argentina',
    position: 'AMC',
    secondaryPositions: ['AMR', 'MC'],
    pa: 185,
    ca: 136,
    value: '€25M - €35M',
    wage: '€20k/tuần',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80',
    role: 'Shadow Striker / Inverted Winger',
    foot: 'Trái',
    strengths: ['Mức giá chuyển nhượng cực mềm', 'Khả năng sút xa hiểm hóc', 'Kỹ thuật lắt léo đậm chất Nam Mỹ', 'Tiềm năng tăng trưởng chóng mặt'],
    weaknesses: ['Thể lực châu Âu', 'Hỗ trợ phòng ngự'],
    scoutReport: 'Món hời lớn nhất cho các kỳ chuyển nhượng mùa 1 FM26! Bạn có thể kích hoạt điều khoản giải phóng hợp đồng chỉ khoảng 30-40 triệu Euro để có được viên ngọc quý sáng giá nhất Argentina.',
    attributes: {
      pace: 15,
      acceleration: 16,
      finishing: 15,
      passing: 15,
      dribbling: 17,
      vision: 16,
      composure: 15,
      workRate: 13,
      stamina: 13,
      tackling: 8
    },
    tier: 'Bargain'
  },
  {
    id: 'estevao-willian',
    name: 'Estêvão (Messinho)',
    age: 18,
    club: 'Chelsea / Palmeiras',
    nationality: 'Brazil',
    position: 'AMR',
    secondaryPositions: ['AML', 'ST'],
    pa: 192,
    ca: 145,
    value: '€50M - €80M',
    wage: '€50k/tuần',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
    role: 'Inside Forward (Attack)',
    foot: 'Trái',
    strengths: ['Tốc độ xé gió', 'Kỹ năng 1 đối 1 loại bỏ hậu vệ', 'Khả năng rê bóng dính chân', 'Cú cứa lòng chân trái sắc lẹm'],
    weaknesses: ['Thể hình mỏng cơm', 'Kinh nghiệm thi đấu cọ xát'],
    scoutReport: 'Thần đồng được săn đón ráo riết từ xứ Samba. Tố chất kỹ thuật thiên bẩm và sự táo bạo trong các pha qua người làm điên đảo mọi hàng thủ cánh trái.',
    attributes: {
      pace: 17,
      acceleration: 18,
      finishing: 14,
      passing: 15,
      dribbling: 18,
      vision: 15,
      composure: 14,
      workRate: 14,
      stamina: 14,
      tackling: 7
    },
    tier: 'Wonderkid'
  },
  {
    id: 'francesco-camarda',
    name: 'Francesco Camarda',
    age: 17,
    club: 'AC Milan',
    nationality: 'Ý',
    position: 'ST',
    secondaryPositions: [],
    pa: 188,
    ca: 128,
    value: '€15M - €30M',
    wage: '€15k/tuần',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
    role: 'Poacher / Complete Forward',
    foot: 'Phải',
    strengths: ['Bản năng sát thủ trong vòng cấm', 'Chọn vị trí tuyệt vời', 'Dứt điểm một chạm sắc bén', 'Độ tuổi cực trẻ (17 tuổi)'],
    weaknesses: ['Kỹ năng liên kết lối chơi', 'Sức mạnh thể chất'],
    scoutReport: 'Kỷ lục gia trẻ nhất lịch sử Serie A. Cầu thủ ghi hơn 500 bàn thắng ở các cấp độ trẻ Milan. Nếu được đào tạo đúng cách, Camarda sẽ trở thành chân sút ghi 35+ bàn mỗi mùa sau 4-5 năm.',
    attributes: {
      pace: 15,
      acceleration: 15,
      finishing: 16,
      passing: 11,
      dribbling: 14,
      vision: 12,
      composure: 16,
      workRate: 15,
      stamina: 13,
      tackling: 6
    },
    tier: 'Hidden Gem'
  },
  {
    id: 'kobbie-mainoo',
    name: 'Kobbie Mainoo',
    age: 20,
    club: 'Manchester United',
    nationality: 'Anh',
    position: 'MC',
    secondaryPositions: ['DM'],
    pa: 184,
    ca: 154,
    value: '€80M - €110M',
    wage: '€110k/tuần',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80',
    role: 'Deep Lying Playmaker / Roaming Playmaker',
    foot: 'Phải',
    strengths: ['Thoát pressing đỉnh cao', 'Điềm tĩnh đến kinh ngạc', 'Phán đoán không gian tuyệt vời', 'Giữ nhịp trận đấu'],
    weaknesses: ['Tốc độ đường dài', 'Không chiến'],
    scoutReport: 'Trái tim của tuyến giữa. Sở hữu chỉ số Composure và First Touch ở mức 17-18 ngay từ mùa 1. Cực kỳ an toàn khi cầm bóng thoát khỏi lớp pressing của đối phương.',
    attributes: {
      pace: 14,
      acceleration: 14,
      finishing: 13,
      passing: 16,
      dribbling: 17,
      vision: 16,
      composure: 18,
      workRate: 16,
      stamina: 16,
      tackling: 14
    },
    tier: 'Wonderkid'
  }
];
