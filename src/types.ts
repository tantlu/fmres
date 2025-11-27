export type Category = 'All' | 'FM Version' | 'Face' | 'Logo' | 'Database' | 'Việt hóa' | 'Mods' | 'Tactics' | 'Guide' | 'Kits';

export interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  author: string;
  image: string;
  downloadLink: string;
  description: string;
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

// Hàm chuyển tên Category thành đường dẫn (slug)
export const toSlug = (text: string): string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Thay khoảng trắng bằng dấu -
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[^\w\-]+/g, '')       // Bỏ ký tự đặc biệt
    .replace(/\-\-+/g, '-')         // Xử lý nhiều dấu - liên tiếp
    .replace(/^-+/, '')             // Cắt dấu - ở đầu
    .replace(/-+$/, '');            // Cắt dấu - ở cuối
};