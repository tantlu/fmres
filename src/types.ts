export type Category = 
  | 'All' 
  | 'Bài viết' 
  | 'Guide' 
  | 'Tactics' 
  | 'Việt hóa' 
  | 'Face' 
  | 'Logo' 
  | 'Kits' 
  | 'Database' 
  | 'Mods' 
  | 'FM Version';

export type GameVersion = 'All' | 'FM26' | 'FM24' | 'FM23' | 'FM Cũ hơn';

export const GAME_VERSIONS: GameVersion[] = ['All', 'FM26', 'FM24', 'FM23', 'FM Cũ hơn'];

export interface ResourceItem {
  id?: string;
  title: string;
  category: string; // Category CHÍNH (để định danh URL)
  tags?: string[];  // Các Category / Tags PHỤ
  version?: GameVersion;
  author: string;
  image: string;
  downloadLink?: string; // Không bắt buộc đối với bài viết
  description: string;
  instructions?: string;
  views: number;
  likes: number;
  date: string;
  isHot?: boolean;
  createdAt?: { seconds: number; nanoseconds?: number } | null | Record<string, unknown>;
  donateLink?: string;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
  // Trường mở rộng cho chuyên mục Bài viết & Tin tức
  summary?: string;     // Tóm tắt ngắn gọn
  readTime?: string;    // Thời gian đọc ước tính, vd: "5 phút đọc"
  sourceUrl?: string;   // Nguồn tham khảo nếu có
}

export const CATEGORIES: Category[] = [
  'All', 
  'Bài viết', 
  'Guide', 
  'Tactics', 
  'Việt hóa', 
  'Face', 
  'Logo', 
  'Kits', 
  'Database', 
  'Mods', 
  'FM Version'
];

export const ADMIN_EMAIL = 'nguyentan7799@gmail.com';

export const toSlug = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};