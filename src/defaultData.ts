import { type ResourceItem } from './types';

export const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: 'art-fm26-unity-analysis',
    title: 'Phân tích Match Engine FM26: Bước chuyển mình sang Unity Engine và tác động đến Meta chiến thuật',
    category: 'Bài viết',
    tags: ['Tin tức FM', 'Phân tích chiến thuật', 'Cập nhật Patch'],
    version: 'FM26',
    author: 'Nguyễn Tấn',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    summary: 'Tìm hiểu sâu về những cải tiến vật lý bóng lăn, chuyển động cầu thủ và sự biến chuyển của các sơ đồ chiến thuật kinh điển khi Football Manager chuyển sang nền tảng đồ họa Unity.',
    readTime: '6 phút đọc',
    views: 1820,
    likes: 142,
    date: '2026-09-27',
    isHot: true,
    description: `
      <h2>1. Kỷ nguyên mới của Football Manager với Unity Engine</h2>
      <p>Việc chuyển đổi sang <strong>Unity Engine</strong> đánh dấu bước ngoặt lớn nhất trong lịch sử hơn hai thập kỷ của dòng game Football Manager. Không chỉ đơn thuần là sự nâng cấp về mặt đồ họa và ánh sáng sân vận động, Unity mang đến một hệ thống vật lý hoàn toàn mới cho trái bóng và chuyển động cơ thể của từng cầu thủ trên sân.</p>
      
      <h2>2. Trọng tâm chuyển động và vật lý va chạm thực tế</h2>
      <p>Ở các phiên bản trước (như FM24, FM23), chúng ta thường thấy các tình huống bóng dính chân hoặc quỹ đạo bóng có phần tuyến tính. Với FM26, quán tính của cầu thủ được tính toán chi tiết hơn rất nhiều dựa trên các chỉ số <em>Balance (Thăng bằng)</em>, <em>Agility (Nhanh nhẹn)</em> và <em>Strength (Sức mạnh)</em>.</p>
      <blockquote>
        "Cầu thủ không còn có thể xoay người 180 độ ngay lập tức để chuyền bóng như trước. Mọi động tác hãm bóng và đổi hướng đều phụ thuộc chặt chẽ vào đà di chuyển."
      </blockquote>

      <h2>3. Tác động trực tiếp đến Meta Chiến thuật</h2>
      <ul>
        <li><strong>Gegenpress không còn là 'chìa khóa vạn năng':</strong> Cường độ pressing cực cao sẽ làm cầu thủ tiêu hao thể lực nhanh hơn gấp bội, khiến khoảng trống ở 20 phút cuối trận trở thành tử huyệt nếu bạn không biết điều tiết nhịp độ (Tempo).</li>
        <li><strong>Vai trò của Tiền vệ phòng ngự (Anchor / Half Back):</strong> Trở nên quan trọng hơn bao giờ hết để bọc lót khi hai hậu vệ cánh dâng cao tấn công (Inverted Wing-Backs).</li>
        <li><strong>Không chiến và bóng bổng:</strong> Chiều cao và sức bật (Jumping Reach) phát huy tối đa hiệu quả trong các pha tranh chấp phạt góc và tạt cánh đánh đầu.</li>
      </ul>

      <h2>4. Lời kết và gợi ý cho các HLV ảo</h2>
      <p>Hãy dành thời gian theo dõi toàn bộ 90 phút ở chế độ xem chi tiết trong giai đoạn tiền mùa giải để nhận diện rõ điểm nóng trên sân thay vì chỉ nhìn vào thanh thống kê xG. Chúc các bạn có những mùa giải thăng hoa cùng Football Manager!</p>
    `,
    instructions: 'Nguồn bài viết: Tổng hợp từ SI Games Dev Blog và phân tích thực chiến từ cộng đồng FMVN.'
  },
  {
    id: 'art-premier-league-licensed',
    title: 'Bản quyền giải Ngoại Hạng Anh (Premier League) chính thức cập bến Football Manager',
    category: 'Bài viết',
    tags: ['Tin tức FM', 'Bản quyền', 'Cập nhật Patch'],
    version: 'FM26',
    author: 'Nguyễn Tấn',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    summary: 'Thỏa thuận hợp tác lịch sử giữa Premier League và Sports Interactive mang đến bản quyền hình ảnh chính thức, logo CLB, áo đấu thực tế và cúp vô địch Ngoại Hạng Anh trọn vẹn trong game.',
    readTime: '4 phút đọc',
    views: 2450,
    likes: 198,
    date: '2026-09-25',
    isHot: true,
    description: `
      <h2>1. Thỏa thuận hợp tác mang tính lịch sử</h2>
      <p>Sau nhiều năm người chơi phải cài đặt các bộ logo và kitpack thủ công để trải nghiệm trọn vẹn Ngoại Hạng Anh, <strong>Sports Interactive (SI)</strong> và <strong>Premier League</strong> đã chính thức công bố bản hợp đồng bản quyền nhiều năm. Đây là cột mốc được mong chờ nhất đối với cộng đồng game thủ trên toàn thế giới.</p>
      
      <h2>2. Những điểm mới có mặt trong game</h2>
      <ul>
        <li><strong>Trọn bộ 20 câu lạc bộ Premier League:</strong> Đầy đủ huy hiệu câu lạc bộ chính thức, áo đấu sân nhà, sân khách và bộ thứ ba cập nhật từng mùa giải.</li>
        <li><strong>Hình ảnh cầu thủ chuẩn:</strong> Hàng trăm gương mặt cầu thủ được chụp ảnh studio sắc nét với góc chuẩn Premier League.</li>
        <li><strong>Giao diện bảng tỷ số và phát sóng truyền hình:</strong> Hiệu ứng đồ họa phát sóng truyền hình y hệt trên sóng Sky Sports / TNT Sports khi trận đấu diễn ra.</li>
        <li><strong>Cúp vô địch và lễ trao cúp:</strong> Đoạn cắt cảnh (cutscene) ăn mừng chiếc cúp bạc danh giá chân thực đến từng chi tiết.</li>
      </ul>

      <h2>3. Tiết kiệm thời gian cài đặt mod cho người chơi mới</h2>
      <p>Với sự bổ sung bản quyền chính thức này, người chơi mới tiếp cận tựa game sẽ không còn cảm giác bỡ ngỡ khi thấy các tên CLB bị ẩn hay logo trống rỗng, nâng tầm trải nghiệm giải đấu hấp dẫn nhất hành tinh lên một đẳng cấp mới.</p>
    `,
    instructions: 'Thông cáo báo chí từ Sports Interactive và Ban tổ chức Premier League.'
  },
  {
    id: 'art-top-wonderkids-2026',
    title: 'Top 10 Wonderkids tiềm năng giá rẻ không thể bỏ qua trong Football Manager',
    category: 'Bài viết',
    tags: ['Wonderkids', 'Đánh giá & Review', 'Chuyển nhượng'],
    version: 'All',
    author: 'Nguyễn Tấn',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    summary: 'Danh sách tuyển chọn 10 thần đồng trẻ có chỉ số PA (Potential Ability) cực cao, mức giá phải chăng phù hợp cho mọi đội bóng từ tầm trung đến ông lớn.',
    readTime: '5 phút đọc',
    views: 3100,
    likes: 275,
    date: '2026-09-24',
    isHot: true,
    description: `
      <h2>1. Tiêu chí lựa chọn Wonderkids giá hời</h2>
      <p>Không phải đội bóng nào cũng có ngân sách 80-100 triệu Euro để chiêu mộ những cái tên đã nổi như cồn. Danh sách dưới đây được ban tuyển trạch lọc theo tiêu chí: <strong>Độ tuổi dưới 20, PA từ 155 trở lên, và mức phí giải phóng hợp đồng hoặc chuyển nhượng ban đầu dưới 12 triệu Euro</strong>.</p>
      
      <h2>2. Danh sách 5 gương mặt tiêu biểu nhất</h2>
      <ol>
        <li><strong>Lucas Bergvall (Tiền vệ trung tâm - CM/AM):</strong> Khả năng phân phối bóng tuyệt vời, chỉ số Vision và Passing phát triển cực nhanh sau 1 mùa giải.</li>
        <li><strong>Franco Mastantuono (Tiền vệ tấn công - AMC/RW):</strong> Kèo trái ma thuật đến từ River Plate, kỹ thuật cá nhân và rê bóng đỉnh cao.</li>
        <li><strong>Assan Ouédraogo (Tiền vệ con thoi - BBM):</strong> Thể hình lý tưởng, tốc độ và tranh chấp vượt trội ở khu vực giữa sân.</li>
        <li><strong>Pau Cubarsí (Trung vệ - BPD):</strong> Kỹ năng chuyền bóng phát động tấn công từ phần sân nhà thuộc hàng hiếm có.</li>
        <li><strong>Estêvão Willian (Tiền đạo cánh - AMR):</strong> Khả năng bùng nổ, tốc độ xé gió và dứt điểm chuẩn xác.</li>
      </ol>

      <h2>3. Lời khuyên phát triển tài năng trẻ</h2>
      <p>Hãy đảm bảo cho các cầu thủ này thi đấu ít nhất 15-20 trận mỗi mùa (bao gồm vào sân từ ghế dự bị) và ghép đôi gia sư (Mentoring) với các đàn anh có tính cách <em>Model Citizen</em> hoặc <em>Resolute</em> để tối đa hóa chỉ số ẩn Professionalism.</p>
    `,
    instructions: 'Dữ liệu được trích xuất từ Scout Database và trải nghiệm thực tế qua 5 mùa giải mô phỏng.'
  },
  {
    id: 'guide-gegenpress-masterclass',
    title: 'Cẩm nang hướng dẫn xây dựng chiến thuật Gegenpress & Tiqui-Taca bất bại từ A-Z',
    category: 'Guide',
    tags: ['Chiến thuật', 'Kinh nghiệm chơi', 'Tactics'],
    version: 'All',
    author: 'Nguyễn Tấn',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hướng dẫn chi tiết từng bước thiết lập cự ly đội hình, hướng dẫn cá nhân (Player Instructions) và điều chỉnh linh hoạt trong trận đấu để áp đảo mọi đối thủ.',
    readTime: '8 phút đọc',
    views: 4200,
    likes: 380,
    date: '2026-09-22',
    isHot: true,
    downloadLink: 'https://drive.google.com/file/d/1demo-tactic-gegenpress/view?usp=sharing',
    description: `
      <h2>1. Triết lý cốt lõi của Gegenpress hiện đại</h2>
      <p>Gegenpress không đơn thuần là đuổi theo bóng một cách mù quáng. Đó là việc <strong>kiểm soát không gian</strong> ngay khi vừa mất bóng trong khoảng 5-6 giây đầu tiên, biến pha phản công của đối phương thành cơ hội ghi bàn tức thì cho đội nhà.</p>

      <h2>2. Thiết lập sơ đồ 4-2-3-1 & 4-3-3 chuẩn</h2>
      <ul>
        <li><strong>Hàng công:</strong> Sử dụng 1 <em>Advanced Forward (AF)</em> năng nổ hoặc <em>Complete Forward (CF)</em> để kéo dãn hàng thủ đối phương.</li>
        <li><strong>Hai cánh:</strong> 1 <em>Inside Forward (Support)</em> bó vào trong dứt điểm và 1 <em>Winger (Attack)</em> bám biên kéo giãn hàng thủ.</li>
        <li><strong>Tuyến giữa:</strong> Cặp đôi vàng là <em>Ball Winning Midfielder (Defend)</em> kết hợp với <em>Deep Lying Playmaker (Support)</em> hoặc <em>Box to Box Midfielder</em>.</li>
        <li><strong>Hàng thủ:</strong> Bắt buộc dùng <em>Sweeper Keeper (Support)</em> để dâng cao giải nguy cho bẫy việt vị.</li>
      </ul>

      <h2>3. Hướng dẫn cá nhân quan trọng (Player Instructions)</h2>
      <p>Cần tích chọn <strong>Tackle Harder (Tắc bóng quyết liệt)</strong> cho các vị trí tiền vệ trung tâm và tiền đạo cánh để bóp nghẹt nguồn cấp bóng của đối thủ ngay từ giữa sân.</p>

      <h2>4. Điều chỉnh khi bị đối phương bắt bài</h2>
      <p>Nếu đối thủ đá sơ đồ 5 hậu vệ tử thủ (Low Block), hãy hạ nhịp độ (Tempo) xuống mức Thường (Standard), mở rộng chiều ngang sân và khuyến khích các đường chuyền vào khoảng trống (Pass Into Space).</p>
    `,
    instructions: `
      <p><strong>Cách cài đặt file Tactic tải về:</strong></p>
      <ol>
        <li>Tải file tactic <code>.fmf</code> đính kèm về máy.</li>
        <li>Chép vào thư mục <code>tactics</code> theo đường dẫn Sports Interactive/Football Manager...</li>
        <li>Trong game, vào mục Tactic → Bấm biểu tượng dấu cộng (+) → Chọn Load Tactic → Chọn file vừa tải.</li>
      </ol>
    `
  },
  {
    id: 'res-df11-facepack',
    title: 'DF11 Megapack 2026 - Bộ Facepack ảnh chân dung cầu thủ chất lượng cao',
    category: 'Face',
    tags: ['Face', 'Đồ họa', 'FM26'],
    version: 'FM26',
    author: 'DF11 Community',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    summary: 'Bộ khuôn mặt cầu thủ kích thước lớn 260x310px sắc nét với hơn 200.000 cầu thủ và ban huấn luyện trên toàn cầu.',
    views: 5600,
    likes: 412,
    date: '2026-09-20',
    downloadLink: 'https://drive.google.com/drive/folders/df11-megapack-demo',
    isHot: true,
    description: `
      <p>Bộ ảnh chân dung <strong>DF11 Megapack</strong> là tiêu chuẩn đồ họa chân dung cầu thủ được cộng đồng Football Manager ưa chuộng nhất trong suốt 10 năm qua.</p>
      <ul>
        <li>Độ phân giải siêu nét 260x310 pixel, chuẩn phong cách chân dung thẻ cầu thủ bóng đá chuyên nghiệp.</li>
        <li>Cập nhật đầy đủ áo đấu mùa giải mới nhất của các giải VĐQG hàng đầu: Ngoại Hạng Anh, La Liga, Serie A, Bundesliga, V-League...</li>
        <li>Tương thích hoàn hảo với giao diện mặc định cũng như tất cả các bộ custom skin FM26 và FM24.</li>
      </ul>
    `,
    instructions: `
      <p>Giải nén toàn bộ thư mục ảnh vào đường dẫn <code>graphics/faces</code> trong thư mục Football Manager của bạn. Sau đó vào Tùy chọn game, bỏ tích Cache và bấm Tải lại giao diện (Reload Skin).</p>
    `
  },
  {
    id: 'res-tcm-logos-2026',
    title: 'TCM Logos Megapack 2026 - Hơn 70.000 Logo CLB & Giải đấu toàn cầu',
    category: 'Logo',
    tags: ['Logo', 'Đồ họa', 'All'],
    version: 'All',
    author: 'TCMLogos Team',
    image: 'https://images.unsplash.com/photo-1489944445391-11621463fc02?auto=format&fit=crop&w=1200&q=80',
    summary: 'Trọn bộ logo câu lạc bộ, cờ quốc gia, logo giải đấu được làm sắc nét, chuẩn nhận diện thương hiệu quốc tế.',
    views: 4890,
    likes: 367,
    date: '2026-09-18',
    downloadLink: 'https://mega.nz/folder/tcm-logos-2026-demo',
    isHot: false,
    description: `
      <p>Gói <strong>TCM Logos</strong> bao gồm đầy đủ logo câu lạc bộ từ hạng đấu cao nhất cho đến các giải nghiệp dư của hơn 220 quốc gia và vùng lãnh thổ.</p>
      <ul>
        <li>Bao gồm Normal Logo (cỡ lớn) và Small Logo (cỡ nhỏ hiển thị trên bảng xếp hạng).</li>
        <li>Bổ sung logo các giải đấu cúp quốc tế (UEFA Champions League, World Cup, AFC Champions League...).</li>
        <li>Tối ưu dung lượng nhẹ nhàng, không gây giật lag khi tải game.</li>
      </ul>
    `,
    instructions: `
      <p>Giải nén vào thư mục <code>graphics/logos</code>. Sau đó vào Preferences → Reload Skin trong game.</p>
    `
  },
  {
    id: 'res-viet-hoa-fm-chuan',
    title: 'Bản dịch Việt Hóa Football Manager 2026 & FM24 Chuẩn Thuật Ngữ Bóng Đá',
    category: 'Việt hóa',
    tags: ['Việt hóa', 'FM26', 'FM24'],
    version: 'FM26',
    author: 'Cộng Đồng FMVN',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80',
    summary: 'Bản dịch tiếng Việt tâm huyết 100% các mục giao diện, hộp thư họp báo, chiến thuật và bản tin của Football Manager.',
    views: 7100,
    likes: 620,
    date: '2026-09-26',
    downloadLink: 'https://drive.google.com/file/d/viet-hoa-fm-chuan-demo/view',
    isHot: true,
    description: `
      <p>Bản dịch tiếng Việt được thực hiện bởi đội ngũ các HLV kỳ cựu của cộng đồng <strong>FMVN</strong>, dịch thuật sát nghĩa chuyên môn bóng đá, không dùng văn dịch máy ngô nghê.</p>
      <ul>
        <li>Chuẩn hóa các thuật ngữ chiến thuật: Gegenpress, Tiqui-Taca, Regista, Mezzala, Inverted Winger...</li>
        <li>Dịch trọn vẹn các cuộc họp báo, nói chuyện với cầu thủ (Team Talk) và tương tác với ban lãnh đạo.</li>
        <li>Hỗ trợ font chữ tiếng Việt có dấu đẹp mắt, không lỗi vỡ chữ trên mọi độ phân giải màn hình.</li>
      </ul>
    `,
    instructions: `
      <p>Chép file ngôn ngữ <code>vietnamese.ltc</code> vào thư mục <code>languages</code> trong thư mục game. Sau đó vào Tùy chọn (Preferences) → Language → Chọn Tiếng Việt.</p>
    `
  }
];
