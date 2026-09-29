import { useState } from 'react';
import { ArrowLeft, Coffee, Download, Eye, Heart, Calendar, Clock, Share2, Check } from 'lucide-react';
import { type ResourceItem } from '../../types';
import DownloadSafetyModal from './DownloadSafetyModal';
import InstallPathHelper from '../InstallPathHelper';
import { getProviderName, sanitizeGameVersion } from '../../utils';

interface DetailPageProps {
  item: ResourceItem | null;
  onClose: () => void;
  onDonate: () => void;
}

export default function DetailPage({ item, onClose, onDonate }: DetailPageProps) {
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!item) return null;

  const displayVersion = sanitizeGameVersion(item.version);
  const hasDownload = Boolean(item.downloadLink && item.downloadLink.trim() !== '' && item.downloadLink !== '#');
  const providerName = getProviderName(item.downloadLink);
  const isArticle = item.category === 'Bài viết';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d071d] text-slate-100 overflow-y-auto">
      {/* Top Reading Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-[#130b28]/95 backdrop-blur-xl border-b border-violet-500/20 px-4 sm:px-8 h-14 flex items-center justify-between shadow-md">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 text-violet-200 hover:text-white transition-colors text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-[#1c123d] hover:bg-violet-900/40 border border-violet-500/20"
        >
          <ArrowLeft size={16} className="text-cyan-400" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-violet-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-violet-500/25 bg-[#180f33] hover:bg-violet-900/40 transition-colors"
            title="Sao chép liên kết bài viết"
          >
            {isCopied ? <Check size={14} className="text-cyan-400" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{isCopied ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>

          {/* Like */}
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              liked
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'text-violet-200 hover:text-white border-violet-500/25 bg-[#180f33] hover:bg-violet-900/40'
            }`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{liked ? 'Đã thích' : 'Yêu thích'}</span>
          </button>

          {/* Donate */}
          <button 
            onClick={onDonate} 
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors font-semibold"
          >
            <Coffee size={14} />
            <span className="hidden sm:inline">Ủng hộ tác giả</span>
          </button>

          {/* Optional Download */}
          {hasDownload && (
            <button 
              type="button"
              onClick={() => setShowSafetyModal(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/30 border border-violet-400/30"
              title={`Tải file từ ${providerName}`}
            >
              <Download size={14} className="text-cyan-300" />
              <span>Tải từ {providerName}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Reading Canvas */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <article className="space-y-6">
          
          {/* Header Metadata */}
          <div className="space-y-3">
            {/* Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs text-violet-300/70 font-medium">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">{item.category}</span>
              <span aria-hidden="true" className="text-violet-500/40">·</span>
              <span className="text-violet-200">{displayVersion || 'Tất cả phiên bản'}</span>
              {item.readTime && (
                <>
                  <span aria-hidden="true" className="text-violet-500/40">·</span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Clock size={12} /> {item.readTime}
                  </span>
                </>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight">
              {item.title}
            </h1>

            {/* Deck / Summary Box */}
            {item.summary && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#191035] border-l-4 border-cyan-400 border border-violet-500/20 text-violet-100 text-sm sm:text-base leading-relaxed shadow-md">
                {item.summary}
              </div>
            )}

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-2 pb-4 border-b border-violet-500/20 text-xs text-violet-300/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-900/60 border border-violet-500/30 flex items-center justify-center text-cyan-300 font-black text-xs">
                  {item.author ? item.author.charAt(0) : 'F'}
                </div>
                <div>
                  <div className="font-bold text-white">{item.author}</div>
                  <div className="text-[11px] text-violet-400">Cộng đồng Football Manager VN</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-cyan-400" /> {item.date}
                </span>
                {item.views !== undefined && item.views > 0 && (
                  <span className="flex items-center gap-1 font-mono tabular-nums text-violet-300">
                    <Eye size={13} /> {item.views.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {item.image && (
            <div className="rounded-2xl overflow-hidden border border-violet-500/30 bg-[#120a26] aspect-[16/9] relative shadow-xl">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', 'from-violet-950', 'to-slate-950');
                  }
                }}
              />
            </div>
          )}

          {/* Article Body Content */}
          <div className="pt-2">
            {item.description ? (
              <div 
                className="prose prose-invert prose-violet max-w-none text-violet-100 text-base leading-relaxed space-y-4 article-drop-cap [&>h2]:text-xl [&>h2]:font-bold [&>h2]:font-display [&>h2]:text-white [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-violet-500/20 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-white [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-400 [&>blockquote]:bg-[#170e30] [&>blockquote]:p-4 [&>blockquote]:rounded-r-xl [&>blockquote]:italic [&>blockquote]:text-violet-200 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            ) : (
              <p className="text-violet-300/60 italic">Đang cập nhật nội dung chi tiết...</p>
            )}
          </div>

          {/* Instructions or Source Notes */}
          {item.instructions && (
            <div className="p-4 rounded-xl bg-[#191035] border border-violet-500/20 text-xs text-violet-200 space-y-1 mt-6">
              <div className="font-bold text-cyan-300">Ghi chú & Hướng dẫn:</div>
              <p className="whitespace-pre-line leading-relaxed">{item.instructions}</p>
            </div>
          )}

          {/* Install Path Helper if needed */}
          {!isArticle && (
            <div className="mt-4">
              <InstallPathHelper category={item.category} />
            </div>
          )}

          {/* Download Box if file exists */}
          {hasDownload && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#1b103b] to-[#140b2b] border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="font-black text-white text-sm">Tài nguyên đính kèm bài viết</div>
                <div className="text-xs text-violet-300/80 mt-0.5">
                  Lưu trữ trên máy chủ an toàn ({providerName}). Đã kiểm duyệt mã độc.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSafetyModal(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap shadow-lg shadow-violet-600/30 border border-violet-400/30"
              >
                <Download size={14} className="text-cyan-300" />
                <span>Tải ngay ({providerName})</span>
              </button>
            </div>
          )}

          {/* Tags list */}
          {item.tags && item.tags.length > 0 && (
            <div className="pt-4 border-t border-violet-500/20 flex items-center gap-2 flex-wrap text-xs text-violet-300/70">
              <span className="font-semibold text-white">Chủ đề:</span>
              {item.tags.map((tag) => (
                <span key={tag} className="bg-[#180f33] text-violet-200 border border-violet-500/20 px-2.5 py-0.5 rounded-md text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Support Card */}
          <div className="p-5 rounded-2xl bg-[#180f33] border border-violet-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 shadow-md">
            <div>
              <div className="font-bold text-white text-sm">Thấy bài viết hữu ích?</div>
              <div className="text-xs text-violet-300/70 mt-0.5">
                Ủng hộ tác giả {item.author} một tách cà phê để duy trì các bài viết và bản dịch chất lượng cho cộng đồng FMVN.
              </div>
            </div>
            <button
              onClick={onDonate}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md"
            >
              <Coffee size={15} />
              <span>Ủng hộ tác giả</span>
            </button>
          </div>

          {/* Back button at the bottom */}
          <div className="text-center pt-8">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 hover:text-white px-4 py-2 rounded-xl border border-violet-500/30 hover:bg-violet-900/40 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Quay lại trang danh sách bài viết</span>
            </button>
          </div>

        </article>
      </main>

      {/* Download Safety Modal */}
      {showSafetyModal && (
        <DownloadSafetyModal 
          isOpen={showSafetyModal} 
          onClose={() => setShowSafetyModal(false)} 
          item={item} 
        />
      )}
    </div>
  );
}
