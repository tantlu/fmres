import { X, Coffee, ExternalLink, CreditCard, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { type ResourceItem } from '../../types';

export default function DonateModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: ResourceItem | null; }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  // Kiểm tra xem có thông tin nào không
  const hasBank = item.bankName && item.bankAccount;
  const hasLink = item.donateLink && item.donateLink.trim() !== '';

  const bankId = item.bankName?.trim().toUpperCase();
  const accountNo = item.bankAccount?.trim();
  const accountName = encodeURIComponent(item.bankOwner || '');
  const description = encodeURIComponent(`Donate ${item.author}`);
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=0&addInfo=${description}&accountName=${accountName}`;

  const copyAccount = () => {
    if (item.bankAccount) {
      navigator.clipboard.writeText(item.bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#1c133a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative border border-violet-500/30" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/80 hover:text-white z-20 bg-black/30 hover:bg-black/50 p-1.5 rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-7 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/25 relative z-10 shadow-lg">
            <Coffee size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-white mb-1 relative z-10 font-display">Mời tác giả ly cà phê!</h2>
          <p className="text-white/90 text-xs relative z-10 font-medium">Ủng hộ công sức sáng tạo của: <strong className="text-white font-bold">{item.author}</strong></p>
        </div>

        <div className="p-6 text-center space-y-5 max-h-[65vh] overflow-y-auto">
          
          {/* TRƯỜNG HỢP 1: Có thông tin ngân hàng -> Hiện QR */}
          {hasBank && (
            <>
              <div className="bg-white p-3.5 inline-block rounded-2xl shadow-xl ring-4 ring-violet-500/20">
                <div className="w-44 h-44 flex items-center justify-center mx-auto">
                   <img src={qrUrl} alt="QR Code Donate" className="w-full h-full object-contain rounded-lg" />
                </div>
              </div>
              <p className="text-xs text-violet-300 font-medium">Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã QR</p>

              <div className="space-y-2.5 text-sm text-left">
                <div className="bg-[#140c2b] p-3 rounded-xl flex items-center justify-between border border-violet-500/20">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Ngân hàng</span>
                  <span className="font-bold text-white">{item.bankName}</span>
                </div>
                <div className="bg-[#140c2b] p-3 rounded-xl flex items-center justify-between border border-violet-500/20">
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-300 text-base tracking-wider font-mono">{item.bankAccount}</span>
                    <button 
                      onClick={copyAccount} 
                      className="text-violet-400 hover:text-white p-1 rounded hover:bg-violet-900/50 transition-colors"
                      title="Sao chép số tài khoản"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                {item.bankOwner && (
                  <div className="bg-[#140c2b] p-3 rounded-xl flex items-center justify-between border border-violet-500/20">
                    <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Chủ tài khoản</span>
                    <span className="font-bold text-slate-100">{item.bankOwner}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TRƯỜNG HỢP 2: Có Link Donate */}
          {hasLink && (
            <div className={`${hasBank ? 'pt-5 border-t border-violet-500/20' : ''}`}>
              {hasBank && <p className="text-violet-300 text-xs mb-3 font-semibold uppercase tracking-wider">Hoặc ủng hộ qua cổng quyên góp</p>}
              
              <a 
                href={item.donateLink} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 group border border-violet-400/30 text-xs"
              >
                <ExternalLink size={16} className="group-hover:scale-110 transition-transform text-cyan-300" />
                <span>Mở trang Donate của tác giả</span>
              </a>
            </div>
          )}

          {/* TRƯỜNG HỢP 3: Không có gì cả */}
          {!hasBank && !hasLink && (
            <div className="text-slate-400 py-6">
              <CreditCard size={44} className="mx-auto mb-2 text-violet-400/50" />
              <p className="text-sm">Tác giả chưa cập nhật thông tin Donate cho tài nguyên này.</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-[#261a49] hover:bg-[#322360] text-slate-200 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider border border-violet-500/20"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}