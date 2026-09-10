import { useState } from 'react';
import { Copy, Check, Folder, Monitor, Apple, Terminal, CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';
import { type Category, type GameVersion } from '../types';

interface InstallPathHelperProps {
  category?: Category | string;
  version?: GameVersion | string;
  compact?: boolean;
}

export default function InstallPathHelper({ category = 'Graphics', version = 'FM26', compact = false }: InstallPathHelperProps) {
  const [os, setOs] = useState<'win' | 'mac'>('win');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number[]>([1]);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Normalize game version year
  const getFmFolderYear = (ver?: string) => {
    if (!ver || ver === 'All' || ver === 'FM26') return 'Football Manager 2026';
    if (ver === 'FM24') return 'Football Manager 2024';
    if (ver === 'FM23') return 'Football Manager 2023';
    return 'Football Manager 2024';
  };

  // Determine subfolder based on category
  const getSubfolder = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('face')) return 'graphics/faces';
    if (c.includes('logo')) return 'graphics/logos';
    if (c.includes('kit')) return 'graphics/kits';
    if (c.includes('tactic') || c.includes('chiến thuật')) return 'tactics';
    if (c.includes('database') || c.includes('dữ liệu')) return 'editor data';
    if (c.includes('skin') || c.includes('giao diện')) return 'skins';
    if (c.includes('việt hóa')) return 'languages (hoặc làm theo hướng dẫn đính kèm)';
    return 'graphics';
  };

  const folderName = getFmFolderYear(version);
  const subfolder = getSubfolder(category);

  const winPath = `%USERPROFILE%\\Documents\\Sports Interactive\\${folderName}\\${subfolder.replace(/\//g, '\\')}`;
  const macPath = `~/Library/Application Support/Sports Interactive/${folderName}/${subfolder}`;

  const currentPath = os === 'win' ? winPath : macPath;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleStep = (step: number) => {
    setActiveStep(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  return (
    <div className="bg-[#140c2b] rounded-2xl border border-violet-500/25 p-4 md:p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Folder size={18} />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-extrabold text-white font-display flex items-center gap-2">
              <span>Đường dẫn cài đặt 1-Click</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                PRO UX
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Tự động tính toán theo hệ điều hành & phiên bản FM</p>
          </div>
        </div>

        {compact && (
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-violet-300 hover:text-white p-1 rounded-lg hover:bg-violet-900/30 transition-colors"
          >
            <ChevronDown size={18} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3.5 pt-1">
          {/* OS Switcher Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-[#1c133a] rounded-xl border border-violet-500/20">
              <button
                type="button"
                onClick={() => setOs('win')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  os === 'win'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md border border-violet-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor size={14} />
                <span>Windows (PC)</span>
              </button>
              <button
                type="button"
                onClick={() => setOs('mac')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  os === 'mac'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md border border-violet-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple size={14} />
                <span>macOS</span>
              </button>
            </div>

            <span className="text-[11px] text-violet-300/80 font-medium">
              Mục tiêu: <strong className="text-cyan-300">{category}</strong> ({version || 'FM26'})
            </span>
          </div>

          {/* Path Display & Copy Button */}
          <div className="relative group">
            <div className="flex items-center justify-between gap-2 p-3 bg-[#0d071d] rounded-xl border border-violet-500/30 font-mono text-xs text-cyan-200 break-all select-all shadow-inner">
              <div className="flex items-center gap-2 overflow-hidden">
                <Terminal size={15} className="text-violet-400 shrink-0" />
                <span className="truncate">{currentPath}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-600/30 transition-all hover:scale-105 active:scale-95 border border-violet-400/30"
                title="Sao chép đường dẫn"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-300" />
                    <span className="text-emerald-300">Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} />
                Đã sao chép! Mở File Explorer / Finder và dán đường dẫn vào thanh địa chỉ.
              </p>
            )}
          </div>

          {/* 3-Step Interactive Verification Checklist */}
          <div className="bg-[#1b1238]/60 p-3.5 rounded-xl border border-violet-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-violet-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" /> 
                Quy trình cài đặt chuẩn (Bấm để đánh dấu hoàn thành)
              </span>
              <span className="text-[10px] text-slate-400">{activeStep.length}/3 bước</span>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 1, text: 'Giải nén file tải về vào đúng thư mục đường dẫn bên trên (tạo thư mục nếu chưa có).' },
                { id: 2, text: 'Vào game: Preferences (Tùy chọn) > Interface (Giao diện) > Bỏ chọn "Use caching".' },
                { id: 3, text: 'Bấm nút "Reload Skin (Tải lại giao diện)" để game nhận đồ họa / tactic mới.' }
              ].map(step => {
                const isDone = activeStep.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all ${
                      isDone 
                        ? 'bg-emerald-950/30 text-slate-200 border border-emerald-500/30 line-through opacity-80' 
                        : 'bg-[#130d27] text-slate-300 border border-violet-500/15 hover:border-violet-400/40'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                      isDone ? 'bg-emerald-500 text-black' : 'border border-violet-400 text-violet-300'
                    }`}>
                      {isDone ? '✓' : step.id}
                    </span>
                    <span className="leading-snug">{step.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
