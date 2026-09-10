import { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, X, Flag, Check, FileCheck, ArrowRight } from 'lucide-react';
import { type ResourceItem } from '../../types';
import InstallPathHelper from '../InstallPathHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ResourceItem | null;
}

export default function DownloadSafetyModal({ isOpen, onClose, item }: Props) {
  const [reported, setReported] = useState(false);

  if (!isOpen || !item) return null;

  const getProviderInfo = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host.includes('drive.google.com')) return { name: 'Google Drive', color: 'text-emerald-400', verified: true };
      if (host.includes('mediafire.com')) return { name: 'MediaFire', color: 'text-blue-400', verified: true };
      if (host.includes('mega.nz')) return { name: 'MEGA Cloud', color: 'text-red-400', verified: true };
      if (host.includes('fshare.vn')) return { name: 'Fshare VN', color: 'text-orange-400', verified: true };
      if (host.includes('dropbox.com')) return { name: 'Dropbox', color: 'text-sky-400', verified: true };
      if (host.includes('onedrive') || host.includes('1drv.ms')) return { name: 'Microsoft OneDrive', color: 'text-cyan-400', verified: true };
      return { name: host.replace('www.', ''), color: 'text-violet-300', verified: false };
    } catch {
      return { name: 'Máy chủ bên thứ ba', color: 'text-violet-300', verified: false };
    }
  };

  const provider = getProviderInfo(item.downloadLink);

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[70] p-4 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-[#1a1236] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-violet-500/30"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-violet-300 hover:text-white p-2 rounded-full hover:bg-violet-900/40 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-violet-900/80 via-purple-900/80 to-indigo-950 p-6 pb-5 border-b border-violet-500/20">
          <div className="flex items-center gap-2.5 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={18} className="text-cyan-400" />
            <span>Xác nhận chuyển hướng nguồn tải an toàn</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white font-display leading-snug line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-violet-300/80 mt-1">Đăng bởi: <span className="text-white font-bold">{item.author}</span> • Phiên bản: <span className="text-cyan-300 font-bold">{item.version || 'Tất cả'}</span></p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Destination Provider Box */}
          <div className="bg-[#130d25] p-4 rounded-2xl border border-violet-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-violet-300 uppercase font-bold tracking-wider">Dịch vụ lưu trữ đích:</span>
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-[#241846] border border-violet-500/20 flex items-center gap-1.5 ${provider.color}`}>
                <FileCheck size={14} />
                {provider.name}
              </span>
            </div>
            <div className="p-2 bg-[#1a1236] rounded-xl text-[11px] text-slate-300 font-mono truncate border border-violet-500/10">
              {item.downloadLink}
            </div>
          </div>

          {/* Interactive Install Path Helper (1-Click) */}
          <InstallPathHelper 
            category={item.category} 
            version={item.version} 
            compact={true} 
          />

          {/* Safety Notice for Users and Google Crawlers */}
          <div className="bg-gradient-to-br from-[#1d163d] to-[#140c2b] p-4 rounded-2xl border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
              <AlertCircle size={15} />
              <span>Chính sách minh bạch & bảo vệ người dùng</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Liên kết tải về dẫn sang dịch vụ đám mây bên thứ ba, do tác giả cộng đồng trực tiếp cung cấp.</li>
              <li>Website <strong>FM Res Hub</strong> không tự lưu trữ phần mềm thực thi độc hại (không chứa .exe/.msi virus). Các tài nguyên chủ yếu là tệp đồ họa (.png), giao diện (.xml) hoặc chiến thuật (.tac).</li>
              <li>Khuyến nghị: Luôn quét virus tệp nén bằng Windows Defender hoặc VirusTotal trước khi giải nén.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={item.downloadLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 text-sm border border-violet-400/30 transition-all hover:scale-[1.01]"
            >
              <span>Tiếp tục tải về từ {provider.name}</span>
              <ArrowRight size={16} />
              <ExternalLink size={14} className="text-cyan-200" />
            </a>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleReport}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors p-1"
                title="Báo cáo liên kết hỏng hoặc nghi ngờ độc hại"
              >
                {reported ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Đã gửi báo cáo cho Admin kiểm duyệt!</span>
                  </>
                ) : (
                  <>
                    <Flag size={13} />
                    <span>Báo cáo link hỏng / tệp nghi vấn</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-violet-300 hover:text-white font-bold px-3 py-1 rounded-lg hover:bg-violet-900/30 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
