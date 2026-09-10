import { useState, useMemo } from 'react';
import { Search, Plus, Trash2, LayoutGrid, Table, ArrowUpDown, Flame, Sparkles } from 'lucide-react';
import { type ResourceItem } from '../types';
import ResourceCard from './ResourceCard';
import CompactTableView from './CompactTableView';

interface ResourceListProps {
  isLoading: boolean;
  items: ResourceItem[];
  isAdmin: boolean;
  onEdit?: (item: ResourceItem) => void;
  onDelete?: (id: string) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
  onDownload?: (item: ResourceItem) => void;
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
  onDownload,
  onAddNew 
}: ResourceListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes' | 'title'>('newest');

  // Sorted items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'vi');
      // Default: newest by date string (YYYY-MM-DD) or id
      return (b.date || '').localeCompare(a.date || '');
    });
  }, [items, sortBy]);

  // 1. Hiệu ứng đang tải (Skeleton Loading)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#1e153c]/80 rounded-2xl overflow-hidden border border-violet-500/20 h-96 animate-pulse">
            <div className="h-44 bg-[#281b4e]"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-[#281b4e] rounded-md w-1/3"></div>
              <div className="h-6 bg-[#281b4e] rounded-md w-4/5"></div>
              <div className="h-4 bg-[#281b4e] rounded-md w-1/2 mt-4"></div>
              <div className="h-10 bg-[#281b4e] rounded-xl mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Trạng thái trống (Không có bài viết)
  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-[#181033]/80 rounded-3xl border border-dashed border-violet-500/30 backdrop-blur-md">
        <div className="inline-flex p-5 bg-violet-950/60 rounded-2xl mb-4 border border-violet-500/30 text-violet-300 shadow-lg">
          <Search size={36} className="text-violet-400" />
        </div>
        <h4 className="text-white text-lg font-bold font-display mb-1">Không tìm thấy tài nguyên phù hợp</h4>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục khác để khám phá thêm nội dung.</p>
        
        {/* Chỉ Admin mới thấy nút Thêm mới khi danh sách trống */}
        {isAdmin && (
          <button 
            onClick={onAddNew} 
            className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105"
          >
            <Plus size={16} /> Thêm tài nguyên mới ngay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD Header Bar: Count + Sort + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#181033]/80 p-3 sm:px-4 rounded-2xl border border-violet-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Hiển thị</span>
            <strong className="text-cyan-300 px-2 py-0.5 rounded-lg bg-[#241748] border border-violet-500/30">
              {items.length}
            </strong>
            <span className="text-slate-400 font-normal lowercase">tài nguyên</span>
          </span>
        </div>

        {/* Controls: Sort + View Mode Switcher */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#120a24] p-1 rounded-xl border border-violet-500/25 text-xs">
            <span className="text-slate-400 pl-2 hidden md:inline flex items-center gap-1 text-[11px]">
              <ArrowUpDown size={12} /> Sắp xếp:
            </span>
            <button
              type="button"
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                sortBy === 'newest'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mới nhất
            </button>
            <button
              type="button"
              onClick={() => setSortBy('views')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1 ${
                sortBy === 'views'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={12} className="text-amber-400" />
              Xem nhiều
            </button>
            <button
              type="button"
              onClick={() => setSortBy('likes')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                sortBy === 'likes'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yêu thích
            </button>
          </div>

          {/* View Mode: Grid vs Table */}
          <div className="flex items-center gap-1 bg-[#120a24] p-1 rounded-xl border border-violet-500/25">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ xem lưới ảnh (Showcase Grid)"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ xem bảng dữ liệu (Compact Data Table)"
            >
              <Table size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Hiển thị danh sách theo View Mode đã chọn */}
      {viewMode === 'table' ? (
        <CompactTableView 
          items={sortedItems}
          isAdmin={isAdmin}
          onViewDetail={onViewDetail}
          onLike={onLike}
          onDonate={onDonate}
          onDownload={onDownload}
          onEdit={isAdmin ? onEdit : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div key={item.id || item.title} className="relative group/card h-full">
              <ResourceCard 
                item={item} 
                onEdit={isAdmin ? onEdit : undefined} 
                onViewDetail={onViewDetail} 
                onLike={onLike} 
                onDonate={onDonate} 
                onDownload={onDownload}
              />

              {/* Nút Xóa: Chỉ render khi là Admin */}
              {isAdmin && item.id && onDelete && (
                <button
                  onClick={() => onDelete(item.id!)}
                  className="absolute top-3 right-12 bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover/card:opacity-100 transition-all z-30 hover:scale-110 border border-rose-400/40"
                  title="Xóa bài viết"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
