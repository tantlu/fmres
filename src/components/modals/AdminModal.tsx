import { useState, useEffect } from 'react';
import { X, Save, Edit, Plus, Coffee, Link as LinkIcon, BookOpen, Tag } from 'lucide-react';
import { CATEGORIES, type ResourceItem, type GameVersion } from '../../types';
import RichTextEditor from '../RichTextEditor';

export default function AdminModal({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: ResourceItem | null; onSave: (data: ResourceItem) => void; }) {
  const [formData, setFormData] = useState<ResourceItem>({
    title: '', category: 'Face', tags: [], version: 'FM26', author: '', image: '', downloadLink: '', description: '', 
    instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
    donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, tags: initialData.tags || [] });
    } else {
      setFormData({
        title: '', category: 'Face', tags: [], version: 'FM26', author: '', image: '', downloadLink: '', description: '', 
        instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
        donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
      });
    }
  }, [initialData, isOpen]);

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1e293b] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-600">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-[#1e293b] z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-emerald-500" />}
            {initialData ? 'Chỉnh sửa Item' : 'Tạo Item Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tiêu đề</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Danh mục Chính</label>
                   <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none">
                     {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Phiên bản</label>
                   <select value={formData.version || 'FM26'} onChange={e => setFormData({ ...formData, version: e.target.value as GameVersion })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-emerald-400 font-bold outline-none">
                      <option value="All">Tất cả</option><option value="FM26">FM26</option><option value="FM25">FM25</option><option value="FM24">FM24</option>
                   </select>
                </div>
              </div>

              {/* Tags phụ */}
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-2">
                  <Tag size={12} /> Tags phụ (Chọn nhiều)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <label key={c} className={`cursor-pointer px-3 py-1.5 rounded text-[11px] font-bold border transition-all flex items-center gap-2 ${
                      (formData.tags || []).includes(c) 
                        ? 'bg-emerald-600 text-white border-emerald-500' 
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                    }`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={(formData.tags || []).includes(c)}
                        onChange={() => toggleTag(c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div><label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tác giả</label><input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none" /></div>
               <div><label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Ảnh</label><input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white outline-none" /></div>
               <div><label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Download</label><input type="text" value={formData.downloadLink} onChange={e => setFormData({ ...formData, downloadLink: e.target.value })} className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-blue-400 outline-none" /></div>
            </div>
          </div>

          <div><label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Nội dung</label><RichTextEditor value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} /></div>
          
          <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-900/30">
             <label className="block text-xs font-bold text-blue-400 mb-2 uppercase flex items-center gap-2"><BookOpen size={16} /> Hướng dẫn cài đặt / Lưu ý</label>
             <RichTextEditor value={formData.instructions || ''} onChange={(html) => setFormData({ ...formData, instructions: html })} />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2"><Coffee size={16} /> Donate Info</h4>
            <div className="space-y-3">
              {/* Đã thêm lại Label sử dụng LinkIcon để fix lỗi */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><LinkIcon size={10}/> Link Donate</label>
                <input type="text" value={formData.donateLink || ''} onChange={e => setFormData({ ...formData, donateLink: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-blue-300" placeholder="Link Donate..." />
              </div>
              <div className="relative flex py-1 items-center">
                 <div className="flex-grow border-t border-slate-700"></div><span className="flex-shrink-0 mx-2 text-[10px] text-slate-500 uppercase">Hoặc chuyển khoản</span><div className="flex-grow border-t border-slate-700"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={formData.bankName || ''} onChange={e => setFormData({ ...formData, bankName: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white" placeholder="Tên NH" />
                <input type="text" value={formData.bankAccount || ''} onChange={e => setFormData({ ...formData, bankAccount: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white" placeholder="Số TK" />
                <input type="text" value={formData.bankOwner || ''} onChange={e => setFormData({ ...formData, bankOwner: e.target.value })} className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white" placeholder="Chủ TK" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-slate-800/50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-medium">Hủy bỏ</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 shadow-lg flex items-center gap-2"><Save size={18} /> Lưu bài viết</button>
        </div>
      </div>
    </div>
  );
}