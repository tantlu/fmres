import { useState, useRef, useEffect } from 'react';
import { Search, LogOut, User, Plus, X, ChevronDown } from 'lucide-react';
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
  selectedCategory,
  searchTerm,
  setSearchTerm,
  isAdmin,
  userEmail,
  onLoginClick,
  onLogoutClick,
  onAddItemClick,
  onOpenCommandPalette
}: HeaderProps) {
  const navigate = useNavigate();
  const [isModsMenuOpen, setIsModsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modCategories: Category[] = ['Face', 'Logo', 'Kits', 'Database', 'Mods', 'FM Version'];
  const isModActive = modCategories.includes(selectedCategory);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#130b28]/95 border-b border-violet-500/20 shadow-lg shadow-black/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: FM26 Signature Brand Logo & Wordmark */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group" 
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 p-0.5 shadow-md shadow-violet-700/30 flex items-center justify-center font-display font-black text-white text-xs tracking-wider group-hover:scale-105 transition-transform">
            FM
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                FM HUB
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm border border-cyan-400/30">
                26
              </span>
            </div>
            <span className="text-[10px] text-violet-300/70 font-semibold tracking-wide uppercase mt-0.5">
              Football Manager VN
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (FM26 Colors & NO Decorative Icons) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#1a1036]/80 p-1 rounded-xl border border-violet-500/20">
          {/* 1. Tất cả */}
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                : 'text-violet-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Tất cả
          </button>

          {/* 2. BÀI VIẾT */}
          <button
            onClick={() => navigate(`/${toSlug('Bài viết')}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'Bài viết'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                : 'text-violet-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Bài viết
          </button>

          {/* 3. GUIDE CỦA TÔI */}
          <button
            onClick={() => navigate(`/${toSlug('Guide')}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'Guide'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                : 'text-violet-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Guide của tôi
          </button>

          {/* 4. DATABASE CẦU THỦ (NEW!) */}
          <button
            onClick={() => navigate(`/${toSlug('Database cầu thủ')}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'Database cầu thủ'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/40'
                : 'text-cyan-300 hover:text-white hover:bg-cyan-500/10'
            }`}
          >
            <span>Database cầu thủ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          {/* 5. TACTICS */}
          <button
            onClick={() => navigate(`/${toSlug('Tactics')}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'Tactics'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                : 'text-violet-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Tactics
          </button>

          {/* 6. VIỆT HÓA */}
          <button
            onClick={() => navigate(`/${toSlug('Việt hóa')}`)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'Việt hóa'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                : 'text-violet-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Việt hóa
          </button>

          {/* 7. DROPDOWN ĐỒ HỌA & MODS */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsModsMenuOpen(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                isModActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/30'
                  : 'text-violet-200/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{isModActive ? selectedCategory : 'Đồ họa & Mods'}</span>
              <ChevronDown size={13} className={`transform transition-transform opacity-70 ${isModsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isModsMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181036] border border-violet-500/30 rounded-xl shadow-2xl py-1 z-50 backdrop-blur-xl animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-violet-300/60 uppercase tracking-wider border-b border-violet-500/20">
                  Tài nguyên tải về
                </div>
                {modCategories.map(cat => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/${toSlug(cat)}`);
                        setIsModsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
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

        {/* Zone 3: Search & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300/50 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#180f33] border border-violet-500/25 rounded-lg py-1.5 pl-8 pr-12 text-xs text-white focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none w-32 sm:w-48 md:w-56 transition-all placeholder:text-violet-300/40"
            />
            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-violet-400 hover:text-white transition-colors"
                title="Xóa tìm kiếm"
              >
                <X size={13} />
              </button>
            ) : onOpenCommandPalette ? (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center text-[10px] font-mono font-medium text-violet-300 bg-[#120a26] px-1.5 py-0.5 rounded border border-violet-500/30"
                title="Tìm kiếm nhanh (Ctrl + K)"
              >
                ⌘K
              </button>
            ) : null}
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onAddItemClick} 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-violet-600/30 border border-violet-400/30 flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap"
              >
                <Plus size={14} /> <span>Đăng bài</span>
              </button>
              <button 
                onClick={onLogoutClick} 
                className="text-rose-400 hover:text-white p-1.5 rounded-lg hover:bg-rose-500/20 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="text-violet-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-violet-500/30 hover:bg-violet-900/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Đăng nhập quản trị"
            >
              <User size={14} />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav: Clean text tabs in FM26 palette */}
      <div className="lg:hidden border-t border-violet-500/20 bg-[#100824]/95 backdrop-blur-md">
        <div className="flex overflow-x-auto px-3 py-2 gap-1.5 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const isGuide = cat === 'Guide';
            const isDatabase = cat === 'Database cầu thủ';

            return (
              <button
                key={cat}
                onClick={() => cat === 'All' ? navigate('/') : navigate(`/${toSlug(cat)}`)}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  isActive 
                    ? isDatabase
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30' 
                    : isDatabase
                      ? 'bg-[#1b103b] text-cyan-300 border border-cyan-500/30'
                      : 'bg-[#160d30] text-violet-200/80 hover:text-white hover:bg-violet-900/40 border border-violet-500/20'
                }`}
              >
                {cat === 'All' ? 'Tất cả' : isGuide ? 'Guide của tôi' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 text-cyan-300 text-[11px] font-semibold text-center py-1 border-t border-violet-500/30 shadow-inner">
          <span>Quản trị viên đang đăng nhập: <strong>{userEmail}</strong></span>
        </div>
      )}
    </header>
  );
}
