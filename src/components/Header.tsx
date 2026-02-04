import { Search, LogOut, User, Plus, Crown } from 'lucide-react';
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
}

export default function Header({
  selectedCategory, searchTerm, setSearchTerm,
  isAdmin, userEmail, onLoginClick, onLogoutClick, onAddItemClick
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <img src="https://yt3.ggpht.com/83WfPjeUQMeiK56shkZPb4opoo8vqdP9PpSpf92ayYAUIEocv8GbRvze_tjZumiBAsK0sVWVUQ=s600-c-k-c0x00ffffff-no-rj-rp-mo" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#1e293b]" />
          <div>
            <h1 className="text-xl font-bold leading-none text-white">FM RES <span className="text-emerald-500">HUB</span></h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Vietnam Community</p>
          </div>
        </div>

        {/* Navigation Pills - Desktop */}
        <nav className="hidden lg:flex items-center bg-surface/50 p-1 rounded-full border border-white/5 shadow-inner">
          {CATEGORIES.slice(0, 8).map(cat => (
            <button
              key={cat}
              onClick={() => cat === 'All' ? navigate('/') : navigate(`/${toSlug(cat)}`)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === cat
                ? 'bg-primary text-black shadow-lg shadow-primary/25'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none w-32 md:w-60 transition-all placeholder:text-zinc-600"
            />
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button onClick={onAddItemClick} className="bg-primary hover:bg-emerald-400 text-black p-2 rounded-full shadow-lg hover:shadow-primary/30 transition-all"><Plus size={18} /></button>
              <button onClick={onLogoutClick} className="bg-surface hover:bg-red-500/20 text-red-500 hover:text-red-400 p-2 rounded-full border border-white/5 transition-all"><LogOut size={18} /></button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="p-2 text-zinc-400 hover:text-white transition-colors bg-surface hover:bg-white/5 rounded-full border border-white/5">
              <User size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Scrollable */}
      <div className="lg:hidden border-t border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex overflow-x-auto p-2 gap-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => cat === 'All' ? navigate('/') : navigate(`/${toSlug(cat)}`)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-primary text-black border-primary' : 'bg-surface text-zinc-400 border-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-amber-500 text-black text-[10px] font-bold text-center py-0.5 flex justify-center items-center gap-2">
          <Crown size={12} /> ADMIN: {userEmail}
        </div>
      )}
    </header>
  );
}