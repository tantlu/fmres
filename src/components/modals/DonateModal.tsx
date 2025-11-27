import { X, Coffee, ExternalLink, CreditCard } from 'lucide-react';
import { type ResourceItem } from '../../types';

export default function DonateModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: ResourceItem | null; }) {
  if (!isOpen || !item) return null;

  // Kiểm tra xem có thông tin nào không
  const hasBank = item.bankName && item.bankAccount;
  const hasLink = item.donateLink && item.donateLink.trim() !== '';

  const bankId = item.bankName?.trim().toUpperCase();
  const accountNo = item.bankAccount?.trim();
  const accountName = encodeURIComponent(item.bankOwner || '');
  const description = encodeURIComponent(`Donate ${item.author}`);
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=0&addInfo=${description}&accountName=${accountName}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"><X size={24} /></button>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20 relative z-10">
            <Coffee size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1 relative z-10">Mời tác giả ly cà phê!</h2>
          <p className="text-white/90 text-xs relative z-10">Ủng hộ trực tiếp cho: <strong className="text-white">{item.author}</strong></p>
        </div>

        <div className="p-6 text-center space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* TRƯỜNG HỢP 1: Có thông tin ngân hàng -> Hiện QR */}
          {hasBank && (
            <>
              <div className="bg-white p-4 inline-block rounded-xl shadow-inner">
                <div className="w-40 h-40 flex items-center justify-center mx-auto">
                   <img src={qrUrl} alt="QR Code Donate" className="w-full h-full object-contain" />
                </div>
              </div>
              <p className="text-xs text-slate-400 -mt-2">Quét mã QR để chuyển khoản nhanh</p>

              <div className="space-y-3 text-sm">
                <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
                  <span className="text-xs font-bold text-slate-500 uppercase">Ngân hàng</span>
                  <span className="font-bold text-slate-200">{item.bankName}</span>
                </div>
                <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
                  <span className="text-xs font-bold text-slate-500 uppercase">Số tài khoản</span>
                  <span className="font-bold text-emerald-400 text-lg tracking-wider font-mono">{item.bankAccount}</span>
                </div>
                {item.bankOwner && (
                  <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
                    <span className="text-xs font-bold text-slate-500 uppercase">Chủ tài khoản</span>
                    <span className="font-bold text-slate-200">{item.bankOwner}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TRƯỜNG HỢP 2: Có Link Donate (PlayerDuo, Wescan...) */}
          {hasLink && (
            <div className={`${hasBank ? 'pt-6 border-t border-slate-700' : ''}`}>
              {hasBank && <p className="text-slate-400 text-xs mb-3 font-medium uppercase tracking-wider">Hoặc qua đường dẫn</p>}
              
              <a 
                href={item.donateLink} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group"
              >
                <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                <span>Truy cập Link Donate (PlayerDuo/Wescan...)</span>
              </a>
              <p className="text-[10px] text-slate-500 mt-2">Link sẽ mở trong tab mới</p>
            </div>
          )}

          {/* TRƯỜNG HỢP 3: Không có gì cả */}
          {!hasBank && !hasLink && (
            <div className="text-slate-400 py-4">
              <CreditCard size={48} className="mx-auto mb-2 opacity-20" />
              <p>Tác giả chưa cập nhật thông tin Donate.</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-lg transition-colors text-xs uppercase tracking-wider"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}