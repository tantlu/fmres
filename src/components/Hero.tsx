
import { Sparkles, Download, Newspaper, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toSlug } from '../types';

export default function Hero() {
  const navigate = useNavigate();

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
              <span className="tracking-wide">TRUNG TÂM BÀI VIẾT, GUIDE & TÀI NGUYÊN FOOTBALL MANAGER</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-tight leading-[1.1] font-display">
              NÂNG CẤP TRẢI NGHIỆM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300">
                FOOTBALL MANAGER
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
              Cập nhật tin tức & bài viết phân tích chuyên sâu về Football Manager, các cẩm nang hướng dẫn chơi chi tiết cùng kho Facepack, Logo, Kits, Tactics và bản Việt hóa chất lượng cao cho FM26, FM24 và các phiên bản khác.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <button 
                onClick={scrollToContent}
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border border-violet-400/30"
              >
                <Download size={17} className="text-cyan-300" /> KHÁM PHÁ TÀI NGUYÊN
              </button>
              
              <button 
                onClick={() => navigate(`/${toSlug('Bài viết')}`)}
                className="bg-[#241748] hover:bg-violet-900/50 text-cyan-300 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm border border-cyan-500/30 transition-all flex items-center gap-2 hover:scale-105 shadow-md"
              >
                <Newspaper size={17} className="text-cyan-400" /> BÀI VIẾT & TIN TỨC
              </button>

              <button 
                onClick={() => navigate(`/${toSlug('Guide')}`)}
                className="bg-[#281b3d] hover:bg-violet-900/50 text-amber-300 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm border border-amber-500/30 transition-all flex items-center gap-2 hover:scale-105 shadow-md"
              >
                <BookOpen size={17} className="text-amber-400" /> GUIDE CỦA TÔI
              </button>
            </div>
          </div>

          {/* Hero Right: 3 Visual Info Tiles */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            <div 
              onClick={() => navigate(`/${toSlug('Bài viết')}`)}
              className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-cyan-400/40 hover:bg-[#281c4e] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-300 group-hover:scale-110 transition-transform">
                <Newspaper size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display flex items-center gap-2">
                  Bài viết & Thông tin mới
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-500/30">MỚI</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Tin game, phân tích chuyển nhượng, match engine và đánh giá chuyên môn</p>
              </div>
            </div>

            <div 
              onClick={() => navigate(`/${toSlug('Guide')}`)}
              className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-amber-400/40 hover:bg-[#281c4e] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display">Guide & Cẩm nang chơi</h4>
                <p className="text-xs text-slate-400 mt-0.5">Tuyển tập hướng dẫn chi tiết chiến thuật, quản lý tài chính và săn wonderkids</p>
              </div>
            </div>

            <div 
              onClick={scrollToContent}
              className="bg-gradient-to-br from-[#231846]/90 to-[#1b1236]/90 p-4 rounded-2xl border border-violet-500/20 backdrop-blur-md shadow-lg flex items-center gap-4 hover:border-violet-400/40 hover:bg-[#281c4e] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-400/30 flex items-center justify-center shrink-0 text-violet-300 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm font-display">Tài nguyên Mod & Việt Hóa</h4>
                <p className="text-xs text-slate-400 mt-0.5">Facepack, Logo, Bộ Kits mùa giải mới, Tactic bất bại và tiếng Việt</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}