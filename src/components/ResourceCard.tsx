import { useState, useEffect, type MouseEvent } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Info, Edit, Check } from 'lucide-react';
import { type ResourceItem } from '../types';

interface CardProps {
  item: ResourceItem;
  onEdit?: (item: ResourceItem) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
}

// Hàm chọn màu sắc cho Tag Phiên bản
const getVersionColor = (ver?: string) => {
  switch (ver) {
    case 'FM26': return 'bg-purple-600 text-white border-purple-500 shadow-purple-900/20';
    case 'Tất cả': return 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-900/20';
    case 'FM24': return 'bg-blue-600 text-white border-blue-500 shadow-blue-900/20';
    default: return 'bg-slate-700 text-slate-300 border-slate-600';
  }
};

export default function ResourceCard({ item, onEdit, onViewDetail, onLike, onDonate }: CardProps) {
  const [liked, setLiked] = useState(false);

  // Reset trạng thái like khi item thay đổi
  useEffect(() => {
    setLiked(false);
  }, [item.id]);

  const handleLikeClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      onLike(item);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 h-full">
      
      {/* --- CÁC BADGES (TAG NỔI) --- */}

      {/* 1. Category chính (Góc Phải) */}
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 z-20 uppercase shadow-sm">
        {item.category}
      </div>

      {/* 2. Version Tag (Góc Trái, cạnh nút tim) */}
      {item.version && item.version !== 'All' && (
        <div className={`absolute top-3 left-12 z-20 text-[9px] font-bold px-2 py-1 rounded-md border shadow-sm ${getVersionColor(item.version)}`}>
          {item.version}
        </div>
      )}

      {/* 3. HOT Tag */}
      {item.isHot && (
        <div className="absolute top-10 right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm z-20 animate-pulse shadow-md">
          HOT
        </div>
      )}

      {/* --- CÁC NÚT TÁC VỤ TRÊN ẢNH --- */}

      {/* Nút Thả tim */}
      <button
        onClick={handleLikeClick}
        className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-300 shadow-sm border ${
          liked
            ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 scale-110'
            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-rose-500/20 hover:text-rose-500 hover:border-rose-500/30 backdrop-blur-md'
        }`}
        title="Thả tim"
      >
        <Heart size={14} fill={liked ? "currentColor" : "none"} />
      </button>

      {/* Nút Edit (Chỉ hiện khi là Admin) */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="absolute top-14 left-3 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
          title="Chỉnh sửa (Admin)"
        >
          <Edit size={14} />
        </button>
      )}

      {/* --- KHUNG ẢNH --- */}
      <div
        className="relative h-44 w-full flex items-center justify-center overflow-hidden bg-[#0f172a] cursor-pointer group-hover:bg-[#111827] transition-colors"
        onClick={() => onViewDetail(item)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-80"></div>
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }}
          className="relative z-10 h-36 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* --- PHẦN NỘI DUNG --- */}
      <div className="flex flex-col p-4 flex-grow bg-[#1e293b]">
        {/* Tác giả */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-medium">
          <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={10} />
          </div>
          <span className="truncate max-w-[150px] tracking-wide text-slate-300">{item.author}</span>
          <Check size={12} className="text-emerald-500 ml-0.5" strokeWidth={3} />
        </div>

        {/* Tiêu đề */}
        <h3
          className="text-white font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors cursor-pointer"
          onClick={() => onViewDetail(item)}
        >
          {item.title}
        </h3>

        {/* --- HIỂN THỊ TAGS PHỤ (Nằm dưới tiêu đề) --- */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[9px] text-slate-500 py-0.5 px-1">+{item.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Cụm nút hành động */}
        <div className="grid grid-cols-2 gap-2 w-full mt-auto">
          <a
            href={item.downloadLink}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={14} /> TẢI VỀ
          </a>

          <button
            onClick={() => onViewDetail(item)}
            className="col-span-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold py-2 rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Info size={14} /> CHI TIẾT
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDonate(item);
            }}
            className="col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[11px] font-bold py-2 rounded-lg shadow-md shadow-amber-900/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Coffee size={14} /> DONATE
          </button>
        </div>
      </div>

      {/* --- FOOTER CARD --- */}
      <div className="bg-[#161f2e] px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-400 font-medium w-full border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Lượt xem">
            <Eye size={12} /> {item.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-rose-400" title="Lượt thích">
            <Heart size={12} fill="currentColor" /> {(item.likes || 0).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-70">
          <Calendar size={12} /> {item.date}
        </div>
      </div>
    </div>
  );
}