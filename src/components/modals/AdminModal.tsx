import { useState } from 'react';
import { X, Save, Edit, Plus } from 'lucide-react';
import { CATEGORIES, type ResourceItem, type GameVersion, type Category } from '../../types';
import RichTextEditor from '../RichTextEditor';

const initialFormState: ResourceItem = {
  title: '', category: 'Bài viết', tags: [], version: 'FM26', author: '', image: '', downloadLink: '', 
  summary: '', readTime: '', sourceUrl: '', description: '', 
  instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
  donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
};

export default function AdminModal({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData?: ResourceItem | null; onSave: (data: ResourceItem) => void; }) {
  const [prevData, setPrevData] = useState<{ isOpen: boolean; initialData?: ResourceItem | null }>({ isOpen, initialData });
  const [formData, setFormData] = useState<ResourceItem>(() => (
    initialData ? { ...initialData, tags: initialData.tags || [] } : initialFormState
  ));

  const determineType = (item?: ResourceItem | null): 'article' | 'guide' | 'resource' => {
    if (!item) return 'article';
    if (item.category === 'Bài viết') return 'article';
    if (item.category === 'Guide') return 'guide';
    return 'resource';
  };

  const [contentType, setContentType] = useState<'article' | 'guide' | 'resource'>(() => determineType(initialData));

  if (prevData.isOpen !== isOpen || prevData.initialData !== initialData) {
    setPrevData({ isOpen, initialData });
    const nextType = determineType(initialData);
    setContentType(nextType);
    if (initialData) {
      setFormData({ ...initialData, tags: initialData.tags || [] });
    } else {
      setFormData({
        ...initialFormState,
        category: 'Bài viết',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  const handleContentTypeChange = (type: 'article' | 'guide' | 'resource') => {
    setContentType(type);
    if (type === 'article') {
      setFormData(prev => ({ ...prev, category: 'Bài viết' }));
    } else if (type === 'guide') {
      setFormData(prev => ({ ...prev, category: 'Guide' }));
    } else {
      setFormData(prev => ({ ...prev, category: prev.category === 'Bài viết' || prev.category === 'Guide' ? 'Face' : prev.category }));
    }
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  if (!isOpen) return null;

  const isArticle = contentType === 'article' || formData.category === 'Bài viết';
  const isGuide = contentType === 'guide' || formData.category === 'Guide';

  const articleTagSuggestions = [
    'Tin tức FM', 'Cập nhật Patch', 'Wonderkids', 'Đánh giá & Review', 
    'Phân tích chiến thuật', 'Chuyển nhượng', 'Bản quyền', 'Kinh nghiệm chơi'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#180f33] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-violet-500/30" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-violet-500/20 flex justify-between items-center sticky top-0 bg-[#180f33] z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2 font-display">
              {initialData ? <Edit size={18} className="text-cyan-400" /> : <Plus size={18} className="text-violet-400" />}
              {initialData ? 'Chỉnh sửa nội dung' : 'Đăng tải bài viết & nội dung mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-violet-900/40 rounded-lg text-violet-300 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content Type Selector Header */}
        <div className="bg-[#120a28] p-4 border-b border-violet-500/20 flex flex-wrap gap-2.5 items-center justify-between">
          <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Chọn loại nội dung:</span>
          <div className="flex items-center gap-1 bg-[#1a1036] p-1 rounded-xl border border-violet-500/25">
            <button
              type="button"
              onClick={() => handleContentTypeChange('article')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                contentType === 'article'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40'
                  : 'text-violet-200/70 hover:text-white'
              }`}
            >
              Bài viết & Tin tức FM
            </button>
            <button
              type="button"
              onClick={() => handleContentTypeChange('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                contentType === 'guide'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40'
                  : 'text-violet-200/70 hover:text-white'
              }`}
            >
              Guide cẩm nang
            </button>
            <button
              type="button"
              onClick={() => handleContentTypeChange('resource')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                contentType === 'resource'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40'
                  : 'text-violet-200/70 hover:text-white'
              }`}
            >
              Tài nguyên Mod / File
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  {isArticle ? 'Tiêu đề bài viết' : isGuide ? 'Tiêu đề Guide' : 'Tiêu đề tài nguyên'}
                </label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-violet-300/40" 
                  placeholder={isArticle ? 'Ví dụ: Phân tích Match Engine FM26...' : 'Tiêu đề...'} 
                />
              </div>

              {/* Tóm tắt mở đầu */}
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  Tóm tắt mở đầu (Sapo bài viết)
                </label>
                <textarea 
                  value={formData.summary || ''} 
                  onChange={e => setFormData({ ...formData, summary: e.target.value })} 
                  rows={3}
                  className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-violet-300/40" 
                  placeholder="2-3 câu giới thiệu ngắn gọn nổi bật nội dung chính..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Danh mục</label>
                  <select 
                    value={formData.category} 
                    onChange={e => {
                      const newCat = e.target.value as Category;
                      setFormData({ ...formData, category: newCat });
                      if (newCat === 'Bài viết') setContentType('article');
                      else if (newCat === 'Guide') setContentType('guide');
                      else setContentType('resource');
                    }} 
                    className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Phiên bản FM</label>
                  <select 
                    value={formData.version} 
                    onChange={e => setFormData({ ...formData, version: e.target.value as GameVersion })} 
                    className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="All">Tất cả phiên bản</option>
                    <option value="FM26">FM26</option>
                    <option value="FM24">FM24</option>
                    <option value="FM23">FM23</option>
                    <option value="FM Cũ hơn">FM Cũ hơn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Tác giả</label>
                  <input 
                    type="text" 
                    value={formData.author} 
                    onChange={e => setFormData({ ...formData, author: e.target.value })} 
                    className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none" 
                    placeholder="Nguyễn Tấn..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Thời lượng đọc</label>
                  <input 
                    type="text" 
                    value={formData.readTime || ''} 
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })} 
                    className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none" 
                    placeholder="Ví dụ: 5 phút đọc" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Link ảnh bìa (Cover Image)</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={e => setFormData({ ...formData, image: e.target.value })} 
                  className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none" 
                  placeholder="https://..." 
                />
              </div>

              {/* Download link */}
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  Link tải file đính kèm {isArticle && <span className="text-violet-400 font-normal lowercase">(tùy chọn)</span>}
                </label>
                <input 
                  type="text" 
                  value={formData.downloadLink || ''} 
                  onChange={e => setFormData({ ...formData, downloadLink: e.target.value })} 
                  className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none" 
                  placeholder="https://drive.google.com/... hoặc Mediafire..." 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Gợi ý thẻ Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {articleTagSuggestions.map(tag => {
                    const isSelected = (formData.tags || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-sm border border-violet-400/40'
                            : 'bg-[#120a26] text-violet-300/70 hover:text-white border border-violet-500/20'
                        }`}
                      >
                        +{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
              Nội dung chi tiết bài viết (Rich Text Editor)
            </label>
            <RichTextEditor 
              value={formData.description || ''} 
              onChange={val => setFormData({ ...formData, description: val })} 
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">Ghi chú & Hướng dẫn cài đặt</label>
            <textarea 
              value={formData.instructions || ''} 
              onChange={e => setFormData({ ...formData, instructions: e.target.value })} 
              rows={3} 
              className="w-full bg-[#110926] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none" 
              placeholder="Ghi chú nguồn bài viết hoặc đường dẫn cài đặt..." 
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-violet-500/20 flex justify-end gap-3 sticky bottom-0 bg-[#180f33] z-20 backdrop-blur-md">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 rounded-xl text-xs font-bold text-violet-300 hover:text-white hover:bg-violet-900/40 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="button"
            onClick={() => {
              onSave(formData);
              onClose();
            }} 
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md shadow-violet-600/30 flex items-center gap-1.5 transition-all border border-violet-400/30"
          >
            <Save size={14} /> <span>Lưu nội dung</span>
          </button>
        </div>
      </div>
    </div>
  );
}
