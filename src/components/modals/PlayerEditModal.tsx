import { useState, type FormEvent } from 'react';
import { 
  X, 
  Save, 
  Star, 
  Shield, 
  Zap, 
  TrendingUp, 
  Plus, 
  UserCheck
} from 'lucide-react';
import type { PlayerProfile } from '../../data/playerDatabase';

interface PlayerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: PlayerProfile | null;
  onSave: (savedPlayer: PlayerProfile) => void;
}

const DEFAULT_ATTRIBUTES = {
  pace: 15,
  acceleration: 15,
  finishing: 14,
  passing: 14,
  dribbling: 15,
  vision: 14,
  composure: 14,
  workRate: 15,
  stamina: 14,
  tackling: 8
};

export default function PlayerEditModal({
  isOpen,
  onClose,
  playerToEdit,
  onSave
}: PlayerEditModalProps) {
  const isEditing = !!playerToEdit;

  // Form State initialized directly from playerToEdit or defaults
  const [name, setName] = useState(playerToEdit?.name || '');
  const [age, setAge] = useState<number>(playerToEdit?.age ?? 18);
  const [club, setClub] = useState(playerToEdit?.club || '');
  const [nationality, setNationality] = useState(playerToEdit?.nationality || 'Việt Nam');
  const [position, setPosition] = useState(playerToEdit?.position || 'ST');
  const [secondaryPositionsStr, setSecondaryPositionsStr] = useState(
    (playerToEdit?.secondaryPositions || (playerToEdit ? [] : ['AML', 'AMR'])).join(', ')
  );
  const [pa, setPa] = useState<number>(playerToEdit?.pa ?? 180);
  const [ca, setCa] = useState<number>(playerToEdit?.ca ?? 130);
  const [value, setValue] = useState(playerToEdit?.value || '€10M - €20M');
  const [wage, setWage] = useState(playerToEdit?.wage || '€20k/tuần');
  const [image, setImage] = useState(playerToEdit?.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80');
  const [tier, setTier] = useState<'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem'>(playerToEdit?.tier || 'Wonderkid');

  // Scout Section State
  const [scoutReport, setScoutReport] = useState(playerToEdit?.scoutReport || (playerToEdit ? '' : 'Tài năng trẻ đầy triển vọng trong FM26. Sở hữu phẩm chất kỹ thuật khéo léo và tốc độ bùng nổ, có tiềm năng trở thành trụ cột hàng đầu.'));
  const [role, setRole] = useState(playerToEdit?.role || 'Advanced Forward');
  const [foot, setFoot] = useState<'Trái' | 'Phải' | 'Cả hai'>(playerToEdit?.foot || 'Phải');
  const [strengths, setStrengths] = useState<string[]>(
    playerToEdit?.strengths && playerToEdit.strengths.length > 0 
      ? [...playerToEdit.strengths] 
      : ['Rê bóng khéo léo', 'Tốc độ bứt phá', 'Nhãn quan nhạy bén']
  );
  const [newStrengthInput, setNewStrengthInput] = useState('');
  const [weaknesses, setWeaknesses] = useState<string[]>(
    playerToEdit?.weaknesses && playerToEdit.weaknesses.length > 0 
      ? [...playerToEdit.weaknesses] 
      : ['Kinh nghiệm thi đấu', 'Tranh chấp bóng bổng']
  );
  const [newWeaknessInput, setNewWeaknessInput] = useState('');

  // Attributes State
  const [attributes, setAttributes] = useState(
    playerToEdit?.attributes ? { ...playerToEdit.attributes } : DEFAULT_ATTRIBUTES
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddStrength = () => {
    if (newStrengthInput.trim() && !strengths.includes(newStrengthInput.trim())) {
      setStrengths([...strengths, newStrengthInput.trim()]);
      setNewStrengthInput('');
    }
  };

  const handleRemoveStrength = (index: number) => {
    setStrengths(strengths.filter((_, idx) => idx !== index));
  };

  const handleAddWeakness = () => {
    if (newWeaknessInput.trim() && !weaknesses.includes(newWeaknessInput.trim())) {
      setWeaknesses([...weaknesses, newWeaknessInput.trim()]);
      setNewWeaknessInput('');
    }
  };

  const handleRemoveWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, idx) => idx !== index));
  };

  const handleAttributeChange = (key: keyof typeof DEFAULT_ATTRIBUTES, val: number) => {
    const clamped = Math.min(20, Math.max(1, isNaN(val) ? 1 : val));
    setAttributes(prev => ({ ...prev, [key]: clamped }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên cầu thủ');
      return;
    }
    if (!club.trim()) {
      setErrorMsg('Vui lòng nhập câu lạc bộ');
      return;
    }

    const secondaryPositions = secondaryPositionsStr
      .split(/[,/|-]/)
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const savedPlayer: PlayerProfile = {
      id: playerToEdit ? playerToEdit.id : `player-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      age: Number(age) || 18,
      club: club.trim(),
      nationality: nationality.trim() || 'Quốc tế',
      position: position.trim().toUpperCase(),
      secondaryPositions,
      pa: Number(pa) || 170,
      ca: Number(ca) || 120,
      value: value.trim() || '€10M',
      wage: wage.trim() || '€20k/tuần',
      image: image.trim() || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      role: role.trim() || 'Chủ công / Tiền đạo',
      foot,
      tier,
      scoutReport: scoutReport.trim() || 'Hồ sơ trinh sát chi tiết đang được cập nhật.',
      strengths: strengths.length > 0 ? strengths : ['Kỹ thuật cá nhân'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Kinh nghiệm đỉnh cao'],
      attributes
    };

    onSave(savedPlayer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#140c2d] border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-950/70 overflow-hidden my-6 text-slate-100 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-violet-500/20 bg-gradient-to-r from-[#1d113f] via-[#24154e] to-[#170e33] flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-700/30">
              <UserCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {isEditing ? `Sửa Cầu thủ & Báo cáo Scout: ${playerToEdit.name}` : 'Tạo Cầu thủ Mới & Lập Hồ sơ Scout'}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-600/30 border border-violet-400/30 text-cyan-300 font-bold">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-violet-300/70">
                {isEditing 
                  ? 'Chỉnh sửa toàn bộ thông tin chỉ số, tiềm năng PA/CA và báo cáo trinh sát của cầu thủ này.' 
                  : 'Nhập thông tin cầu thủ, bộ chỉ số kỹ thuật và báo cáo trinh sát chi tiết theo chuẩn FM26.'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* SECTION 1: BASIC INFO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-violet-500/20 pb-2">
              <Shield size={14} />
              <span>1. Thông tin Cầu thủ & Câu lạc bộ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Tên cầu thủ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Đình Bắc"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Tuổi *
                </label>
                <input
                  type="number"
                  min={14}
                  max={45}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Phân loại (Tier)
                </label>
                <select
                  value={tier}
                  onChange={e => setTier(e.target.value as 'Wonderkid' | 'World Class' | 'Bargain' | 'Hidden Gem')}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  <option value="Wonderkid">⭐ Thần đồng (Wonderkid)</option>
                  <option value="Bargain">💎 Món hời giá mềm (Bargain)</option>
                  <option value="Hidden Gem">🔍 Viên ngọc ẩn (Hidden Gem)</option>
                  <option value="World Class">👑 Đẳng cấp (World Class)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Câu lạc bộ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công an Hà Nội"
                  value={club}
                  onChange={e => setClub(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Quốc tịch
                </label>
                <input
                  type="text"
                  placeholder="VD: Việt Nam"
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Vị trí chính
                </label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none font-mono font-bold text-cyan-300"
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

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Vị trí phụ (cách nhau dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="VD: AML, AMC, AMR"
                  value={secondaryPositionsStr}
                  onChange={e => setSecondaryPositionsStr(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                Link ảnh chân dung đại diện (Avatar URL)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* SECTION 2: PA/CA & VALUES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-violet-500/20 pb-2">
              <Star size={14} />
              <span>2. Tiềm năng (PA/CA) & Giá trị chuyển nhượng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Tiềm năng (PA: 1-200)</span>
                  <span className="font-mono text-cyan-300 font-extrabold">{pa}/200</span>
                </label>
                <input
                  type="number"
                  min={50}
                  max={200}
                  value={pa}
                  onChange={e => setPa(Number(e.target.value))}
                  className="w-full bg-[#110924] border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wide mb-1 flex items-center justify-between">
                  <span>Chỉ số hiện tại (CA: 1-200)</span>
                  <span className="font-mono text-cyan-300 font-extrabold">{ca}/200</span>
                </label>
                <input
                  type="number"
                  min={40}
                  max={200}
                  value={ca}
                  onChange={e => setCa(Number(e.target.value))}
                  className="w-full bg-[#110924] border border-cyan-500/30 rounded-lg p-2.5 text-xs text-cyan-300 font-mono font-bold focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Giá chuyển nhượng ước tính
                </label>
                <input
                  type="text"
                  placeholder="VD: €15M - €25M"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Mức lương ước tính
                </label>
                <input
                  type="text"
                  placeholder="VD: €30k/tuần"
                  value={wage}
                  onChange={e => setWage(e.target.value)}
                  className="w-full bg-[#110924] border border-violet-500/25 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SCOUT REPORT & CHUYÊN SÂU (THE MAIN REQUEST) */}
          <div className="space-y-4 bg-[#110826] p-4 sm:p-5 rounded-2xl border border-violet-500/30">
            <div className="flex items-center justify-between border-b border-violet-500/25 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <TrendingUp size={15} />
                <span>3. Báo cáo Trinh sát (Scout Report & Phân tích chuyên sâu)</span>
              </div>
              <span className="text-[11px] text-violet-300/60 font-mono">Bản tin scout FM26</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Vai trò sở trường (Best Role)
                </label>
                <input
                  type="text"
                  placeholder="VD: Inside Forward / Inverted Winger"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-[#170c34] border border-violet-500/30 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide mb-1">
                  Chân thuận
                </label>
                <select
                  value={foot}
                  onChange={e => setFoot(e.target.value as 'Trái' | 'Phải' | 'Cả hai')}
                  className="w-full bg-[#170c34] border border-violet-500/30 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  <option value="Phải">Chân phải</option>
                  <option value="Trái">Chân trái</option>
                  <option value="Cả hai">Thuận cả hai chân</option>
                </select>
              </div>
            </div>

            {/* Scout Report Full Note */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wide">
                  Nhận xét & Đánh giá chi tiết của Trinh sát (Scout Summary) *
                </label>
                <span className="text-[10px] text-violet-400/80">Phân tích lối chơi, tiềm năng phát triển trong engine game</span>
              </div>
              <textarea
                rows={4}
                required
                placeholder="Nhập báo cáo trinh sát chi tiết: phong cách thi đấu, khả năng hòa nhập chiến thuật, so sánh với cầu thủ nổi tiếng, triển vọng tương lai trong FM26..."
                value={scoutReport}
                onChange={e => setScoutReport(e.target.value)}
                className="w-full bg-[#170c34] border border-violet-500/30 rounded-xl p-3 text-xs text-white placeholder:text-violet-300/30 focus:border-cyan-400 outline-none leading-relaxed"
              />
            </div>

            {/* Strengths & Weaknesses Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Strengths */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                  ✓ Điểm mạnh nổi bật (Strengths)
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thêm điểm mạnh (VD: Rê bóng ma thuật)..."
                    value={newStrengthInput}
                    onChange={e => setNewStrengthInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStrength();
                      }
                    }}
                    className="flex-grow bg-[#170c34] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-emerald-300/30 focus:border-emerald-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddStrength}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-[#140b2a] border border-emerald-500/20">
                  {strengths.map((s, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs font-medium"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStrength(idx)}
                        className="text-emerald-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {strengths.length === 0 && (
                    <span className="text-[11px] text-slate-500 italic">Chưa có điểm mạnh nào được thêm</span>
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                  ✗ Điểm cần lưu ý / Hạn chế (Weaknesses)
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thêm điểm yếu (VD: Thể lực cuối trận)..."
                    value={newWeaknessInput}
                    onChange={e => setNewWeaknessInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddWeakness();
                      }
                    }}
                    className="flex-grow bg-[#170c34] border border-rose-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-rose-300/30 focus:border-rose-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddWeakness}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-[#140b2a] border border-rose-500/20">
                  {weaknesses.map((w, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-medium"
                    >
                      <span>{w}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWeakness(idx)}
                        className="text-rose-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {weaknesses.length === 0 && (
                    <span className="text-[11px] text-slate-500 italic">Chưa có điểm yếu nào được thêm</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: KEY FM ATTRIBUTES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-violet-500/20 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Zap size={14} />
                <span>4. Bộ Chỉ số Kỹ thuật FM26 (Thang điểm 1 - 20)</span>
              </div>
              <span className="text-[11px] text-violet-300/60">&gt;=16: Xuất chúng · 14-15: Giỏi · &lt;14: Khá</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'pace', label: 'Tốc độ (Pace)' },
                { key: 'acceleration', label: 'Tăng tốc (Acc)' },
                { key: 'finishing', label: 'Dứt điểm (Fin)' },
                { key: 'passing', label: 'Chuyền bóng (Pas)' },
                { key: 'dribbling', label: 'Rê bóng (Drib)' },
                { key: 'vision', label: 'Tầm nhìn (Vis)' },
                { key: 'composure', label: 'Bình tĩnh (Cmp)' },
                { key: 'workRate', label: 'Chăm chỉ (WR)' },
                { key: 'stamina', label: 'Thể lực (Sta)' },
                { key: 'tackling', label: 'Tranh chấp (Tck)' }
              ].map(attr => {
                const k = attr.key as keyof typeof DEFAULT_ATTRIBUTES;
                const val = attributes[k];
                return (
                  <div key={k} className="bg-[#120a26] p-2.5 rounded-xl border border-violet-500/20 space-y-1">
                    <label className="block text-[10px] font-bold text-violet-300 uppercase truncate">
                      {attr.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={val}
                        onChange={e => handleAttributeChange(k, Number(e.target.value))}
                        className={`w-full bg-[#180f33] border rounded-lg p-1.5 text-center font-mono font-bold text-sm outline-none ${
                          val >= 16 
                            ? 'border-cyan-400 text-cyan-300' 
                            : val >= 14 
                              ? 'border-emerald-500/40 text-emerald-300' 
                              : 'border-violet-500/20 text-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-violet-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Save size={16} />
              <span>{isEditing ? 'Lưu thay đổi cầu thủ & Scout' : 'Tạo cầu thủ vào Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
