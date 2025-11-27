import { Search, LogOut, User, Plus, Crown } from 'lucide-react'; // Xóa React
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, toSlug, type Category } from '../types'; // Thêm chữ type

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

  const handleCategoryClick = (cat: Category) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(`/${toSlug(cat)}`);
    }
  };

  return (
    <>
      <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <img src="https://yt3.ggpht.com/83WfPjeUQMeiK56shkZPb4opoo8vqdP9PpSpf92ayYAUIEocv8GbRvze_tjZumiBAsK0sVWVUQ=s600-c-k-c0x00ffffff-no-rj-rp-mo" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#1e293b]" />
              <div>
                <h1 className="text-xl font-bold leading-none text-white">FM RES <span className="text-emerald-500">HUB</span></h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Vietnam Community</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
              {CATEGORIES.slice(0, 10).map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:ring-2 focus:ring-emerald-500 outline-none w-32 md:w-48 focus:w-64 transition-all"
                />
              </div>
              {isAdmin ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                  <button onClick={onAddItemClick} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg"><Plus size={18} /></button>
                  <button onClick={onLogoutClick} className="bg-slate-800 hover:bg-slate-700 text-rose-400 p-2 rounded-full border border-slate-700"><LogOut size={18} /></button>
                </div>
              ) : (
                <button onClick={onLoginClick} className="text-slate-500 hover:text-white p-2"><User size={20} /></button>
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-hide bg-[#1e293b]">
          <div className="flex p-3 space-x-2 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>
      {isAdmin && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 text-center backdrop-blur-sm">
          <p className="text-xs text-amber-500 font-bold flex items-center justify-center gap-2 tracking-wide">
            <Crown size={16} className="fill-amber-500 text-amber-500" /> ADMIN MODE ACTIVE <span className="opacity-50">|</span> {userEmail}
          </p>
        </div>
      )}
    </>
  );
}