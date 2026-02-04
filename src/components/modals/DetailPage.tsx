import { ArrowLeft, Coffee, Download, Eye, Heart, Calendar, Info, ShieldCheck } from 'lucide-react';
import { type ResourceItem } from '../../types';

export default function DetailPage({ item, onClose, onDonate }: { item: ResourceItem | null; onClose: () => void; onDonate: () => void; }) {
  if (!item) return null;

  const defaultInstruction = `<p>Giải nén file và chép vào <code>Documents/Sports Interactive/Football Manager 20xx/</code>.</p><p>Vào game: <strong>Preferences > Reload Skin</strong>.</p>`;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-fade-in">
      {/* Detail Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Quay lại</span>
        </button>
        <div className="flex gap-3">
          <button onClick={onDonate} className="hidden sm:flex bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/50 px-4 py-2 rounded-lg font-bold text-xs items-center gap-2 transition-all">
            <Coffee size={14} /> DONATE
          </button>
          <a href={item.downloadLink} target="_blank" rel="noreferrer" className="bg-primary hover:bg-emerald-400 text-black px-5 py-2 rounded-lg font-bold text-xs shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
            <Download size={16} /> <span className="hidden sm:inline">TẢI NGAY</span>
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Image & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surfaceHighlight">
            <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
          </div>

          <div className="bg-surface/50 rounded-xl border border-white/5 p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Thông tin</h3>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
              <span className="text-zinc-400 flex items-center gap-2"><Eye size={14} /> Lượt xem</span>
              <span className="font-mono font-bold text-white">{item.views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
              <span className="text-zinc-400 flex items-center gap-2"><Heart size={14} /> Yêu thích</span>
              <span className="font-mono font-bold text-rose-500">{item.likes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 flex items-center gap-2"><Calendar size={14} /> Ngày cập nhật</span>
              <span className="font-mono font-bold text-white">{item.date}</span>
            </div>
          </div>

          <div className="bg-blue-500/5 rounded-xl border border-blue-500/20 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Tài nguyên đã được kiểm duyệt. Nếu link hỏng, vui lòng báo cáo cho quản trị viên.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {item.category}
              </span>
              <span className="text-zinc-500 text-sm font-medium">đăng bởi <strong className="text-white ml-1">{item.author}</strong></span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">{item.title}</h1>
          </div>

          {/* Description Content */}
          <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>

          {/* Installation Guide */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg">
              <Info className="text-primary" /> Hướng dẫn cài đặt
            </div>
            <div className="bg-surface/80 rounded-2xl border border-white/10 p-6 shadow-inner">
              <div className="prose prose-sm prose-invert max-w-none text-zinc-300" dangerouslySetInnerHTML={{ __html: item.instructions && item.instructions.trim() !== '' ? item.instructions : defaultInstruction }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}