import { Eye, Heart, Edit, ArrowRight, Coffee, Download, Newspaper, BookOpen } from 'lucide-react';
import { type ResourceItem } from '../types';
import { sanitizeGameVersion, getProviderName } from '../utils';

interface CompactTableProps {
  items: ResourceItem[];
  isAdmin?: boolean;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate?: (item: ResourceItem) => void;
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
    <div className="w-full overflow-x-auto bg-[#180f33]/90 rounded-2xl border border-violet-500/25 shadow-xl backdrop-blur-md">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="border-b border-violet-500/20 bg-[#130a28] text-violet-300 font-bold uppercase text-[11px] tracking-wider font-sans">
            <th className="py-3 px-4">Tài nguyên / Bài viết</th>
            <th className="py-3 px-3 whitespace-nowrap">Phiên bản</th>
            <th className="py-3 px-3 whitespace-nowrap hidden sm:table-cell">Tác giả</th>
            <th className="py-3 px-3 whitespace-nowrap hidden md:table-cell">Lượt xem & Thích</th>
            <th className="py-3 px-3 whitespace-nowrap hidden lg:table-cell">Nguồn lưu trữ</th>
            <th className="py-3 px-4 text-right">Tải / Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-500/15">
          {items.map((item) => {
            const displayVersion = sanitizeGameVersion(item.version);
            const isFm26 = displayVersion === 'FM26';
            const isArticle = item.category === 'Bài viết';
            const isGuide = item.category === 'Guide';
            const hasDownload = Boolean(item.downloadLink && item.downloadLink.trim() !== '');
            const providerName = getProviderName(item.downloadLink);

            return (
              <tr 
                key={item.id || item.title}
                onClick={() => onViewDetail(item)}
                className="hover:bg-violet-900/30 cursor-pointer transition-colors group"
              >
                {/* 1. Item Info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-950 overflow-hidden shrink-0 border border-violet-500/30">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 max-w-[280px] sm:max-w-md">
                      <div className="flex items-center gap-1.5 text-[11px] text-violet-300/70 mb-0.5">
                        <span className="text-cyan-400 font-semibold">{item.category}</span>
                        {item.readTime && (
                          <>
                            <span aria-hidden="true" className="text-violet-500/40">·</span>
                            <span>{item.readTime}</span>
                          </>
                        )}
                        <span className="sm:hidden text-violet-400">
                          · {item.author}
                        </span>
                      </div>
                      <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </td>

                {/* 2. Version */}
                <td className="py-3 px-3 whitespace-nowrap text-xs">
                  {displayVersion ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                      isFm26 
                        ? 'bg-violet-600/30 text-cyan-300 border-cyan-400/40' 
                        : 'bg-violet-950/60 text-violet-300 border-violet-500/30'
                    }`}>
                      {displayVersion}
                    </span>
                  ) : (
                    <span className="text-violet-300/60">Tất cả</span>
                  )}
                </td>

                {/* 3. Author */}
                <td className="py-3 px-3 whitespace-nowrap hidden sm:table-cell text-xs text-violet-300/70">
                  {item.author}
                </td>

                {/* 4. Stats */}
                <td className="py-3 px-3 whitespace-nowrap hidden md:table-cell font-mono text-xs text-violet-300/80 tabular-nums">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-violet-400" />
                      {(item.views || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} className="text-rose-400" />
                      {(item.likes || 0).toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* 5. Provider */}
                <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell text-xs">
                  {isArticle ? (
                    <span className="text-cyan-400 font-semibold text-[11px]">Bài viết</span>
                  ) : isGuide ? (
                    <span className="text-amber-400 font-semibold text-[11px]">Guide FM</span>
                  ) : providerName ? (
                    <span className="text-[11px] font-bold text-violet-300 uppercase px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/20">
                      {providerName}
                    </span>
                  ) : (
                    <span className="text-violet-400/50">Trực tiếp</span>
                  )}
                </td>

                {/* 6. Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {onDonate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDonate(item);
                        }}
                        className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/20 transition-colors"
                        title="Ủng hộ tác giả"
                      >
                        <Coffee size={14} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(item);
                      }}
                      className="p-1.5 rounded-lg text-violet-300 hover:text-rose-400 transition-colors"
                      title="Yêu thích"
                    >
                      <Heart size={14} />
                    </button>

                    {isAdmin && onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        className="p-1.5 rounded-lg text-violet-300 hover:text-cyan-300 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </button>
                    )}

                    {isArticle ? (
                      <span className="text-xs font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 pl-2">
                        <Newspaper size={12} /> Đọc <ArrowRight size={13} />
                      </span>
                    ) : isGuide ? (
                      <span className="text-xs font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 pl-2">
                        <BookOpen size={12} /> Xem <ArrowRight size={13} />
                      </span>
                    ) : hasDownload ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDownload) onDownload(item);
                          else onViewDetail(item);
                        }}
                        className="text-xs font-bold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600 border border-violet-400/30 transition-all inline-flex items-center gap-1"
                      >
                        <Download size={12} /> Tải về
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-violet-300 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 pl-2">
                        Chi tiết <ArrowRight size={13} />
                      </span>
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
