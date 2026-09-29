import { useState, useRef, type ChangeEvent } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Plus, 
  Download, 
  Trash2, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  parseExcelOrCsvData, 
  downloadSampleCsvTemplate, 
  exportPlayersToFile 
} from '../../utils/excelImport';
import type { PlayerProfile } from '../../data/playerDatabase';

interface DatabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayers: PlayerProfile[];
  onImportPlayers: (newPlayers: PlayerProfile[], mode: 'append' | 'replace') => void;
  onAddSinglePlayer: (player: PlayerProfile) => void;
  onResetToDefault: () => void;
}

export default function DatabaseManagerModal({
  isOpen,
  onClose,
  currentPlayers,
  onImportPlayers,
  onAddSinglePlayer,
  onResetToDefault
}: DatabaseManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'manual' | 'manage'>('import');
  
  // File Import state
  const [fileName, setFileName] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<PlayerProfile[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [manualForm, setManualForm] = useState<Partial<PlayerProfile>>({
    name: '',
    age: 18,
    club: '',
    nationality: 'Việt Nam',
    position: 'ST',
    secondaryPositions: [],
    pa: 175,
    ca: 130,
    value: '€10M - €20M',
    wage: '€20k/tuần',
    role: 'Advanced Forward',
    foot: 'Phải',
    tier: 'Wonderkid',
    scoutReport: '',
    strengths: ['Tốc độ cao', 'Dứt điểm sắc bén'],
    weaknesses: ['Thể lực'],
    attributes: {
      pace: 16,
      acceleration: 16,
      finishing: 15,
      passing: 14,
      dribbling: 15,
      vision: 13,
      composure: 14,
      workRate: 15,
      stamina: 14,
      tackling: 8
    }
  });
  const [manualError, setManualError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setParseErrors([]);
    setImportSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const result = parseExcelOrCsvData(buffer);
        setParsedPreview(result.players);
        setParseErrors(result.errors);
      } catch (err) {
        console.error('Lỗi đọc file Excel/CSV:', err);
        setParseErrors(['Không thể đọc định dạng file này. Vui lòng đảm bảo file là .xlsx, .xls hoặc .csv']);
        setParsedPreview([]);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setParseErrors(['Lỗi khi đọc file']);
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImportPlayers(parsedPreview, importMode);
    setImportSuccessMsg(`Đã nhập thành công ${parsedPreview.length} cầu thủ vào Database!`);
    setTimeout(() => {
      setParsedPreview([]);
      setFileName('');
      setImportSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name?.trim()) {
      setManualError('Vui lòng nhập tên cầu thủ');
      return;
    }
    if (!manualForm.club?.trim()) {
      setManualError('Vui lòng nhập câu lạc bộ');
      return;
    }

    const newPlayer: PlayerProfile = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: manualForm.name.trim(),
      age: Number(manualForm.age) || 18,
      club: manualForm.club.trim(),
      nationality: manualForm.nationality?.trim() || 'Quốc tế',
      position: manualForm.position || 'ST',
      secondaryPositions: manualForm.secondaryPositions || [],
      pa: Number(manualForm.pa) || 170,
      ca: Number(manualForm.ca) || 130,
      value: manualForm.value?.trim() || '€10M',
      wage: manualForm.wage?.trim() || '€15k/tuần',
      role: manualForm.role?.trim() || 'Tiền đạo chủ lực',
      foot: (manualForm.foot as 'Trái' | 'Phải' | 'Cả hai') || 'Phải',
      tier: (manualForm.tier as 'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem') || 'Wonderkid',
      image: manualForm.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      scoutReport: manualForm.scoutReport?.trim() || `Cầu thủ triển vọng được thêm vào hệ thống tuyển trạch FM26.`,
      strengths: manualForm.strengths || ['Kỹ thuật cá nhân'],
      weaknesses: manualForm.weaknesses || ['Kinh nghiệm đỉnh cao'],
      attributes: manualForm.attributes || {
        pace: 15,
        acceleration: 15,
        finishing: 14,
        passing: 14,
        dribbling: 15,
        vision: 13,
        composure: 14,
        workRate: 15,
        stamina: 14,
        tackling: 8
      }
    };

    onAddSinglePlayer(newPlayer);
    setImportSuccessMsg(`Đã thêm thành công cầu thủ ${newPlayer.name}!`);
    setTimeout(() => {
      setImportSuccessMsg('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#140c2d] border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-950/60 overflow-hidden my-6 text-slate-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-violet-500/20 bg-gradient-to-r from-[#1c113d] via-[#24154e] to-[#170e33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <FileSpreadsheet className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
                <span>Tạo & Quản lý Database Cầu thủ</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Excel & CSV
                </span>
              </h3>
              <p className="text-xs text-violet-300/70">
                Thêm danh sách cầu thủ, sao chép dữ liệu trinh sát hoặc tải lên file dữ liệu FM của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-violet-500/20 bg-[#120a26]">
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'import'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-violet-300/60 hover:text-white'
            }`}
          >
            <Upload size={16} />
            <span>Nhập File Excel / CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'manual'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-violet-300/60 hover:text-white'
            }`}
          >
            <Plus size={16} />
            <span>Thêm thủ công</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'manage'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-violet-300/60 hover:text-white'
            }`}
          >
            <Download size={16} />
            <span>Xuất file & Dữ liệu ({currentPlayers.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
          
          {importSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
              <Check size={16} />
              <span>{importSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: IMPORT EXCEL / CSV */}
          {activeTab === 'import' && (
            <div className="space-y-5">
              {/* File upload drag & drop area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-violet-500/30 hover:border-cyan-400/60 bg-[#160d33]/60 hover:bg-[#1a0f3d] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 text-cyan-300 transition-transform border border-violet-500/30">
                  <Upload size={24} />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  Nhấp để tải lên hoặc kéo thả file Excel / CSV vào đây
                </h4>
                <p className="text-xs text-violet-300/60 max-w-md mx-auto mb-3">
                  Hỗ trợ các định dạng <strong>.xlsx, .xls, .csv</strong>. Tự động nhận diện các cột Tên, Tuổi, CLB, Quốc tịch, Vị trí, PA, CA, v.v.
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30 font-medium">
                  <Sparkles size={13} />
                  <span>{fileName ? `File đã chọn: ${fileName}` : 'Chọn file từ máy tính của bạn'}</span>
                </div>
              </div>

              {/* Sample template download button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#1a1038] border border-violet-500/20 text-xs">
                <div className="flex items-center gap-2 text-violet-200">
                  <FileSpreadsheet size={16} className="text-cyan-400 shrink-0" />
                  <span>Chưa có file mẫu? Tải file mẫu chuẩn bị sẵn đầy đủ các cột dữ liệu:</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleCsvTemplate}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Download size={14} />
                  <span>Tải file mẫu Excel (.csv)</span>
                </button>
              </div>

              {/* Parsing status & error warnings */}
              {isProcessing && (
                <div className="text-center py-6 text-sm text-cyan-300 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang phân tích cấu trúc dữ liệu Excel/CSV...</span>
                </div>
              )}

              {parseErrors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertCircle size={15} />
                    <span>Lưu ý khi đọc file:</span>
                  </div>
                  {parseErrors.slice(0, 4).map((err, i) => (
                    <div key={i} className="pl-5 text-slate-300">• {err}</div>
                  ))}
                  {parseErrors.length > 4 && (
                    <div className="pl-5 text-violet-300/70 font-italic">và {parseErrors.length - 4} cảnh báo khác...</div>
                  )}
                </div>
              )}

              {/* Preview table of parsed players */}
              {parsedPreview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-400" />
                      <span>Tìm thấy {parsedPreview.length} cầu thủ hợp lệ:</span>
                    </span>

                    {/* Mode selection: Append or Replace */}
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="text-violet-600 focus:ring-violet-500"
                        />
                        <span>Thêm nối tiếp</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-rose-500 focus:ring-rose-400"
                        />
                        <span>Ghi đè toàn bộ ({currentPlayers.length} mục)</span>
                      </label>
                    </div>
                  </div>

                  {/* Table preview */}
                  <div className="overflow-x-auto max-h-56 rounded-xl border border-violet-500/20 bg-[#100824]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#180e36] text-violet-300/80 sticky top-0 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-2.5">Cầu thủ</th>
                          <th className="p-2.5">Tuổi</th>
                          <th className="p-2.5">Vị trí</th>
                          <th className="p-2.5">CLB</th>
                          <th className="p-2.5">Quốc tịch</th>
                          <th className="p-2.5">PA</th>
                          <th className="p-2.5">CA</th>
                          <th className="p-2.5">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-violet-500/10">
                        {parsedPreview.slice(0, 10).map((p, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-2.5 font-bold text-white whitespace-nowrap">{p.name}</td>
                            <td className="p-2.5 text-slate-300">{p.age}</td>
                            <td className="p-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-violet-900/60 border border-violet-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                                {p.position}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-300 whitespace-nowrap">{p.club}</td>
                            <td className="p-2.5 text-slate-400 whitespace-nowrap">{p.nationality}</td>
                            <td className="p-2.5 font-bold text-emerald-400 font-mono">{p.pa}</td>
                            <td className="p-2.5 text-violet-300 font-mono">{p.ca}</td>
                            <td className="p-2.5 text-slate-300 whitespace-nowrap">{p.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedPreview.length > 10 && (
                      <div className="p-2 text-center text-[11px] text-violet-300/60 bg-[#160c33]">
                        ... và còn {parsedPreview.length - 10} cầu thủ nữa.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setParsedPreview([]);
                        setFileName('');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/30 flex items-center gap-1.5"
                    >
                      <Check size={15} />
                      <span>Xác nhận nhập ({parsedPreview.length} cầu thủ)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANUAL ADD SINGLE PLAYER */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {manualError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {manualError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Tên cầu thủ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thái Sơn"
                    value={manualForm.name}
                    onChange={e => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Tuổi *
                  </label>
                  <input
                    type="number"
                    min={14}
                    max={50}
                    value={manualForm.age}
                    onChange={e => setManualForm({ ...manualForm, age: Number(e.target.value) })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Club */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Câu lạc bộ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đông Á Thanh Hóa"
                    value={manualForm.club}
                    onChange={e => setManualForm({ ...manualForm, club: e.target.value })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Quốc tịch
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Việt Nam"
                    value={manualForm.nationality}
                    onChange={e => setManualForm({ ...manualForm, nationality: e.target.value })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Vị trí chính
                  </label>
                  <select
                    value={manualForm.position}
                    onChange={e => setManualForm({ ...manualForm, position: e.target.value })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="ST">Tiền đạo cắm (ST)</option>
                    <option value="AMR">Tiền đạo cánh phải (AMR)</option>
                    <option value="AML">Tiền đạo cánh trái (AML)</option>
                    <option value="AMC">Tiền vệ tấn công (AMC)</option>
                    <option value="MC">Tiền vệ trung tâm (MC)</option>
                    <option value="DM">Tiền vệ phòng ngự (DM)</option>
                    <option value="DR">Hậu vệ phải (DR/WBR)</option>
                    <option value="DL">Hậu vệ trái (DL/WBL)</option>
                    <option value="DC">Trung vệ (DC)</option>
                    <option value="GK">Thủ môn (GK)</option>
                  </select>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Phân loại cầu thủ
                  </label>
                  <select
                    value={manualForm.tier}
                    onChange={e => setManualForm({ ...manualForm, tier: e.target.value as 'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem' })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Wonderkid">⭐ Thần đồng (Wonderkid)</option>
                    <option value="Bargain">💎 Món hời giá rẻ (Bargain)</option>
                    <option value="Hidden Gem">🔍 Viên ngọc ẩn (Hidden Gem)</option>
                    <option value="World Class">👑 Đẳng cấp thế giới (World Class)</option>
                  </select>
                </div>

                {/* PA & CA */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wide mb-1">
                    Tiềm năng (PA: 1-200)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={200}
                    value={manualForm.pa}
                    onChange={e => setManualForm({ ...manualForm, pa: Number(e.target.value) })}
                    className="w-full bg-[#120a26] border border-emerald-500/30 rounded-lg p-2 text-xs text-emerald-300 font-mono font-bold focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-wide mb-1">
                    Hiện tại (CA: 1-200)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={200}
                    value={manualForm.ca}
                    onChange={e => setManualForm({ ...manualForm, ca: Number(e.target.value) })}
                    className="w-full bg-[#120a26] border border-cyan-500/30 rounded-lg p-2 text-xs text-cyan-300 font-mono font-bold focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                    Giá chuyển nhượng ước tính
                  </label>
                  <input
                    type="text"
                    placeholder="VD: €5M - €10M"
                    value={manualForm.value}
                    onChange={e => setManualForm({ ...manualForm, value: e.target.value })}
                    className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Scout Report Note */}
              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Báo cáo / Nhận xét của Trinh sát (Scout Report)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú đánh giá phong cách chơi, tiềm năng phát triển trong Football Manager..."
                  value={manualForm.scoutReport}
                  onChange={e => setManualForm({ ...manualForm, scoutReport: e.target.value })}
                  className="w-full bg-[#120a26] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-violet-500/20">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-md shadow-violet-700/30 flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Lưu cầu thủ vào Database</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MANAGE & EXPORT */}
          {activeTab === 'manage' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#160d33] border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Cơ sở dữ liệu hiện tại đang có: {currentPlayers.length} cầu thủ
                  </h4>
                  <p className="text-xs text-violet-300/70">
                    Bạn có thể xuất toàn bộ danh sách này sang định dạng Excel (.xlsx) hoặc CSV (.csv) để lưu trữ hoặc dùng trong game.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => exportPlayersToFile(currentPlayers, 'csv')}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
                  >
                    <Download size={14} />
                    <span>Xuất CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => exportPlayersToFile(currentPlayers, 'xlsx')}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Xuất Excel (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Reset to Default FM26 Database */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                    <RotateCcw size={15} />
                    <span>Khôi phục Database mẫu gốc FM26</span>
                  </h4>
                  <p className="text-xs text-rose-200/70">
                    Thao tác này sẽ đặt lại danh sách về các siêu thần đồng FM26 mặc định (Yamal, Endrick, Estêvão, Mastantuono, Cubarsí, v.v.).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetToDefault();
                    setImportSuccessMsg('Đã khôi phục dữ liệu Wonderkids FM26 mặc định!');
                    setTimeout(() => {
                      setImportSuccessMsg('');
                      onClose();
                    }, 1000);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-rose-700/30 whitespace-nowrap shrink-0"
                >
                  <Trash2 size={14} />
                  <span>Khôi phục mặc định</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
