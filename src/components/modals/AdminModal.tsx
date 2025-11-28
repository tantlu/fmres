import { useState, useEffect } from 'react';
import { X, Save, Edit, Plus, Coffee, Link as LinkIcon, BookOpen } from 'lucide-react'; // Đã thêm icon BookOpen
import { CATEGORIES, type ResourceItem, type GameVersion } from '../../types';
import RichTextEditor from '../RichTextEditor';

export default function AdminModal({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: ResourceItem | null; onSave: (data: ResourceItem) => void; }) {
  // 1. Khởi tạo state có thêm trường 'instructions'
  const [formData, setFormData] = useState<ResourceItem>({
    title: '', category: 'Face', version: 'FM26', author: '', image: '', downloadLink: '', description: '', 
    instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
    donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '', category: 'Face', version: 'FM26', author: '', image: '', downloadLink: '', description: '', 
        instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
        donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1e293b] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-600">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-[#1e293b] z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-emerald-500" />}
            {initialData ? 'Chỉnh sửa Item' : 'Tạo Item Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tiêu đề</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Danh mục</label>
                   <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none">{CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Phiên bản Game</label>
                   <select 
                      value={formData.version || 'FM26'} 
                      onChange={e => setFormData({ ...formData, version: e.target.value as GameVersion })} 
                      className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-emerald-400 font-bold outline-none"
                    >
                      <option value="All">Tất cả / Chung</option>
                      <option value="FM26">Football Manager 26</option>
                      <option value="FM24">Football Manager 24</option>
                   </select>
                </div>
                
              </div>
              <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tác giả</label>
                   <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none" />
                </div>
            </div>
        
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Ảnh (URL)</label>
                <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Download</label>
                <input type="text" value={formData.downloadLink} onChange={e => setFormData({ ...formData, downloadLink: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-blue-400 outline-none" />
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div>
             <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Nội dung bài viết</label>
             <RichTextEditor value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
          </div>

          {/* --- PHẦN BẠN ĐANG TÌM: HƯỚNG DẪN CÀI ĐẶT --- */}
          <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/30">
             <label className="block text-xs font-bold text-blue-400 mb-2 uppercase flex items-center gap-2">
               <BookOpen size={16} /> Hướng dẫn cài đặt / Lưu ý <span className="text-[10px] text-slate-500 normal-case font-normal">(Tùy chọn - Nếu để trống sẽ hiện hướng dẫn mặc định)</span>
             </label>
             {/* Đây là ô soạn thảo thứ 2 dành riêng cho hướng dẫn */}
             <RichTextEditor 
                value={formData.instructions || ''} 
                onChange={(html) => setFormData({ ...formData, instructions: html })} 
             />
          </div>

          {/* Phần Donate */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2"><Coffee size={16} /> Cấu hình Donate (Tùy chọn)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><LinkIcon size={10}/> Link Donate</label>
                <input type="text" value={formData.donateLink || ''} onChange={e => setFormData({ ...formData, donateLink: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-blue-300 focus:border-blue-500 outline-none" placeholder="https://..." />
              </div>
              <div className="relative flex py-1 items-center">
                 <div className="flex-grow border-t border-slate-700"></div><span className="flex-shrink-0 mx-2 text-[10px] text-slate-500 uppercase">Hoặc chuyển khoản</span><div className="flex-grow border-t border-slate-700"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={formData.bankName || ''} onChange={e => setFormData({ ...formData, bankName: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white focus:border-emerald-500 outline-none" placeholder="Tên NH" />
                <input type="text" value={formData.bankAccount || ''} onChange={e => setFormData({ ...formData, bankAccount: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white focus:border-emerald-500 outline-none" placeholder="Số TK" />
                <input type="text" value={formData.bankOwner || ''} onChange={e => setFormData({ ...formData, bankOwner: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white focus:border-emerald-500 outline-none" placeholder="Chủ TK" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-slate-800/50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-medium transition-colors">Hủy bỏ</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"><Save size={18} /> Lưu bài viết</button>
        </div>
      </div>
    </div>
  );
}