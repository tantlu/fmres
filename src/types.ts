export type Category = 'All' | 'FM Version' | 'Face' | 'Logo' | 'Database' | 'Việt hóa' | 'Mods' | 'Tactics' | 'Guide' | 'Kits';

// Định nghĩa các phiên bản game hỗ trợ
export type GameVersion = 'All' | 'FM24' | 'FM25' | 'FM26'; 

export interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  version?: GameVersion; // <--- THÊM DÒNG NÀY
  author: string;
  image: string;
  downloadLink: string;
  description: string;
  instructions?: string;
  views: number;
  likes: number;
  date: string;
  isHot?: boolean;
  createdAt?: any;
  donateLink?: string;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
}

export const CATEGORIES: Category[] = ['All', 'FM Version', 'Face', 'Logo', 'Database', 'Việt hóa', 'Tactics', 'Mods', 'Guide', 'Kits'];
export const ADMIN_EMAIL = 'nguyentan7799@gmail.com';

// ... (hàm toSlug giữ nguyên)
export const toSlug = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};