import { useState } from 'react';
import { 
  Copy, Check, Folder, Monitor, Apple, Terminal, 
  CheckCircle2, Sparkles, ChevronDown, 
  Layers, HardDrive, HelpCircle, ShieldAlert
} from 'lucide-react';
import { type Category, type GameVersion } from '../types';
import { sanitizeGameVersion } from '../utils';

interface InstallPathHelperProps {
  category?: Category | string;
  version?: GameVersion | string;
  compact?: boolean;
}

export default function InstallPathHelper({ 
  category = 'Graphics', 
  version = 'FM26', 
  compact = false 
}: InstallPathHelperProps) {
  const [os, setOs] = useState<'win' | 'mac'>('win');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number[]>([1]);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Dành riêng cho Skin FM26 (đổi engine Unity)
  const [fm26SkinMethod, setFm26SkinMethod] = useState<'manager' | 'manual'>('manager');
  const [winPlatform, setWinPlatform] = useState<'steam' | 'xbox'>('steam');

  const normalizedVersion = sanitizeGameVersion(version) || 'FM26';
  const isFm26 = normalizedVersion === 'FM26';
  const isSkin = (category || '').toLowerCase().includes('skin') || (category || '').toLowerCase().includes('giao diện');

  // Chuẩn hóa tên thư mục theo năm FM
  const getFmFolderYear = (ver: string) => {
    if (ver === 'FM26') return 'Football Manager 2026';
    if (ver === 'FM24') return 'Football Manager 2024';
    if (ver === 'FM23') return 'Football Manager 2023';
    return 'Football Manager 2024';
  };

  // Xác định thư mục con tài liệu
  const getSubfolder = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('face')) return 'graphics/faces';
    if (c.includes('logo')) return 'graphics/logos';
    if (c.includes('kit')) return 'graphics/kits';
    if (c.includes('tactic') || c.includes('chiến thuật')) return 'tactics';
    if (c.includes('database') || c.includes('dữ liệu') || c.includes('editor')) return 'editor data';
    if (c.includes('skin') || c.includes('giao diện')) return 'skins';
    if (c.includes('view') || c.includes('shortlist')) return 'views';
    if (c.includes('việt hóa') || c.includes('ngôn ngữ')) return 'languages';
    return 'graphics';
  };

  const folderYear = getFmFolderYear(normalizedVersion);
  const subfolder = getSubfolder(category);

  // Đường dẫn Windows tiêu chuẩn (Documents)
  const winDocPath = `%USERPROFILE%\\Documents\\Sports Interactive\\${folderYear}\\${subfolder.replace(/\//g, '\\')}`;
  
  // Đường dẫn macOS tiêu chuẩn
  const macDocPath = `~/Library/Application Support/Sports Interactive/${folderYear}/${subfolder}`;

  // Đường dẫn FM26 Skin thủ công trên Windows
  const fm26SteamPath = `C:\\Program Files (x86)\\Steam\\steamapps\\common\\Football Manager 2026\\fm_Data\\StreamingAssets\\aa\\StandaloneWindows64\\`;
  const fm26XboxPath = `XboxGames\\Football Manager 2026\\Content\\fm_Data\\StreamingAssets\\aa\\StandaloneWindows64\\`;

  // Quyết định đường dẫn hiển thị hiện tại
  let currentPath = '';
  if (isFm26 && isSkin && os === 'win' && fm26SkinMethod === 'manual') {
    currentPath = winPlatform === 'steam' ? fm26SteamPath : fm26XboxPath;
  } else if (os === 'win') {
    currentPath = winDocPath;
  } else {
    currentPath = macDocPath;
  }

  const handleCopy = (textToCopy?: string) => {
    const target = textToCopy || currentPath;
    if (!target) return;
    navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleStep = (step: number) => {
    setActiveStep(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  return (
    <div className="bg-[#140c2b] rounded-2xl border border-violet-500/25 p-4 md:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 shadow-inner">
            <Folder size={18} />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-extrabold text-white font-display flex items-center gap-2">
              <span>Trợ lý đường dẫn cài đặt thông minh</span>
              {isFm26 && isSkin ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse">
                  FM26 SKIN ENGINE
                </span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  1-CLICK COPY
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isFm26 && isSkin 
                ? 'FM26 đổi mới engine giao diện: áp dụng cơ chế quản lý skin đặc biệt'
                : 'Tự động tính toán theo hệ điều hành & cấu trúc thư mục Football Manager'}
            </p>
          </div>
        </div>

        {compact && (
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-violet-300 hover:text-white p-1 rounded-lg hover:bg-violet-900/30 transition-colors"
            title="Thu gọn / Mở rộng"
          >
            <ChevronDown size={18} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Hệ điều hành Switcher */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-violet-500/15">
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

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tài nguyên:</span>
              <span className="px-2 py-0.5 rounded-md bg-[#221644] text-cyan-300 font-bold border border-violet-500/30">
                {category}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#221644] text-violet-300 font-bold border border-violet-500/30">
                {normalizedVersion}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TRƯỜNG HỢP ĐẶC BIỆT: SKIN FM26 (Khác biệt cốt lõi)        */}
          {/* ======================================================== */}
          {isFm26 && isSkin && os === 'win' ? (
            <div className="space-y-3.5 bg-gradient-to-br from-[#1b103b] to-[#120a27] p-4 rounded-2xl border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Sparkles size={15} className="text-amber-400" />
                  <span>Chọn phương thức cài Skin cho FM26:</span>
                </div>

                {/* Switcher Cách 1 vs Cách 2 */}
                <div className="flex items-center gap-1 bg-[#0f0722] p-1 rounded-xl border border-amber-500/20 text-xs">
                  <button
                    type="button"
                    onClick={() => setFm26SkinMethod('manager')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      fm26SkinMethod === 'manager'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cách 1: FM Skins Manager (Khuyên dùng)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFm26SkinMethod('manual')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      fm26SkinMethod === 'manual'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cách 2: Ghi đè thủ công
                  </button>
                </div>
              </div>

              {/* Cách 1: FM Skins Manager */}
              {fm26SkinMethod === 'manager' ? (
                <div className="space-y-3 bg-[#0c061d] p-3.5 rounded-xl border border-amber-500/20">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg shrink-0 mt-0.5">
                      <Layers size={16} />
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed">
                      <p className="font-bold text-white mb-1">
                        Sử dụng tiện ích <span className="text-amber-300">FM Skins Manager</span> (Từ FM Scout / Sortitoutsi)
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Công cụ tự động quét và nhận diện đường dẫn cài đặt game FM26 trên máy tính.</li>
                        <li>Hỗ trợ <strong>tự động sao lưu file gốc</strong> tránh rủi ro hỏng game.</li>
                        <li>Hoán đổi các bộ skin (styles, bundle) chỉ bằng <strong>1 thao tác bật/tắt (Toggle ON/OFF)</strong>.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-amber-200/70">
                      💡 Khuyến nghị tốt nhất cho người chơi FM26 để không cần chép đè file hệ thống bằng tay.
                    </span>
                  </div>
                </div>
              ) : (
                /* Cách 2: Cài thủ công ghi đè */
                <div className="space-y-3 bg-[#0c061d] p-3.5 rounded-xl border border-violet-500/30">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <HardDrive size={14} className="text-cyan-400" />
                      Nền tảng cài đặt FM26 của bạn:
                    </span>
                    <div className="flex items-center gap-1 bg-[#180f33] p-1 rounded-lg border border-violet-500/20 text-xs">
                      <button
                        type="button"
                        onClick={() => setWinPlatform('steam')}
                        className={`px-2.5 py-1 rounded font-bold ${
                          winPlatform === 'steam'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Steam
                      </button>
                      <button
                        type="button"
                        onClick={() => setWinPlatform('xbox')}
                        className={`px-2.5 py-1 rounded font-bold ${
                          winPlatform === 'xbox'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Xbox / Game Pass
                      </button>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-2 text-rose-200 text-xs">
                    <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>QUAN TRỌNG:</strong> Bạn <strong>phải sao lưu thư mục StandaloneWindows64</strong> ra một vị trí an toàn trước khi chép đè để có thể khôi phục game gốc bất cứ lúc nào!
                    </span>
                  </div>

                  {/* Path Display */}
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-[#080414] rounded-xl border border-violet-500/30 font-mono text-xs text-cyan-300 break-all select-all">
                    <span className="truncate">{currentPath}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentPath)}
                      className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md border border-violet-400/30"
                    >
                      {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                      <span>{copied ? 'Đã chép!' : 'Chép'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ======================================================== */
            /* TRƯỜNG HỢP TIÊU CHUẨN (Graphics, Tactics, Database, FM24 Skin) */
            /* ======================================================== */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Terminal size={14} className="text-violet-400" />
                  Đường dẫn thư mục cài đặt ({os === 'win' ? 'Windows' : 'macOS'}):
                </span>
                {os === 'mac' && (
                  <span className="text-[11px] text-cyan-300 font-mono bg-[#1c123b] px-2 py-0.5 rounded border border-violet-500/20">
                    Phím tắt: ⌘ + Shift + G
                  </span>
                )}
              </div>

              {/* Path Display & Copy Button */}
              <div className="flex items-center justify-between gap-2 p-3 bg-[#0d071d] rounded-xl border border-violet-500/30 font-mono text-xs text-cyan-200 break-all select-all shadow-inner">
                <span className="truncate">{currentPath}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(currentPath)}
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
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pt-0.5">
                  <CheckCircle2 size={12} />
                  {os === 'win' 
                    ? 'Đã sao chép! Mở File Explorer và dán vào thanh địa chỉ.'
                    : 'Đã sao chép! Mở Finder > nhấn Command + Shift + G > dán đường dẫn.'}
                </p>
              )}
            </div>
          )}

          {/* Mẹo vàng: Tạo thư mục mới nếu chưa có */}
          <div className="bg-[#100926] p-2.5 rounded-xl border border-violet-500/20 text-xs text-slate-300 flex items-center gap-2">
            <HelpCircle size={15} className="text-cyan-400 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Nếu bất kỳ thư mục con nào (<code className="text-cyan-300 font-mono">{subfolder}</code>) chưa có sẵn, bạn chỉ cần <strong>tạo thư mục mới</strong> với đúng tên đó.
            </span>
          </div>

          {/* ======================================================== */}
          {/* QUY TRÌNH CHECKLIST 3 BƯỚC ĐƯỢC TÙY BIẾN CHÍNH XÁC     */}
          {/* ======================================================== */}
          <div className="bg-[#1b1238]/70 p-3.5 rounded-xl border border-violet-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-violet-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" /> 
                Quy trình cài đặt & kích hoạt (Nhấn để đánh dấu đã làm)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{activeStep.length}/3 hoàn thành</span>
            </div>

            <div className="space-y-1.5">
              {(isFm26 && isSkin && os === 'win') ? (
                /* Checklist FM26 Skin Windows */
                [
                  { 
                    id: 1, 
                    text: fm26SkinMethod === 'manager'
                      ? 'Tải và mở tiện ích FM Skins Manager (tự nhận diện đường dẫn cài game).'
                      : `Sao lưu thư mục StandaloneWindows64, sau đó giải nén và chép đè file mod skin (.asset/.bundle) vào đúng thư mục.`
                  },
                  { 
                    id: 2, 
                    text: fm26SkinMethod === 'manager'
                      ? 'Bật (Toggle ON) bộ skin mong muốn trong FM Skins Manager.'
                      : 'Đảm bảo các file bundle/asset đã được ghi đè hoàn chỉnh vào game.'
                  },
                  { 
                    id: 3, 
                    text: 'Khởi động Football Manager 2026 và thưởng thức giao diện mới!' 
                  }
                ].map(step => renderChecklistStep(step))
              ) : isSkin ? (
                /* Checklist Skin FM24 / FM23 */
                [
                  { 
                    id: 1, 
                    text: `Giải nén toàn bộ thư mục skin vào đúng thư mục: ${os === 'win' ? 'Documents\\...\\skins\\' : '~/Library/.../skins/'} (tự tạo thư mục nếu chưa có).` 
                  },
                  { 
                    id: 2, 
                    text: 'Vào game: Preferences (Tùy chọn) → Advanced → Interface → tại mục Skin, chọn skin vừa cài.' 
                  },
                  { 
                    id: 3, 
                    text: 'Bỏ tích "Use caching", tích chọn "Reload skin when confirming changes in Preferences" → nhấn Confirm / Reload Skin.' 
                  }
                ].map(step => renderChecklistStep(step))
              ) : (
                /* Checklist Graphics / Tactics / Database (Cả FM26 và FM24) */
                [
                  { 
                    id: 1, 
                    text: `Giải nén file tải về vào đúng thư mục: ${subfolder} (tạo mới nếu chưa có thư mục con này).` 
                  },
                  { 
                    id: 2, 
                    text: os === 'mac' 
                      ? 'Mẹo macOS: Mở Finder → nhấn tổ hợp phím Command + Shift + G → dán đường dẫn đã sao chép để truy cập nhanh.' 
                      : 'Mở game: vào mục Preferences (Tùy chọn) → Advanced → Interface (Giao diện).' 
                  },
                  { 
                    id: 3, 
                    text: 'Bỏ tích "Use caching" (Bộ nhớ đệm) → Bấm nút "Reload Skin" (Tải lại giao diện) để game nhận tài nguyên mới.' 
                  }
                ].map(step => renderChecklistStep(step))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderChecklistStep(step: { id: number; text: string }) {
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
  }
}
