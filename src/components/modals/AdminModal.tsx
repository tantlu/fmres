import { useState, useEffect } from 'react'; // Xóa default React
import { X, Save, Edit, Plus, Coffee } from 'lucide-react';
import { CATEGORIES, type ResourceItem } from '../../types'; // Thêm type
import RichTextEditor from '../RichTextEditor';

export default function AdminModal({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: ResourceItem | null; onSave: (data: ResourceItem) => void; }) {
    // ... Code logic bên trong giữ nguyên ...
    const [formData, setFormData] = useState<ResourceItem>({ title: '', category: 'Face', author: '', image: '', downloadLink: '', description: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0] });
  
  useEffect(() => { if (initialData) setFormData(initialData); else setFormData({ title: '', category: 'Face', author: '', image: '', downloadLink: '', description: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0] }); }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1e293b] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-600">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-[#1e293b] z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">{initialData ? <Edit className="text-blue-500"/> : <Plus className="text-emerald-500"/>} {initialData ? 'Sửa Item' : 'Thêm Mới'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white" placeholder="Tiêu đề" />
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white">{CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select>
                <input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white" placeholder="Tác giả" />
              </div>
            </div>
            <div className="space-y-4">
              <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white" placeholder="URL Ảnh" />
              <input value={formData.downloadLink} onChange={e => setFormData({ ...formData, downloadLink: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white" placeholder="Link Tải" />
            </div>
          </div>
          <RichTextEditor value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2"><Coffee size={16} /> Donate Info</h4>
            <div className="grid grid-cols-3 gap-2">
               <input value={formData.bankName||''} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="Ngân hàng" className="p-2 bg-[#0f172a] border border-slate-600 rounded text-white text-sm" />
               <input value={formData.bankAccount||''} onChange={e => setFormData({...formData, bankAccount: e.target.value})} placeholder="Số TK" className="p-2 bg-[#0f172a] border border-slate-600 rounded text-white text-sm" />
               <input value={formData.bankOwner||''} onChange={e => setFormData({...formData, bankOwner: e.target.value})} placeholder="Chủ TK" className="p-2 bg-[#0f172a] border border-slate-600 rounded text-white text-sm" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-slate-400">Hủy</button><button onClick={() => onSave(formData)} className="px-6 py-2 bg-emerald-600 text-white rounded font-bold flex items-center gap-2"><Save size={18} /> Lưu</button></div>
      </div>
    </div>
  );
}