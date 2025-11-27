export type Category = 'All' | 'FM Version' | 'Face' | 'Logo' | 'Database' | 'Việt hóa' | 'Mods' | 'Tactics' | 'Guide' | 'Kits';

export interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  author: string;
  image: string;
  downloadLink: string;
  description: string;
  
  instructions?: string; // <--- THÊM DÒNG NÀY (Dấu ? nghĩa là không bắt buộc)
  
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

export const toSlug = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};