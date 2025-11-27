import { ArrowLeft, Coffee, Download, Info, Eye, Heart, User, Check } from 'lucide-react'; // Xóa React
import { type ResourceItem } from '../../types'; // Thêm type

export default function DetailPage({ item, onClose, onDonate }: { item: ResourceItem | null; onClose: () => void; onDonate: () => void; }) {
  if (!item) return null;
  // ... Code render bên dưới giữ nguyên ...
  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="sticky top-0 z-10 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between shadow-lg">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold text-sm"><ArrowLeft size={18} /> Quay lại</button>
        <button onClick={onDonate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs shadow-md flex items-center gap-2"><Coffee size={14} /> DONATE</button>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e293b] p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <img src={item.image} alt={item.title} className="w-full h-auto rounded-xl" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }} />
          </div>
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-5 space-y-4 text-sm text-slate-400">
             <div className="flex justify-between border-b border-slate-700 pb-3"><span>Lượt xem</span> <span className="text-white"><Eye size={14} className="inline text-sky-500"/> {item.views}</span></div>
             <div className="flex justify-between border-b border-slate-700 pb-3"><span>Yêu thích</span> <span className="text-white"><Heart size={14} className="inline text-rose-500"/> {item.likes}</span></div>
             <div className="flex justify-between"><span>Ngày đăng</span> <span className="text-white">{item.date}</span></div>
          </div>
          <a href={item.downloadLink} target="_blank" rel="noreferrer" className="w-full block bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"><Download size={24} /> TẢI NGAY</a>
        </div>
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-700 p-8">
           <div className="flex items-center gap-3 mb-4">
             <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">{item.category}</span>
             <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-full"><User size={14} /> <span>{item.author}</span> <Check size={14} className="text-emerald-500"/></div>
           </div>
           <h1 className="text-3xl font-black text-white mb-8">{item.title}</h1>
           <div className="prose prose-invert prose-lg max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: item.description }} />
           <div className="mt-12 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl flex gap-3 text-sm text-blue-200/80"><Info className="text-blue-400 shrink-0" /> <p>Hướng dẫn: Tải về, giải nén vào thư mục Documents/Sports Interactive/Football Manager [version]/</p></div>
        </div>
      </div>
    </div>
  );
}