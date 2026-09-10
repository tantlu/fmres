
import { Sparkles, Download, Layers, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function Hero() {
  const scrollToContent = () => {
    const mainSection = document.getElementById('resource-list-section');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-violet-500/20 bg-gradient-to-b from-[#190f33] via-[#150d2c] to-[#110b22]">
      {/* Dynamic Stadium Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-20 left-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Decorative Tactical Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* FM26 Community Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/80 border border-violet-400/30 text-violet-200 text-xs font-bold mb-6 shadow-md backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <Sparkles size={14} className="text-cyan-300" />
              <span className="tracking-wide">HỆ SINH THÁI TÀI NGUYÊN FOOTBALL MANAGER 26</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-tight leading-[1.1] font-display">
              NÂNG CẤP TRẢI NGHIỆM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300">
                FOOTBALL MANAGER
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
              Kho dữ liệu toàn diện với Facepack chất lượng cao, Logo bản quyền, Bộ Kits mùa giải mới nhất, Tactic đỉnh cao và Bản dịch Tiếng Việt chuẩn xác cho FM26, FM25, FM24.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5">
              <button 
                onClick={scrollToContent}
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border border-violet-400/30"
              >
                <Download size={18} className="text-cyan-300" /> KHÁM PHÁ TÀI NGUYÊN
              </button>
              <button 
                onClick={scrollToContent}
                className="bg-[#1e153b] hover:bg-[#281c4e] text-slate-200 px-6 py-3.5 rounded-xl font-bold text-sm border border-violet-500/25 transition-all flex items-center gap-2 hover:text-white"
              >
                <Compass size={18} className="text-violet-400" /> TẤT CẢ DANH MỤC
              </button>
            </div>
          </div>

          {/* Hero Right: 3 Visual Info Tiles (FM26 Cards & Tiles UI) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            <div className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-violet-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-400/30 flex items-center justify-center shrink-0 text-violet-300">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display flex items-center gap-2">
                  Tương thích FM26 & Cũ
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-500/30">MỚI</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Sẵn sàng định dạng đồ họa và database cho FM26 Unity</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-violet-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display">Kiểm duyệt An Toàn</h4>
                <p className="text-xs text-slate-400 mt-0.5">Link tải trực tiếp tốc độ cao, không quảng cáo rác</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-violet-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                <Flame size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display">Cập nhật hàng tuần</h4>
                <p className="text-xs text-slate-400 mt-0.5">Việt hóa, Wonderkids shortlist và chuyển nhượng mới</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}