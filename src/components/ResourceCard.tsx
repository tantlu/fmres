import { useState, useEffect, type MouseEvent } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Edit, CheckCircle2 } from 'lucide-react';
import { type ResourceItem } from '../types';

interface CardProps {
  item: ResourceItem;
  onEdit?: (item: ResourceItem) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
}

export default function ResourceCard({ item, onEdit, onViewDetail, onLike, onDonate }: CardProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => { setLiked(false); }, [item.id]);

  const handleLikeClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!liked) { setLiked(true); onLike(item); }
  };

  return (
    <div
      className="group relative flex flex-col bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-1 overflow-hidden h-full cursor-pointer"
      onClick={() => onViewDetail(item)}
    >
      {/* === IMAGE SECTION === */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surfaceHighlight">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10 shadow-sm">
            {item.category}
          </span>
          {item.isHot && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg animate-pulse">
              HOT
            </span>
          )}
        </div>

        {/* Nút Like nổi */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 backdrop-blur-md border ${liked
              ? 'bg-rose-500 text-white border-rose-500 shadow-lg scale-110'
              : 'bg-black/40 text-white/70 border-white/10 hover:bg-rose-500 hover:text-white'
            }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Ảnh với hiệu ứng Zoom */}
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=FM+Res'; }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay để text dễ đọc nếu muốn đè text lên ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="flex flex-col p-5 flex-grow gap-3">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <User size={12} />
            <span className="font-medium truncate max-w-[100px]">{item.author}</span>
            <CheckCircle2 size={12} className="text-primary" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded text-[10px]">
            <Calendar size={10} /> {item.date}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-zinc-100 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {item.version && item.version !== 'All' && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {item.version}
            </span>
          )}
          {item.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* === FOOTER ACTION === */}
      <div className="p-4 pt-0 mt-auto grid grid-cols-5 gap-2">
        <a
          href={item.downloadLink}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="col-span-3 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-white/5 hover:-translate-y-0.5"
        >
          <Download size={14} /> Tải Xuống
        </a>
        <button
          onClick={(e) => { e.stopPropagation(); onDonate(item); }}
          className="col-span-1 flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/30 hover:border-amber-500 rounded-lg transition-all"
          title="Donate"
        >
          <Coffee size={16} />
        </button>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="col-span-1 flex items-center justify-center bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/30 hover:border-blue-500 rounded-lg transition-all"
          >
            <Edit size={16} />
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="bg-black/20 px-5 py-2 flex items-center justify-between text-[10px] font-medium text-zinc-500 border-t border-white/5">
        <span className="flex items-center gap-1"><Eye size={12} /> {item.views.toLocaleString()} view</span>
        <span className="flex items-center gap-1 text-rose-500/80"><Heart size={10} fill="currentColor" /> {item.likes}</span>
      </div>
    </div>
  );
}