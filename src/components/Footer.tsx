import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onOpenPolicy?: () => void;
}

export default function Footer({ onOpenPolicy }: FooterProps) {
  return (
    <footer className="bg-[#0b0619] text-violet-300/70 py-10 border-t border-violet-500/20 text-xs">
      <div className="container mx-auto px-4 text-center max-w-4xl space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-display font-black text-xs shadow-md shadow-violet-700/30">
            FM
          </div>
          <span className="font-display font-black text-sm tracking-tight text-white">
            FM RES HUB <span className="text-cyan-400">26</span>
          </span>
        </div>

        <p className="text-violet-300/60 text-xs max-w-lg mx-auto leading-relaxed">
          Nền tảng chia sẻ bài viết, tin tức chuyên sâu, cẩm nang guide chiến thuật, database cầu thủ và tài nguyên mod phi thương mại dành cho cộng đồng Football Manager Việt Nam.
        </p>

        {/* Policy & Security Links */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-violet-300/70 pt-2">
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck size={13} className="text-cyan-400" />
            <span>Chính sách an toàn & Bản quyền</span>
          </button>
          <span className="text-violet-500/30 hidden sm:inline">·</span>
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            <FileText size={13} className="text-violet-400" />
            <span>Miễn trừ trách nhiệm</span>
          </button>
          <span className="text-violet-500/30 hidden sm:inline">·</span>
          <button 
            type="button"
            onClick={onOpenPolicy}
            className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle size={13} className="text-amber-400" />
            <span>Báo cáo nội dung</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-5 text-xs text-violet-400/60 pt-2 border-t border-violet-500/15">
          <a href="https://www.facebook.com/groups/fmvnofficial" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            Facebook Group
          </a>
          <span className="text-violet-500/30">·</span>
          <a href="https://www.youtube.com/@tenfm3024" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            YouTube
          </a>
          <span className="text-violet-500/30">·</span>
          <a href="https://www.facebook.com/tanlan.2001/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            Liên hệ Quản trị viên
          </a>
        </div>
      </div>
    </footer>
  );
}
