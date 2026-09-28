import { useState, useRef, useEffect } from 'react';
import { Search, LogOut, User, Plus, Crown, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, toSlug, type Category } from '../types';

interface HeaderProps {
  selectedCategory: Category;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAdmin: boolean;
  userEmail?: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onAddItemClick: () => void;
  onOpenCommandPalette?: () => void;
}

export default function Header({
  selectedCategory, searchTerm, setSearchTerm,
  isAdmin, userEmail, onLoginClick, onLogoutClick, onAddItemClick,
  onOpenCommandPalette
}: HeaderProps) {
  const navigate = useNavigate();
  const [isGraphicsMenuOpen, setIsGraphicsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGraphicsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const graphicsCategories: Category[] = ['Face', 'Logo', 'Kits', 'Database', 'Mods', 'FM Version'];
  const isGraphicsActive = graphicsCategories.includes(selectedCategory);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#130d25]/90 border-b border-violet-500/20 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative">
            <img 
              src="https://yt3.ggpht.com/83WfPjeUQMeiK56shkZPb4opoo8vqdP9PpSpf92ayYAUIEocv8GbRvze_tjZumiBAsK0sVWVUQ=s600-c-k-c0x00ffffff-no-rj-rp-mo" 
              alt="Logo" 
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-violet-950/80 border border-violet-500/30 p-0.5 object-cover transition-transform group-hover:scale-105" 
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#130d25]">
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none text-white font-display">
                FM RES <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">HUB</span>
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm border border-violet-400/30">
                26
              </span>
            </div>
            <p className="text-[10px] text-violet-300/70 font-semibold tracking-wider uppercase mt-0.5">Football Manager VN</p>
          </div>
        </div>

        {/* Navigation Bar - Desktop (Tối ưu gọn gàng, không icon rườm rà) */}
        <nav className="hidden lg:flex items-center bg-[#1c1439]/90 p-1 rounded-full border border-violet-500/20 shadow-inner gap-1">
          {/* 1. Trang chủ / Tất cả */}
          <button
            onClick={() => navigate('/')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Tất cả
          </button>

          {/* 2. BÀI VIẾT */}
          <button
            onClick={() => navigate(`/${toSlug('Bài viết')}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'Bài viết'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Bài viết
          </button>

          {/* 3. GUIDE CỦA TÔI */}
          <button
            onClick={() => navigate(`/${toSlug('Guide')}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'Guide'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Guide của tôi
          </button>

          {/* 4. TACTICS */}
          <button
            onClick={() => navigate(`/${toSlug('Tactics')}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'Tactics'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Tactics
          </button>

          {/* 5. VIỆT HÓA */}
          <button
            onClick={() => navigate(`/${toSlug('Việt hóa')}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedCategory === 'Việt hóa'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Việt hóa
          </button>

          {/* 6. DROPDOWN ĐỒ HỌA & MODS */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsGraphicsMenuOpen(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isGraphicsActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{isGraphicsActive ? selectedCategory : 'Đồ họa & Mods'}</span>
              <ChevronDown size={13} className={`transform transition-transform opacity-70 ${isGraphicsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isGraphicsMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#181033] border border-violet-500/30 rounded-2xl shadow-2xl p-1 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-violet-300/60 uppercase tracking-wider border-b border-violet-500/20">
                  Tài nguyên mod
                </div>
                {graphicsCategories.map(cat => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/${toSlug(cat)}`);
                        setIsGraphicsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-violet-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-violet-900/40'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar with Command Palette trigger */}
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300/60 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, tài nguyên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1c1439]/90 border border-violet-500/20 rounded-full py-2 pl-9 pr-14 sm:pr-16 text-xs text-white focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 outline-none w-36 sm:w-56 md:w-64 transition-all placeholder:text-slate-400/70 shadow-inner"
            />
            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            ) : onOpenCommandPalette ? (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] font-mono font-bold bg-[#140b28] hover:bg-violet-900/40 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30 transition-colors"
                title="Mở tìm kiếm nhanh (Ctrl + K)"
              >
                <span>⌘K</span>
              </button>
            ) : null}
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={onAddItemClick} 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-violet-600/30 border border-violet-400/30 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Plus size={15} /> <span className="hidden sm:inline">Đăng mới</span>
              </button>
              <button 
                onClick={onLogoutClick} 
                className="bg-[#1c1439] hover:bg-rose-500/20 text-rose-400 p-2 rounded-xl border border-rose-500/30 transition-all hover:scale-105"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="p-2 text-violet-300 hover:text-white transition-colors bg-[#1c1439] hover:bg-violet-900/40 rounded-xl border border-violet-500/20 shadow-sm flex items-center gap-1.5 px-3"
              title="Đăng nhập Quản trị viên"
            >
              <User size={16} />
              <span className="hidden sm:inline text-xs font-bold">Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Scrollable: Gọn gàng, sạch sẽ */}
      <div className="lg:hidden border-t border-violet-500/20 bg-[#150e29]/95 backdrop-blur-md">
        <div className="flex overflow-x-auto px-3 py-2 gap-1.5 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const isGuide = cat === 'Guide';

            return (
              <button
                key={cat}
                onClick={() => cat === 'All' ? navigate('/') : navigate(`/${toSlug(cat)}`)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-md shadow-violet-600/25' 
                    : 'bg-[#1e153a] text-slate-300 border-violet-500/20 hover:bg-violet-900/30'
                }`}
              >
                {cat === 'All' ? 'Tất cả' : isGuide ? 'Guide của tôi' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[11px] font-bold text-center py-1 flex justify-center items-center gap-1.5 shadow-sm">
          <Crown size={13} className="text-black" />
          <span>CHẾ ĐỘ QUẢN TRỊ VIÊN: {userEmail}</span>
        </div>
      )}
    </header>
  );
}