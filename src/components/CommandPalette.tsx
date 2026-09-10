import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, Heart, Eye, Folder } from 'lucide-react';
import { type ResourceItem, type GameVersion } from '../types';
import { getProviderName, sanitizeGameVersion } from '../utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: ResourceItem[];
  onSelectItem: (item: ResourceItem) => void;
  onSelectCategory?: (category: string) => void;
  onSelectVersion?: (version: GameVersion) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onSelectCategory,
  onSelectVersion,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        }
      }
      if (isOpen && e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Filter items based on query
  const filteredItems = items.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.version && item.version.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  }).slice(0, 10);

  // Keyboard navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onSelectItem(filteredItems[selectedIndex]);
        onClose();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 md:pt-20 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div 
        className="bg-[#170e30] border border-violet-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-violet-950/80 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyNavigation}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-violet-500/20 p-4 bg-[#1e133d]">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="Gõ tên tài nguyên, CLB, giải đấu, tactic, tác giả... (Ctrl+K)"
              className="w-full bg-transparent text-white placeholder:text-slate-400 text-sm md:text-base outline-none font-medium"
            />
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#130d26] text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-lg shadow-sm">
              ESC để đóng
            </kbd>
          </div>

          {/* Quick Version Jump Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-violet-500/15 overflow-x-auto scrollbar-hide text-xs">
            <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Lọc nhanh:</span>
            {(['FM26', 'FM24', 'FM23'] as GameVersion[]).map(ver => (
              <button
                key={ver}
                type="button"
                onClick={() => {
                  if (onSelectVersion) onSelectVersion(ver);
                  onClose();
                }}
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all shrink-0 ${
                  ver === 'FM26' 
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm border border-cyan-400/40 hover:scale-105'
                    : 'bg-[#251949] text-violet-200 border border-violet-500/30 hover:bg-violet-800/40'
                }`}
              >
                {ver === 'FM26' ? '✨ FM26' : ver}
              </button>
            ))}
            {['Face', 'Logo', 'Kits', 'Tactics', 'Việt hóa'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat);
                  onClose();
                }}
                className="px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-[#140b28] text-slate-300 hover:text-white border border-violet-500/20 hover:bg-violet-900/30 shrink-0"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-violet-500/10 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Folder size={36} className="mx-auto mb-2 text-violet-400/50" />
              <p className="text-sm font-bold text-white">Không tìm thấy kết quả nào cho "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">Thử tìm theo từ khóa chung như: Tactic, Facepack, Logo, Kits...</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const displayVersion = sanitizeGameVersion(item.version);
              const isFm26 = displayVersion === 'FM26';
              const provider = getProviderName(item.downloadLink);

              return (
                <div
                  key={item.id || item.title}
                  onClick={() => { onSelectItem(item); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-r from-violet-900/60 to-purple-900/50 border border-cyan-400/40 shadow-lg' 
                      : 'hover:bg-violet-950/30 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-violet-950 overflow-hidden shrink-0 border border-violet-500/20">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/1e153c/a78bfa?text=FM'; }}
                      />
                    </div>

                    {/* Title & Metadata */}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#110b24] text-violet-300 border border-violet-500/20">
                          {item.category}
                        </span>
                        {displayVersion && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            isFm26 
                              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white border border-cyan-300/40' 
                              : 'bg-violet-950 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {displayVersion}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                          bởi <strong className="text-slate-300">{item.author}</strong>
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Eye size={12} className="text-violet-400" /> {item.views}</span>
                      <span className="flex items-center gap-1"><Heart size={12} className="text-rose-400" /> {item.likes}</span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-300 bg-[#120b24] border border-violet-500/20 px-2 py-1 rounded-lg hidden md:inline">
                      {provider}
                    </span>

                    <button 
                      type="button"
                      className={`p-2 rounded-xl transition-transform ${isSelected ? 'bg-cyan-500 text-black scale-105' : 'bg-[#221644] text-violet-300'}`}
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[#110a22] border-t border-violet-500/20 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="bg-[#1c1238] px-1.5 py-0.5 rounded border border-violet-500/30 text-[10px]">↑</kbd> <kbd className="bg-[#1c1238] px-1.5 py-0.5 rounded border border-violet-500/30 text-[10px]">↓</kbd> Di chuyển</span>
            <span className="flex items-center gap-1"><kbd className="bg-[#1c1238] px-1.5 py-0.5 rounded border border-violet-500/30 text-[10px]">Enter</kbd> Xem chi tiết</span>
          </div>
          <span className="text-violet-300/80 font-bold">FM Resource Hub 2026</span>
        </div>
      </div>
    </div>
  );
}
