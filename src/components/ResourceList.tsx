import { Search, Plus, Trash2 } from 'lucide-react';
import { type ResourceItem } from '../types';
import ResourceCard from './ResourceCard';

interface ResourceListProps {
  isLoading: boolean;
  items: ResourceItem[];
  isAdmin: boolean;
  onEdit?: (item: ResourceItem) => void;
  onDelete?: (id: string) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
  onAddNew: () => void;
}

export default function ResourceList({ 
  isLoading, 
  items, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onViewDetail, 
  onLike, 
  onDonate, 
  onAddNew 
}: ResourceListProps) {
  
  // 1. Hiệu ứng đang tải (Skeleton Loading)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-800 h-96 animate-pulse">
            <div className="h-44 bg-slate-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
              <div className="h-10 bg-slate-800 rounded mt-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Trạng thái trống (Không có bài viết)
  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-[#161f2e] rounded-2xl border border-dashed border-slate-800">
        <div className="inline-block p-5 bg-slate-800/50 rounded-full mb-4">
          <Search size={40} className="text-slate-600" />
        </div>
        <p className="text-slate-500 font-medium">Không tìm thấy dữ liệu phù hợp.</p>
        
        {/* Chỉ Admin mới thấy nút Thêm mới khi danh sách trống */}
        {isAdmin && (
          <button 
            onClick={onAddNew} 
            className="mt-6 text-emerald-500 font-bold text-sm hover:text-emerald-400 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} /> Thêm bài viết ngay
          </button>
        )}
      </div>
    );
  }

  // 3. Hiển thị danh sách
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id || item.title} className="relative group/card h-full">
          <ResourceCard 
            item={item} 
            // LOGIC QUAN TRỌNG:
            // Nếu là Admin -> truyền hàm onEdit -> Card hiện nút Sửa
            // Nếu là User thường -> truyền undefined -> Card tự ẩn nút Sửa
            onEdit={isAdmin ? onEdit : undefined} 
            onViewDetail={onViewDetail} 
            onLike={onLike} 
            onDonate={onDonate} 
          />

          {/* Nút Xóa: Chỉ render khi là Admin */}
          {isAdmin && item.id && onDelete && (
            <button
              onClick={() => onDelete(item.id!)}
              className="absolute top-3 right-12 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/card:opacity-100 transition-all z-30 hover:scale-110"
              title="Xóa bài viết"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}