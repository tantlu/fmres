import { useState } from 'react';
import { ArrowLeft, Coffee, Download, Eye, Heart, Calendar, Info, ShieldCheck, Sparkles, User, Newspaper, Clock, Share2, Check } from 'lucide-react';
import { type ResourceItem } from '../../types';
import DownloadSafetyModal from './DownloadSafetyModal';
import InstallPathHelper from '../InstallPathHelper';
import { getProviderName, sanitizeGameVersion } from '../../utils';

export default function DetailPage({ item, onClose, onDonate }: { item: ResourceItem | null; onClose: () => void; onDonate: () => void; }) {
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!item) return null;

  const displayVersion = sanitizeGameVersion(item.version);
  const isFm26 = displayVersion === 'FM26';
  const hasDownload = Boolean(item.downloadLink && item.downloadLink.trim() !== '' && item.downloadLink !== '#');
  const providerName = getProviderName(item.downloadLink);

  const isArticle = item.category === 'Bài viết';
  const isGuide = item.category === 'Guide';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#110b22] overflow-y-auto">
      {/* Stadium Ambient Background Glows */}
      <div className="fixed -top-40 left-1/3 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed top-1/2 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Detail Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#130d25]/90 backdrop-blur-xl border-b border-violet-500/20 px-4 sm:px-8 h-16 flex items-center justify-between shadow-lg shadow-black/20">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 text-violet-300 hover:text-white transition-all group bg-[#1c1439] hover:bg-violet-900/40 px-3.5 py-1.5 rounded-xl border border-violet-500/20"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-cyan-300" />
          <span className="font-bold text-xs">Quay lại</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-[#1c1439] hover:bg-violet-900/40 text-violet-300 hover:text-white px-3.5 py-2 rounded-xl font-bold text-xs border border-violet-500/20 transition-all"
            title="Sao chép liên kết chia sẻ"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{isCopied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
          </button>

          <button 
            onClick={onDonate} 
            className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 hover:border-amber-400 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm"
          >
            <Coffee size={15} /> <span className="hidden sm:inline">ỦNG HỘ TÁC GIẢ</span><span className="sm:hidden">Ủng hộ</span>
          </button>

          {hasDownload && (
            <button 
              type="button"
              onClick={() => setShowSafetyModal(true)}
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 sm:px-5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all hover:-translate-y-0.5 border border-violet-400/30 cursor-pointer"
              title={`Tải về từ ${providerName}`}
            >
              <Download size={15} className="text-cyan-300" /> 
              <span>TẢI TỪ {providerName.toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GIAO DIỆN BÀI VIẾT (EDITORIAL ARTICLE VIEW - DÀNH CHO BÀI VIẾT & TIN TỨC) */}
      {/* ========================================================================= */}
      {isArticle ? (
        <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl relative z-10 space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Newspaper size={13} className="text-cyan-200" /> BÀI VIẾT FM
              </span>
              {displayVersion && (
                <span className="bg-[#1e153d] text-cyan-300 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-extrabold">
                  {displayVersion}
                </span>
              )}
              {item.tags?.map(t => (
                <span key={t} className="bg-[#241746] text-violet-200 text-xs px-2.5 py-0.5 rounded-md border border-violet-500/20 font-medium">
                  #{t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight font-display tracking-tight">
              {item.title}
            </h1>

            {/* Author info & metrics bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-violet-500/20 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 border border-violet-400/40 flex items-center justify-center text-white font-bold font-display shadow-md">
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{item.author}</span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/30">Tác giả</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-300"><Clock size={11} /> {item.readTime || '4 phút đọc'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1.5 bg-[#170e30] px-3 py-1 rounded-lg border border-violet-500/20">
                  <Eye size={13} className="text-violet-400" /> {item.views.toLocaleString()} lượt xem
                </span>
                <span className="flex items-center gap-1.5 bg-[#170e30] px-3 py-1 rounded-lg border border-violet-500/20 text-rose-400 font-semibold">
                  <Heart size={13} fill="currentColor" /> {item.likes} thích
                </span>
              </div>
            </div>
          </div>

          {/* Lead Summary Excerpt (Nếu có) */}
          {item.summary && (
            <div className="bg-gradient-to-r from-[#211648] via-[#1a1139] to-[#160d2e] p-5 md:p-6 rounded-2xl border-l-4 border-l-cyan-400 border border-violet-500/25 shadow-lg">
              <p className="text-sm md:text-base font-semibold text-cyan-200 leading-relaxed italic">
                "{item.summary}"
              </p>
            </div>
          )}

          {/* Featured Hero Image */}
          <div className="rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl bg-[#1e153c]">
            <img 
              src={item.image} 
              alt={item.title} 
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600/1e153c/a78bfa?text=Football+Manager+Article'; }}
              className="w-full h-auto max-h-[500px] object-cover" 
            />
          </div>

          {/* Main Article Body */}
          <div className="bg-[#1c1439]/90 rounded-3xl border border-violet-500/20 p-6 sm:p-10 shadow-xl backdrop-blur-md">
            <div className="prose prose-invert prose-violet prose-lg max-w-none text-slate-200 leading-relaxed font-sans">
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          </div>

          {/* Ghi chú thêm / Nguồn bài viết */}
          {item.instructions && item.instructions.trim() !== '' && (
            <div className="bg-[#170e30] rounded-2xl border border-violet-500/25 p-5 sm:p-6 space-y-3">
              <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-2 font-display">
                <Info size={15} /> Ghi chú & Nguồn tham khảo
              </h4>
              <div 
                className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: item.instructions }} 
              />
            </div>
          )}

          {/* File đính kèm nếu có */}
          {hasDownload && (
            <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/40 to-indigo-900/40 rounded-2xl border border-violet-400/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h4 className="text-white font-bold font-display text-base flex items-center gap-2">
                  <Download size={18} className="text-cyan-300" /> Tài liệu / File đính kèm bài viết
                </h4>
                <p className="text-xs text-violet-200/80 mt-0.5">Tải file tài liệu, tactic hoặc database đính kèm theo bài viết này</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowSafetyModal(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 border border-violet-400/30 whitespace-nowrap cursor-pointer"
              >
                <Download size={16} className="text-cyan-300" /> Tải từ {providerName}
              </button>
            </div>
          )}

          {/* Author Bio & Donation Box */}
          <div className="bg-gradient-to-br from-[#231846] to-[#191033] rounded-3xl border border-violet-500/25 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-violet-400/40 flex items-center justify-center text-white font-black text-xl font-display shadow-lg shrink-0 mx-auto sm:mx-0">
                {item.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-white font-bold text-base font-display">Tác giả: {item.author}</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Cảm ơn bạn đã đọc bài viết! Nếu nội dung hữu ích, hãy ủng hộ một ly cafe để tác giả có thêm động lực cập nhật thêm nhiều thông tin và tài nguyên bổ ích cho cộng đồng.
                </p>
              </div>
            </div>
            <button 
              onClick={onDonate} 
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 hover:scale-105"
            >
              <Coffee size={16} /> <span>ỦNG HỘ TÁC GIẢ</span>
            </button>
          </div>
        </article>
      ) : (
        /* ========================================================================= */
        /* GIAO DIỆN TÀI NGUYÊN / GUIDE (FACEPACK, LOGO, KITS, TACTICS, CẨM NANG)     */
        /* ========================================================================= */
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Image & Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl bg-[#1e153c]">
              <img 
                src={item.image} 
                alt={item.title} 
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1e153c/a78bfa?text=FM26+Resource'; }}
                className="w-full h-auto object-cover" 
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase bg-[#130d25]/90 backdrop-blur-md text-violet-200 rounded-lg border border-violet-400/30 shadow-sm">
                  {item.category}
                </span>
                {displayVersion && (
                  isFm26 ? (
                    <span className="px-2.5 py-1 text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg shadow-md border border-cyan-400/30 flex items-center gap-1">
                      <Sparkles size={12} className="text-cyan-200" /> FM26
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-extrabold bg-[#130d25]/90 backdrop-blur-md text-cyan-300 rounded-lg shadow-md border border-cyan-500/30">
                      {displayVersion}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-[#1c1439]/90 rounded-2xl border border-violet-500/20 p-5 space-y-3.5 backdrop-blur-md shadow-lg">
              <h3 className="text-xs font-extrabold text-violet-300 uppercase tracking-wider font-display">
                {isGuide ? 'Thông tin Guide' : 'Thông số tài nguyên'}
              </h3>
              
              {displayVersion && (
                <div className="flex justify-between items-center text-sm border-b border-violet-500/15 pb-2.5">
                  <span className="text-slate-400 flex items-center gap-2"><Sparkles size={15} className="text-cyan-400" /> Phiên bản</span>
                  <span className="font-bold text-cyan-300">{displayVersion}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm border-b border-violet-500/15 pb-2.5">
                <span className="text-slate-400 flex items-center gap-2"><Eye size={15} className="text-violet-400" /> Lượt xem</span>
                <span className="font-mono font-bold text-white">{item.views.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm border-b border-violet-500/15 pb-2.5">
                <span className="text-slate-400 flex items-center gap-2"><Heart size={15} className="text-rose-400" /> Yêu thích</span>
                <span className="font-mono font-bold text-rose-400">{item.likes.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm border-b border-violet-500/15 pb-2.5">
                <span className="text-slate-400 flex items-center gap-2"><Calendar size={15} className="text-violet-400" /> Cập nhật</span>
                <span className="font-mono font-bold text-slate-200">{item.date}</span>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-slate-400 flex items-center gap-2"><User size={15} className="text-cyan-400" /> Tác giả</span>
                <span className="font-bold text-cyan-300">{item.author}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1d163d] to-[#160f2e] rounded-2xl border border-violet-500/20 p-4 shadow-md">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-cyan-400 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tài nguyên đã được kiểm tra tính tương thích và an toàn. Nếu phát hiện liên kết hỏng, vui lòng liên hệ admin để cập nhật.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#1c1439]/90 rounded-2xl border border-violet-500/20 p-6 md:p-8 backdrop-blur-md shadow-lg">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="bg-violet-950/80 text-violet-200 border border-violet-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                {item.version && item.version !== 'All' && (
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-extrabold border border-violet-400/30">
                    {item.version}
                  </span>
                )}
                {item.tags?.map(t => (
                  <span key={t} className="bg-[#261b4a] text-slate-300 text-xs px-2.5 py-0.5 rounded-md border border-violet-500/20 font-medium">
                    #{t}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-6 font-display">
                {item.title}
              </h1>

              {/* Description Content */}
              <div className="prose prose-invert prose-violet max-w-none text-slate-200 text-sm md:text-base leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
            </div>

            {/* Installation Guide: Chỉ hiện khi KHÔNG PHẢI bài viết thông thường */}
            <div className="bg-[#1c1439]/90 rounded-2xl border border-violet-500/20 p-6 md:p-8 backdrop-blur-md shadow-lg space-y-5">
              <div className="flex items-center gap-2.5 text-white font-bold text-lg font-display">
                <div className="p-1.5 bg-violet-600/20 rounded-lg text-cyan-300 border border-violet-400/30">
                  <Info size={18} />
                </div>
                <span>{isGuide ? 'Chi tiết hướng dẫn & Thư mục liên quan' : 'Hướng dẫn cài đặt & Đường dẫn thư mục'}</span>
              </div>
              
              {/* Interactive Path Helper Widget */}
              <InstallPathHelper category={item.category} version={item.version} />

              {item.instructions && item.instructions.trim() !== '' && (
                <div className="bg-[#150d2c] rounded-xl border border-violet-500/20 p-5 shadow-inner">
                  <div 
                    className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed font-sans" 
                    dangerouslySetInnerHTML={{ __html: item.instructions }} 
                  />
                </div>
              )}
            </div>

            {/* Direct Download Call to Action Bar */}
            {hasDownload && (
              <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/40 to-indigo-900/40 rounded-2xl border border-violet-400/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h4 className="text-white font-bold font-display text-base">Sẵn sàng trải nghiệm?</h4>
                  <p className="text-xs text-violet-200/80 mt-0.5">Tải trực tiếp tốc độ cao và ủng hộ tác giả cộng đồng</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={onDonate} 
                    className="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold px-4 py-3 rounded-xl text-xs border border-amber-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Coffee size={15} /> Ủng hộ
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowSafetyModal(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 border border-violet-400/30 whitespace-nowrap cursor-pointer"
                    title={`Tải về từ ${providerName}`}
                  >
                    <Download size={16} className="text-cyan-300" /> Tải từ {providerName}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Safety Interstitial Download Modal */}
      {hasDownload && (
        <DownloadSafetyModal 
          isOpen={showSafetyModal} 
          onClose={() => setShowSafetyModal(false)} 
          item={item} 
        />
      )}
    </div>
  );
}