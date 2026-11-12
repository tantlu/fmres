import { useState } from 'react';
import { X, Save, Edit, Plus, Copy, Coffee, ExternalLink, QrCode } from 'lucide-react';
import { CATEGORIES, type ResourceItem, type GameVersion, type Category } from '../../types';
import RichTextEditor from '../RichTextEditor';

const initialFormState: ResourceItem = {
  title: '', category: 'Bài viết', tags: [], version: 'FM26', author: '', image: '', downloadLink: '', 
  summary: '', readTime: '', sourceUrl: '', description: '', 
  instructions: '', views: 0, likes: 0, date: new Date().toISOString().split('T')[0],
  donateLink: '', bankName: '', bankAccount: '', bankOwner: ''
};

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ResourceItem | null;
  onSave: (data: ResourceItem) => void;
  onDuplicate?: (item: ResourceItem) => void;
}

export default function AdminModal({ isOpen, onClose, initialData, onSave, onDuplicate }: AdminModalProps) {
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
    'FM27', 'FM26', 'Tin tức FM', 'Cập nhật Patch', 'Wonderkids', 'Đánh giá & Review', 
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
                    <option value="FM27">FM27</option>
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

          {/* Section: Thông tin Donate & Ủng hộ tác giả */}
          <div className="bg-[#120926] p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-violet-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Coffee size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Thông tin Donate & Ủng hộ tác giả</span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full font-medium">VietQR tự động</span>
                  </h4>
                  <p className="text-[11px] text-violet-300/70">Hiển thị mã QR ngân hàng hoặc link donate khi người xem bấm nút "Ủng hộ tác giả"</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Tên ngân hàng */}
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  Ngân hàng / Ví điện tử
                </label>
                <input 
                  type="text" 
                  value={formData.bankName || ''} 
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })} 
                  className="w-full bg-[#180f33] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-violet-300/40" 
                  placeholder="MBBank, VCB, Techcombank..." 
                />
                {/* Gợi ý ngân hàng nhanh */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['MBBank', 'Vietcombank', 'Techcombank', 'VPBank', 'BIDV', 'TPBank', 'ACB', 'MoMo'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, bankName: b })}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-colors border ${
                        formData.bankName?.toUpperCase() === b.toUpperCase()
                          ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 font-bold'
                          : 'bg-[#180f33] text-violet-300/70 hover:text-white border-violet-500/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số tài khoản */}
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  Số tài khoản (STK)
                </label>
                <input 
                  type="text" 
                  value={formData.bankAccount || ''} 
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value })} 
                  className="w-full bg-[#180f33] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-violet-300/40 font-mono tracking-wider" 
                  placeholder="Ví dụ: 0987654321..." 
                />
                <span className="text-[10px] text-violet-400/70 mt-1 block">Dùng để tạo mã quét VietQR chuẩn</span>
              </div>

              {/* Chủ tài khoản */}
              <div>
                <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                  Tên chủ tài khoản
                </label>
                <input 
                  type="text" 
                  value={formData.bankOwner || ''} 
                  onChange={e => setFormData({ ...formData, bankOwner: e.target.value })} 
                  className="w-full bg-[#180f33] border border-violet-500/25 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-violet-300/40 uppercase" 
                  placeholder="Ví dụ: NGUYEN VAN A..." 
                />
                <span className="text-[10px] text-violet-400/70 mt-1 block">Họ tên in trên thẻ / app ngân hàng</span>
              </div>
            </div>

            {/* Link cổng quyên góp */}
            <div>
              <label className="block text-xs font-bold text-violet-300 mb-1.5 uppercase tracking-wider">
                Link cổng Donate trực tuyến khác (tùy chọn)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.donateLink || ''} 
                  onChange={e => setFormData({ ...formData, donateLink: e.target.value })} 
                  className="w-full bg-[#180f33] border border-violet-500/25 rounded-xl p-2.5 pl-8 text-xs text-white focus:border-amber-400 focus:outline-none placeholder:text-violet-300/40" 
                  placeholder="https://playerduo.net/... hoặc https://buymeacoffee.com/..." 
                />
                <ExternalLink size={13} className="absolute left-2.5 top-3 text-violet-400 pointer-events-none" />
              </div>
            </div>

            {/* Live VietQR Preview Card */}
            {formData.bankName && formData.bankAccount && (
              <div className="pt-2 flex items-center gap-3.5 bg-amber-500/10 p-3 rounded-xl border border-amber-500/25">
                <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 overflow-hidden shadow-md flex items-center justify-center">
                  <img 
                    src={`https://img.vietqr.io/image/${formData.bankName.trim().toUpperCase()}-${formData.bankAccount.trim()}-compact2.png?amount=0&addInfo=${encodeURIComponent(`Donate ${formData.author || 'tac gia'}`)}&accountName=${encodeURIComponent(formData.bankOwner || '')}`}
                    alt="VietQR Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <QrCode size={13} className="text-amber-400" />
                    <span>Mã VietQR đã sẵn sàng</span>
                  </p>
                  <p className="text-[11px] text-amber-200/90 font-mono">
                    {formData.bankName.toUpperCase()} · STK: <span className="font-bold text-white">{formData.bankAccount}</span>
                  </p>
                  {formData.bankOwner && (
                    <p className="text-[10px] text-amber-300/70 font-semibold uppercase">
                      Chủ TK: {formData.bankOwner}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-violet-500/20 flex items-center justify-between gap-3 sticky bottom-0 bg-[#180f33] z-20 backdrop-blur-md">
          {initialData && onDuplicate ? (
            <button 
              type="button"
              onClick={() => {
                onDuplicate(formData);
                onClose();
              }} 
              className="bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Nhân đôi bài viết này thành bản sao mới"
            >
              <Copy size={14} /> <span>Nhân đôi bài này</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
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
    </div>
  );
}
