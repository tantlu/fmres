import { Eye, Heart, Download, Coffee, Edit, Sparkles, ShieldCheck } from 'lucide-react';
import { type ResourceItem } from '../types';
import { getProviderName, sanitizeGameVersion } from '../utils';

interface CompactTableProps {
  items: ResourceItem[];
  isAdmin: boolean;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
  onDownload?: (item: ResourceItem) => void;
  onEdit?: (item: ResourceItem) => void;
}

export default function CompactTableView({
  items,
  isAdmin,
  onViewDetail,
  onLike,
  onDonate,
  onDownload,
  onEdit,
}: CompactTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-[#170e30]/90 rounded-2xl border border-violet-500/25 shadow-xl backdrop-blur-md">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="border-b border-violet-500/20 bg-[#1e133d] text-violet-300 font-extrabold uppercase text-[11px] tracking-wider font-display">
            <th className="py-3.5 px-4">Tài nguyên</th>
            <th className="py-3.5 px-3 whitespace-nowrap">Phiên bản</th>
            <th className="py-3.5 px-3 whitespace-nowrap hidden sm:table-cell">Tác giả</th>
            <th className="py-3.5 px-3 whitespace-nowrap hidden md:table-cell">Thống kê</th>
            <th className="py-3.5 px-3 whitespace-nowrap hidden lg:table-cell">Nguồn lưu trữ</th>
            <th className="py-3.5 px-4 text-right">Tải / Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-500/10">
          {items.map((item) => {
            const displayVersion = sanitizeGameVersion(item.version);
            const isFm26 = displayVersion === 'FM26';
            const provider = getProviderName(item.downloadLink);

            return (
              <tr 
                key={item.id || item.title}
                onClick={() => onViewDetail(item)}
                className="hover:bg-violet-950/40 cursor-pointer transition-colors group"
              >
                {/* 1. Item Info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-violet-950 overflow-hidden shrink-0 border border-violet-500/30 group-hover:border-violet-400 transition-colors">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/1e153c/a78bfa?text=FM'; }}
                      />
                    </div>
                    <div className="min-w-0 max-w-[280px] sm:max-w-md">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#120a24] text-violet-300 border border-violet-500/20">
                          {item.category}
                        </span>
                        {item.isHot && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500 text-black">
                            HOT
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 sm:hidden">
                          • {item.author}
                        </span>
                      </div>
                      <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate font-display">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </td>

                {/* 2. Version */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {displayVersion ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-lg ${
                      isFm26 
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm border border-cyan-300/40' 
                        : 'bg-[#1e1338] text-cyan-300 border border-violet-500/30'
                    }`}>
                      {isFm26 && <Sparkles size={11} className="text-cyan-200" />}
                      {displayVersion}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">-</span>
                  )}
                </td>

                {/* 3. Author & Date */}
                <td className="py-3 px-3 whitespace-nowrap hidden sm:table-cell">
                  <div className="font-semibold text-slate-200">{item.author}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.date}</div>
                </td>

                {/* 4. Views & Likes */}
                <td className="py-3 px-3 whitespace-nowrap hidden md:table-cell">
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                    <span className="flex items-center gap-1"><Eye size={13} className="text-violet-400" /> {item.views.toLocaleString()}</span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onLike(item); }}
                      className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Yêu thích"
                    >
                      <Heart size={13} fill="currentColor" /> {item.likes}
                    </button>
                  </div>
                </td>

                {/* 5. Storage Provider */}
                <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#140b28] border border-violet-500/20 text-slate-300 font-medium text-xs">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    {provider}
                  </span>
                </td>

                {/* 6. Action Buttons */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {onDownload ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDownload(item); }}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/20 border border-violet-400/30 transition-all hover:scale-105"
                        title={`Tải về từ ${provider}`}
                      >
                        <Download size={13} className="text-cyan-200" />
                        <span className="hidden sm:inline">Tải về</span>
                      </button>
                    ) : (
                      <a
                        href={item.downloadLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/20 border border-violet-400/30 transition-all hover:scale-105"
                      >
                        <Download size={13} className="text-cyan-200" />
                        <span className="hidden sm:inline">Tải về</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDonate(item); }}
                      className="p-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 transition-all"
                      title="Ủng hộ tác giả"
                    >
                      <Coffee size={14} />
                    </button>

                    {isAdmin && onEdit && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 transition-all"
                        title="Chỉnh sửa (Admin)"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
