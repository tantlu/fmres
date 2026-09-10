import { useState, type MouseEvent } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Edit, CheckCircle2, Sparkles } from 'lucide-react';
import { type ResourceItem } from '../types';
import { getProviderName } from '../utils';

interface CardProps {
  item: ResourceItem;
  onEdit?: (item: ResourceItem) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
  onDownload?: (item: ResourceItem) => void;
}

export default function ResourceCard({ item, onEdit, onViewDetail, onLike, onDonate, onDownload }: CardProps) {
  const [prevItemId, setPrevItemId] = useState(item.id);
  const [liked, setLiked] = useState(false);

  if (item.id !== prevItemId) {
    setPrevItemId(item.id);
    setLiked(false);
  }

  const handleLikeClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!liked) { setLiked(true); onLike(item); }
  };

  const isFm26 = item.version === 'FM26';

  return (
    <div
      className="group relative flex flex-col bg-[#1e153c]/90 hover:bg-[#261b4a] backdrop-blur-md rounded-2xl border border-violet-500/20 hover:border-violet-400/50 transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(124,58,237,0.35)] hover:-translate-y-1.5 overflow-hidden h-full cursor-pointer"
      onClick={() => onViewDetail(item)}
    >
      {/* === IMAGE SECTION === */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#241846]">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#130d25]/85 backdrop-blur-md text-violet-200 rounded-lg border border-violet-400/30 shadow-sm">
            {item.category}
          </span>
          {item.isHot && (
            <span className="px-2 py-1 text-[10px] font-extrabold uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg shadow-md animate-pulse">
              HOT
            </span>
          )}
        </div>

        {/* Nút Like nổi */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 backdrop-blur-md border ${
            liked
              ? 'bg-rose-500 text-white border-rose-400 shadow-lg scale-110'
              : 'bg-[#130d25]/60 text-white/80 border-violet-400/20 hover:bg-rose-500 hover:text-white'
          }`}
          title={liked ? "Đã thích" : "Yêu thích"}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Ảnh với hiệu ứng Zoom */}
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1e153c/a78bfa?text=FM26+Resource'; }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />

        {/* Gradient Overlay để text dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e153c] via-transparent to-transparent opacity-75"></div>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="flex flex-col p-4 sm:p-5 flex-grow gap-2.5">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
            <User size={13} className="text-violet-400" />
            <span className="font-semibold text-slate-300 truncate max-w-[120px]">{item.author}</span>
            <CheckCircle2 size={13} className="text-cyan-400" />
          </div>
          <div className="flex items-center gap-1.5 bg-violet-950/60 px-2 py-0.5 rounded text-[11px] text-slate-400 border border-violet-500/15 font-mono">
            <Calendar size={11} className="text-violet-400" /> {item.date}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 font-display">
          {item.title}
        </h3>

        {/* Tags & Version */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 items-center">
          {item.version && item.version !== 'All' && (
            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md flex items-center gap-1 ${
              isFm26 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm border border-cyan-400/40' 
                : 'bg-violet-950 text-violet-300 border border-violet-500/30'
            }`}>
              {isFm26 && <Sparkles size={10} className="text-cyan-200" />}
              {item.version}
            </span>
          )}
          {item.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#271d4b] text-violet-200 border border-violet-500/20">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* === FOOTER ACTION === */}
      <div className="p-4 pt-0 mt-auto grid grid-cols-5 gap-2">
        {onDownload ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDownload(item); }}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 border border-violet-400/30"
            title={`Tải từ ${getProviderName(item.downloadLink)}`}
          >
            <Download size={14} className="text-cyan-300 shrink-0" />
            <span className="truncate">{getProviderName(item.downloadLink)}</span>
          </button>
        ) : (
          <a
            href={item.downloadLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 border border-violet-400/30"
          >
            <Download size={14} className="text-cyan-300 shrink-0" />
            <span className="truncate">{getProviderName(item.downloadLink)}</span>
          </a>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDonate(item); }}
          className="col-span-1 flex items-center justify-center bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 hover:border-amber-400 rounded-xl transition-all shadow-sm"
          title="Donate tác giả"
        >
          <Coffee size={15} />
        </button>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="col-span-1 flex items-center justify-center bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 hover:border-cyan-400 rounded-xl transition-all shadow-sm"
            title="Chỉnh sửa (Admin)"
          >
            <Edit size={15} />
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="bg-[#150e2c] px-4 py-2 flex items-center justify-between text-[11px] font-medium text-slate-400 border-t border-violet-500/15">
        <span className="flex items-center gap-1.5"><Eye size={12} className="text-violet-400" /> {item.views.toLocaleString()} lượt xem</span>
        <span className="flex items-center gap-1 text-rose-400 font-semibold"><Heart size={11} fill="currentColor" /> {item.likes}</span>
      </div>
    </div>
  );
}