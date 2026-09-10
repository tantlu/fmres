import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onOpenPolicy?: () => void;
}

export default function Footer({ onOpenPolicy }: FooterProps) {
  return (
    <footer className="bg-[#0b0617] text-slate-400 py-12 border-t border-violet-500/20 text-sm relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
        <div className="inline-flex p-1 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-500 to-cyan-400 mb-4 shadow-lg shadow-violet-900/40">
          <img 
            src="https://yt3.ggpht.com/83WfPjeUQMeiK56shkZPb4opoo8vqdP9PpSpf92ayYAUIEocv8GbRvze_tjZumiBAsK0sVWVUQ=s600-c-k-c0x00ffffff-no-rj-rp-mo" 
            alt="Logo" 
            className="w-10 h-10 md:w-12 md:h-12 bg-[#170e2e] rounded-xl block object-cover" 
          />
        </div>
        <p className="mb-2 font-black text-white tracking-wider font-display text-base">
          FM RESOURCE HUB <span className="text-cyan-400">26</span>
        </p>
        <p className="text-xs max-w-lg mx-auto leading-relaxed text-violet-300/70 mb-6">
          Dự án phi thương mại vì cộng đồng Football Manager Việt Nam. Không chứa mã độc, không thu thập dữ liệu cá nhân hay mật khẩu người dùng.
        </p>

        {/* Security & Legal Bar */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs font-semibold text-violet-300 mb-6 py-2.5 px-4 bg-[#140c2b] rounded-2xl border border-violet-500/20 max-w-2xl mx-auto">
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Cam kết an toàn & Chống mã độc</span>
          </button>
          <span className="text-violet-500/30 hidden sm:inline">•</span>
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} className="text-violet-400" />
            <span>Miễn trừ trách nhiệm & Bản quyền</span>
          </button>
          <span className="text-violet-500/30 hidden sm:inline">•</span>
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-rose-300 transition-colors flex items-center gap-1.5 text-slate-400 hover:text-rose-400"
          >
            <AlertTriangle size={14} className="text-amber-400" />
            <span>Báo cáo DMCA / Link xấu</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-wider text-slate-400">
          <a href="https://www.facebook.com/groups/fmvnofficial" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            FACEBOOK GROUP
          </a>
          <span className="text-violet-500/40">•</span>
          <a href="https://www.youtube.com/@tenfm3024" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            YOUTUBE
          </a>
          <span className="text-violet-500/40">•</span>
          <a href="https://www.facebook.com/tanlan.2001/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            CONTACT ADMIN
          </a>
        </div>
      </div>
    </footer>
  );
}