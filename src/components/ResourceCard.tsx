import { useState, type MouseEvent } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Edit, Newspaper, BookOpen, ArrowRight, Flame } from 'lucide-react';
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
    if (!liked) {
      setLiked(true);
      onLike(item);
    }
  };

  const handleDonateClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDonate(item);
  };

  const handleDownloadClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(item);
    } else {
      onViewDetail(item);
    }
  };

  const displayVersion = sanitizeGameVersion(item.version);
  const isFm26 = displayVersion === 'FM26';
  const providerName = getProviderName(item.downloadLink);

  const isArticle = item.category === 'Bài viết';
  const isGuide = item.category === 'Guide';
  const hasDownload = Boolean(item.downloadLink && item.downloadLink.trim() !== '' && item.downloadLink !== '#');

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
            <span className="px-2 py-1 text-[10px] font-extrabold uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg shadow-md flex items-center gap-1 animate-pulse">
              <Flame size={11} /> HOT
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
          onError={(e) => { 
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add('bg-gradient-to-br', 'from-violet-950', 'to-slate-950');
            }
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />

        {/* Gradient Overlay để text dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e153c] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="flex flex-col p-4 sm:p-5 flex-grow gap-2.5">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-violet-300/80">
          <div className="flex items-center gap-1.5">
            {displayVersion ? (
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                isFm26 
                  ? 'bg-violet-600/30 text-cyan-300 border-cyan-400/40' 
                  : 'bg-violet-950/60 text-violet-300 border-violet-500/30'
              }`}>
                {displayVersion}
              </span>
            ) : null}
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar size={12} /> {item.date}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[120px]">
            <User size={12} /> <span className="truncate">{item.author}</span>
          </div>
        </div>

        {/* Tiêu đề */}
        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug font-display">
          {item.title}
        </h3>

        {/* Đoạn trích dẫn tóm tắt */}
        {item.summary ? (
          <p className="text-xs text-violet-200/70 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        ) : item.instructions ? (
          <p className="text-xs text-slate-400/80 line-clamp-2 leading-relaxed">
            {item.instructions}
          </p>
        ) : null}

        {/* Provider Tag hoặc Thời lượng đọc */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-violet-500/15 text-xs">
          <div className="flex items-center gap-2.5 text-violet-300/70 font-mono text-[11px]">
            <span className="flex items-center gap-1" title="Lượt xem">
              <Eye size={12} /> {(item.views || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1" title="Yêu thích">
              <Heart size={12} className={liked ? 'text-rose-400' : ''} fill={liked ? 'currentColor' : 'none'} />
              {(item.likes || 0) + (liked ? 1 : 0)}
            </span>
          </div>

          {isArticle || isGuide ? (
            <span className="text-[11px] font-semibold text-cyan-400">
              {item.readTime || '4 phút đọc'}
            </span>
          ) : providerName ? (
            <span className="text-[11px] font-bold text-violet-300 uppercase px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/20">
              {providerName}
            </span>
          ) : null}
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="grid grid-cols-12 gap-2 pt-2">
          {/* Nút ủng hộ */}
          <button
            onClick={handleDonateClick}
            type="button"
            className="col-span-3 sm:col-span-4 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 hover:border-amber-400 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
            title="Ủng hộ tác giả"
          >
            <Coffee size={13} />
            <span className="hidden sm:inline">Ủng hộ</span>
          </button>

          {/* Nút Đọc bài viết HOẶC Tải về */}
          {isArticle ? (
            <button
              onClick={() => onViewDetail(item)}
              type="button"
              className="col-span-9 sm:col-span-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-cyan-600/30 flex items-center justify-center gap-1.5 border border-cyan-400/40"
            >
              <Newspaper size={13} />
              <span>ĐỌC BÀI VIẾT</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : isGuide ? (
            <button
              onClick={() => onViewDetail(item)}
              type="button"
              className="col-span-9 sm:col-span-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-1.5 border border-amber-400/40"
            >
              <BookOpen size={13} />
              <span>XEM CẨM NANG</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : hasDownload ? (
            <button
              onClick={handleDownloadClick}
              type="button"
              className="col-span-9 sm:col-span-8 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-1.5 border border-violet-400/30"
            >
              <Download size={13} className="text-cyan-300" />
              <span className="truncate">TẢI VỀ {providerName ? `(${providerName.toUpperCase()})` : ''}</span>
            </button>
          ) : (
            <button
              onClick={() => onViewDetail(item)}
              type="button"
              className="col-span-9 sm:col-span-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-1.5 border border-violet-400/30"
            >
              <span>XEM CHI TIẾT</span>
              <ArrowRight size={13} />
            </button>
          )}

          {/* Nút Admin Edit nếu có */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="absolute bottom-2 right-2 p-1.5 bg-[#120a26] hover:bg-violet-900/60 rounded-lg text-slate-400 hover:text-white border border-violet-500/20 transition-all opacity-0 group-hover:opacity-100"
              title="Chỉnh sửa (Admin)"
            >
              <Edit size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
