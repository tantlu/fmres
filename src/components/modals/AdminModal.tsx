import { useState } from 'react';
import { X, Save, Edit, Plus, Coffee, Link as LinkIcon, BookOpen, Tag } from 'lucide-react';
import { CATEGORIES, type ResourceItem, type GameVersion } from '../../types';
import RichTextEditor from '../RichTextEditor';

const initialFormState: ResourceItem = {
  title: '', category: 'Face', tags: [], version: 'FM26', author: '', image: '', downloadLink: '', description: '', 
  instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
  donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
};

export default function AdminModal({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: ResourceItem | null; onSave: (data: ResourceItem) => void; }) {
  const [prevData, setPrevData] = useState<{ isOpen: boolean; initialData?: ResourceItem | null }>({ isOpen, initialData });
  const [formData, setFormData] = useState<ResourceItem>(() => (
    initialData ? { ...initialData, tags: initialData.tags || [] } : initialFormState
  ));

  if (prevData.isOpen !== isOpen || prevData.initialData !== initialData) {
    setPrevData({ isOpen, initialData });
    if (initialData) {
      setFormData({ ...initialData, tags: initialData.tags || [] });
    } else {
      setFormData({
        ...initialFormState,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#1c133a] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-violet-500/30" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-violet-500/20 flex justify-between items-center sticky top-0 bg-[#1c133a] z-20 backdrop-blur-md">
          <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
            {initialData ? <Edit size={20} className="text-cyan-300" /> : <Plus size={20} className="text-violet-400" />}
            {initialData ? 'Chỉnh sửa Tài nguyên' : 'Thêm Tài nguyên Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-violet-900/40 rounded-xl text-violet-300 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Tiêu đề</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/25 transition-all text-sm" 
                  placeholder="Nhập tên tài nguyên..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Danh mục Chính</label>
                   <select 
                     value={formData.category} 
                     onChange={e => setFormData({ ...formData, category: e.target.value })} 
                     className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-white outline-none focus:border-violet-400 text-sm"
                   >
                     {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Phiên bản</label>
                   <select 
                     value={formData.version || 'FM26'} 
                     onChange={e => setFormData({ ...formData, version: e.target.value as GameVersion })} 
                     className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-cyan-300 font-bold outline-none focus:border-violet-400 text-sm"
                   >
                      <option value="All">Tất cả</option>
                      <option value="FM26">FM26</option>
                      <option value="FM25">FM25</option>
                      <option value="FM24">FM24</option>
                   </select>
                </div>
              </div>

              {/* Tags phụ */}
              <div className="bg-[#140c2b] p-3.5 rounded-2xl border border-violet-500/20">
                <label className="block text-xs font-bold text-violet-300 mb-2.5 uppercase tracking-wider flex items-center gap-2">
                  <Tag size={13} className="text-cyan-400" /> Tags phụ (Chọn nhiều)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c !== 'All').map(c => {
                    const isChecked = (formData.tags || []).includes(c);
                    return (
                      <label key={c} className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isChecked 
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-sm' 
                          : 'bg-[#1e153d] text-slate-300 border-violet-500/20 hover:bg-violet-900/30'
                      }`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isChecked}
                          onChange={() => toggleTag(c)}
                        />
                        {c}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Tác giả</label>
                 <input 
                   type="text" 
                   value={formData.author} 
                   onChange={e => setFormData({ ...formData, author: e.target.value })} 
                   className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-white outline-none focus:border-violet-400 text-sm" 
                   placeholder="Tên tác giả / Creator"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Link Ảnh xem trước</label>
                 <input 
                   type="text" 
                   value={formData.image} 
                   onChange={e => setFormData({ ...formData, image: e.target.value })} 
                   className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-white outline-none focus:border-violet-400 text-sm" 
                   placeholder="https://..."
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Link Download</label>
                 <input 
                   type="text" 
                   value={formData.downloadLink} 
                   onChange={e => setFormData({ ...formData, downloadLink: e.target.value })} 
                   className="w-full p-3 bg-[#130d25] border border-violet-500/20 rounded-xl text-cyan-300 outline-none focus:border-violet-400 text-sm font-mono" 
                   placeholder="https://drive.google.com/..."
                 />
               </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-300 mb-2 uppercase tracking-wider">Nội dung mô tả</label>
            <RichTextEditor value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
          </div>
          
          <div className="bg-[#140c2b] p-4 rounded-2xl border border-violet-500/25">
             <label className="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider flex items-center gap-2 font-display">
               <BookOpen size={16} /> Hướng dẫn cài đặt / Lưu ý
             </label>
             <RichTextEditor value={formData.instructions || ''} onChange={(html) => setFormData({ ...formData, instructions: html })} />
          </div>

          <div className="bg-[#140c2b] p-5 rounded-2xl border border-violet-500/25">
            <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Coffee size={15} /> Thông tin Donate tác giả
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-violet-300 mb-1 uppercase tracking-wider flex items-center gap-1">
                  <LinkIcon size={12}/> Link Donate (PlayerDuo / Wescan / Bio...)
                </label>
                <input 
                  type="text" 
                  value={formData.donateLink || ''} 
                  onChange={e => setFormData({ ...formData, donateLink: e.target.value })} 
                  className="w-full p-2.5 bg-[#130d25] border border-violet-500/20 rounded-xl text-sm text-cyan-300 outline-none focus:border-violet-400" 
                  placeholder="https://playerduo.net/..." 
                />
              </div>
              <div className="relative flex py-1 items-center">
                 <div className="flex-grow border-t border-violet-500/20"></div>
                 <span className="flex-shrink-0 mx-2 text-[10px] text-violet-300/70 uppercase font-bold">Hoặc tài khoản ngân hàng</span>
                 <div className="flex-grow border-t border-violet-500/20"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input 
                  type="text" 
                  value={formData.bankName || ''} 
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })} 
                  className="w-full p-2.5 bg-[#130d25] border border-violet-500/20 rounded-xl text-sm text-white outline-none focus:border-violet-400" 
                  placeholder="Mã NH (MB, VCB...)" 
                />
                <input 
                  type="text" 
                  value={formData.bankAccount || ''} 
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value })} 
                  className="w-full p-2.5 bg-[#130d25] border border-violet-500/20 rounded-xl text-sm text-cyan-300 font-mono outline-none focus:border-violet-400" 
                  placeholder="Số tài khoản" 
                />
                <input 
                  type="text" 
                  value={formData.bankOwner || ''} 
                  onChange={e => setFormData({ ...formData, bankOwner: e.target.value })} 
                  className="w-full p-2.5 bg-[#130d25] border border-violet-500/20 rounded-xl text-sm text-white outline-none focus:border-violet-400" 
                  placeholder="Tên chủ tài khoản" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-violet-500/20 flex justify-end gap-3 bg-[#170e30] rounded-b-3xl">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-slate-300 hover:text-white bg-[#261a49] hover:bg-[#322360] rounded-xl text-xs font-bold transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => onSave(formData)} 
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 border border-violet-400/30 transition-all hover:scale-105"
          >
            <Save size={16} /> Lưu bài viết
          </button>
        </div>
      </div>
    </div>
  );
}