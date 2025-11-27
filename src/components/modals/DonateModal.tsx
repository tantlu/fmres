import { X, Coffee } from 'lucide-react'; // Xóa React
import { type ResourceItem } from '../../types'; // Thêm type

export default function DonateModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: ResourceItem | null; }) {
  // ... Code bên trong giữ nguyên ...
  if (!isOpen || !item) return null;
  const qrUrl = `https://img.vietqr.io/image/${item.bankName}-${item.bankAccount}-compact2.png?amount=0&addInfo=${encodeURIComponent(`Donate ${item.author}`)}&accountName=${encodeURIComponent(item.bankOwner||'')}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20"><Coffee size={32} className="text-white" /></div>
          <h2 className="text-xl font-bold text-white">Mời tác giả ly cà phê!</h2>
          <p className="text-white/90 text-xs mt-1">Ủng hộ cho: <strong>{item.author}</strong></p>
        </div>
        <div className="p-6 text-center space-y-6">
          <div className="bg-white p-4 inline-block rounded-xl shadow-inner"><img src={qrUrl} alt="QR Code" className="w-40 h-40 object-contain" /></div>
          <div className="space-y-3 text-sm">
            <div className="bg-[#0f172a] p-3 rounded-lg flex justify-between border border-slate-700"><span className="text-xs font-bold text-slate-500 uppercase">Ngân hàng</span><span className="font-bold text-slate-200">{item.bankName}</span></div>
            <div className="bg-[#0f172a] p-3 rounded-lg flex justify-between border border-slate-700"><span className="text-xs font-bold text-slate-500 uppercase">Số tài khoản</span><span className="font-bold text-emerald-400 text-lg font-mono">{item.bankAccount}</span></div>
            <div className="bg-[#0f172a] p-3 rounded-lg flex justify-between border border-slate-700"><span className="text-xs font-bold text-slate-500 uppercase">Chủ TK</span><span className="font-bold text-slate-200">{item.bankOwner}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}