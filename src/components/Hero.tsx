
import { Star, Download, Info } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-[#0f172a] border-b border-slate-800 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center md:text-left">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-[10px] font-bold mb-6 uppercase tracking-widest">
            <Star size={12} className="fill-emerald-400" /> Top 1 Cộng đồng FM Việt Nam
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            KHO TÀI NGUYÊN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">FOOTBALL MANAGER</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed font-light mx-auto md:mx-0">
            Tổng hợp tất cả tài nguyên Facepack, Logo, Kits, Guide và Việt Hóa chất lượng cao nhất. Cập nhật liên tục, tải xuống tốc độ cao.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-1 flex items-center gap-2">
              <Download size={18} /> TẢI MỚI NHẤT
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold text-sm border border-slate-700 transition-all flex items-center gap-2">
              <Info size={18} /> HƯỚNG DẪN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}