import { useState, type MouseEvent } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Edit, CheckCircle2, Sparkles, ShieldCheck, Newspaper, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { type ResourceItem } from '../types';
import { getProviderName, sanitizeGameVersion } from '../utils';

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

  const displayVersion = sanitizeGameVersion(item.version);
  const isFm26 = displayVersion === 'FM26';
  const providerName = getProviderName(item.downloadLink);

  const isArticle = item.category === 'Bài viết';
  const isGuide = item.category === 'Guide';

  // Detect tactical formation (e.g. 4-2-3-1, 4-3-3, 3-4-2-1)
  const formationMatch = item.title.match(/(\d-\d-\d-\d|\d-\d-\d)/);
  const formation = formationMatch ? formationMatch[0] : null;

  return (
    <div
      className={`group relative flex flex-col bg-[#1e153c]/90 hover:bg-[#261b4a] backdrop-blur-md rounded-2xl border transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(124,58,237,0.4)] hover:-translate-y-1.5 overflow-hidden h-full cursor-pointer ${
        isArticle
          ? 'border-cyan-500/30 hover:border-cyan-400/70 ring-1 ring-cyan-500/20'
          : isGuide
            ? 'border-amber-500/30 hover:border-amber-400/70 ring-1 ring-amber-500/20'
            : isFm26 
              ? 'border-violet-500/30 hover:border-cyan-400/60 ring-1 ring-violet-500/20' 
              : 'border-violet-500/20 hover:border-violet-400/50'
      }`}
      onClick={() => onViewDetail(item)}
    >
      {/* === IMAGE SECTION === */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#241846]">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 items-center">
          {isArticle ? (
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-md border border-cyan-400/40 flex items-center gap-1">
              <Newspaper size={11} className="text-cyan-200" /> BÀI VIẾT
            </span>
          ) : isGuide ? (
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md border border-amber-400/40 flex items-center gap-1">
              <BookOpen size={11} className="text-amber-200" /> GUIDE
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#130d25]/90 backdrop-blur-md text-violet-200 rounded-lg border border-violet-400/30 shadow-sm">
              {item.category}
            </span>
          )}

          {formation && (
            <span className="px-2 py-1 text-[10px] font-black uppercase bg-[#0f172a]/90 text-emerald-300 rounded-lg border border-emerald-500/40 shadow-sm flex items-center gap-1 font-mono">
              ⚽ {formation}
            </span>
          )}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e153c] via-transparent to-transparent opacity-80"></div>
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
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2 font-display">
          {item.title}
        </h3>

        {/* Summary Snippet for Articles */}
        {item.summary && (
          <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        )}

        {/* Tags, Version & Read Time */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 items-center">
          {isArticle && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Clock size={10} /> {item.readTime || '4 phút đọc'}
            </span>
          )}

          {displayVersion && (
            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md flex items-center gap-1 ${
              isFm26 
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm border border-cyan-400/40' 
                : 'bg-violet-950 text-cyan-300 border border-cyan-500/30'
            }`}>
              {isFm26 && <Sparkles size={10} className="text-cyan-200" />}
              {displayVersion}
            </span>
          )}
          {item.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#271d4b] text-violet-200 border border-violet-500/20">
              #{tag}
            </span>
          ))}

          {!isArticle && (
            <span className="ml-auto text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              {providerName}
            </span>
          )}
        </div>
      </div>

      {/* === FOOTER ACTION === */}
      <div className="p-4 pt-0 mt-auto grid grid-cols-5 gap-2">
        {isArticle ? (
          /* Nút Đọc Bài Viết */
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewDetail(item); }}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 border border-cyan-400/30"
          >
            <BookOpen size={14} className="text-cyan-200 shrink-0" />
            <span>Đọc bài viết</span>
            <ArrowRight size={13} className="text-cyan-200" />
          </button>
        ) : isGuide ? (
          /* Nút Xem Guide */
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewDetail(item); }}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-violet-600 hover:from-amber-500 hover:to-violet-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-amber-600/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 border border-amber-400/30"
          >
            <BookOpen size={14} className="text-amber-200 shrink-0" />
            <span>Xem hướng dẫn</span>
          </button>
        ) : onDownload ? (
          /* Nút Tải Tài nguyên */
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDownload(item); }}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 border border-violet-400/30"
            title={`Tải từ ${providerName}`}
          >
            <Download size={14} className="text-cyan-300 shrink-0" />
            <span className="truncate">Tải từ {providerName}</span>
          </button>
        ) : (
          <a
            href={item.downloadLink || '#'}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="col-span-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 border border-violet-400/30"
          >
            <Download size={14} className="text-cyan-300 shrink-0" />
            <span className="truncate">Tải từ {providerName}</span>
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
