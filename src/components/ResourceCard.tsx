import { useState, useEffect } from 'react';
import { Download, Eye, Calendar, User, Heart, Coffee, Info, Edit, Check } from 'lucide-react';
import { type ResourceItem } from '../types'; // Thêm type

interface CardProps {
  item: ResourceItem;
  onEdit?: (item: ResourceItem) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
}

export default function ResourceCard({ item, onEdit, onViewDetail, onLike, onDonate }: CardProps) {
  // ... (Code bên trong giữ nguyên, không cần sửa) ...
  const [liked, setLiked] = useState(false);
  useEffect(() => { setLiked(false); }, [item.id]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) { setLiked(true); onLike(item); }
  };

  return (
    <div className="group relative flex flex-col bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 h-full">
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 z-20 uppercase">{item.category}</div>
      {item.isHot && <div className="absolute top-3 left-12 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm z-20 animate-pulse">HOT</div>}
      
      <button onClick={handleLikeClick} className={`absolute top-3 left-3 z-20 p-2 rounded-full border ${liked ? 'bg-rose-500/10 border-rose-500/50 text-rose-500' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-rose-500'}`}><Heart size={14} fill={liked ? "currentColor" : "none"} /></button>
      
      {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="absolute top-14 left-3 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all"><Edit size={14} /></button>}

      <div className="relative h-44 w-full flex items-center justify-center overflow-hidden bg-[#0f172a] cursor-pointer" onClick={() => onViewDetail(item)}>
        <img src={item.image} alt={item.title} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }} className="relative z-10 h-36 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="flex flex-col p-4 flex-grow bg-[#1e293b]">
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-medium">
          <User size={10} /> <span className="truncate max-w-[150px]">{item.author}</span> <Check size={12} className="text-emerald-500" />
        </div>
        <h3 className="text-white font-bold text-sm leading-snug mb-4 line-clamp-2 cursor-pointer hover:text-amber-400" onClick={() => onViewDetail(item)}>{item.title}</h3>
        <div className="grid grid-cols-2 gap-2 w-full mt-auto">
          <a href={item.downloadLink} target="_blank" rel="noreferrer" className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"><Download size={14} /> TẢI VỀ</a>
          <button onClick={() => onViewDetail(item)} className="col-span-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5"><Info size={14} /> CHI TIẾT</button>
          <button onClick={(e) => {e.stopPropagation(); onDonate(item);}} className="col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5"><Coffee size={14} /> DONATE</button>
        </div>
      </div>
      <div className="bg-[#161f2e] px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-400 font-medium border-t border-slate-700/50">
        <div className="flex gap-3"><span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span><span className="flex items-center gap-1 text-rose-400"><Heart size={12} fill="currentColor" /> {item.likes}</span></div>
        <div className="flex items-center gap-1"><Calendar size={12} /> {item.date}</div>
      </div>
    </div>
  );
}