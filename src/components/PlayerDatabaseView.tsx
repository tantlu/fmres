import { useState, useMemo } from 'react';
import { Search, Star, Zap, TrendingUp, X, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { FM26_PLAYERS, type PlayerProfile } from '../data/playerDatabase';

export default function PlayerDatabaseView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [activePlayerModal, setActivePlayerModal] = useState<PlayerProfile | null>(null);

  const positions = [
    { label: 'Tất cả vị trí', value: 'All' },
    { label: 'Tiền đạo (ST)', value: 'ST' },
    { label: 'Cánh (AMR/AML)', value: 'WING' },
    { label: 'Tiền vệ (MC/AMC/DM)', value: 'MID' },
    { label: 'Hậu vệ (DC/DL/DR)', value: 'DEF' }
  ];

  const tiers = [
    { label: 'Tất cả phân loại', value: 'All' },
    { label: '⭐ Thần đồng (Wonderkid)', value: 'Wonderkid' },
    { label: '💎 Món hời giá mềm (Bargain)', value: 'Bargain' },
    { label: '🔍 Viên ngọc ẩn (Hidden Gem)', value: 'Hidden Gem' }
  ];

  const filteredPlayers = useMemo(() => {
    return FM26_PLAYERS.filter(player => {
      const matchesSearch = 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTier = selectedTier === 'All' || player.tier === selectedTier;

      const matchesPos = (() => {
        if (selectedPosition === 'All') return true;
        if (selectedPosition === 'ST') return player.position === 'ST';
        if (selectedPosition === 'WING') return player.position === 'AMR' || player.position === 'AML';
        if (selectedPosition === 'MID') return player.position === 'AMC' || player.position === 'MC' || player.position === 'DM';
        if (selectedPosition === 'DEF') return player.position === 'DC' || player.position === 'DR' || player.position === 'DL';
        return true;
      })();

      return matchesSearch && matchesTier && matchesPos;
    });
  }, [searchTerm, selectedPosition, selectedTier]);

  return (
    <section className="space-y-6">
      {/* Header banner */}
      <div className="relative rounded-2xl overflow-hidden border border-violet-500/25 bg-gradient-to-r from-[#1b103b] via-[#21144a] to-[#160d30] p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Sparkles size={14} />
            <span>FM26 Scouting Network</span>
            <span aria-hidden="true">·</span>
            <span className="text-violet-300">Cơ sở dữ liệu thần đồng & cầu thủ</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight mb-2">
            Database Cầu thủ & Wonderkids FM26
          </h2>
          <p className="text-sm text-violet-200/80 leading-relaxed">
            Tuyển tập danh sách cầu thủ trẻ tiềm năng nhất (PA 180+), các món hời chuyển nhượng giá rẻ và báo cáo trinh sát chi tiết giúp bạn xây dựng đế chế thống trị trong Football Manager 2026.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#191035]/90 border border-violet-500/20 rounded-xl p-4 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-grow">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300/60" />
            <input
              type="text"
              placeholder="Tìm theo tên cầu thủ, câu lạc bộ, quốc tịch (Yamal, Endrick, Real Madrid...)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#110924] border border-violet-500/25 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder:text-violet-300/40 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Position Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {positions.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedPosition(p.value)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedPosition === p.value
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#120a26] text-violet-200/70 hover:text-white hover:bg-violet-900/40 border border-violet-500/15'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier Sub-filters */}
        <div className="flex items-center justify-between pt-2 border-t border-violet-500/15 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-violet-300/60 flex items-center gap-1 mr-1">
              <Filter size={12} /> Lọc danh hiệu:
            </span>
            {tiers.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedTier(t.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedTier === t.value
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-violet-300/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-violet-300/70 font-mono text-xs">
            Tìm thấy <strong className="text-cyan-300">{filteredPlayers.length}</strong> cầu thủ
          </div>
        </div>
      </div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlayers.map(player => {
          return (
            <div
              key={player.id}
              onClick={() => setActivePlayerModal(player)}
              className="group cursor-pointer rounded-xl bg-[#191035]/85 hover:bg-[#201544] border border-violet-500/20 hover:border-cyan-400/50 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-violet-600/20 flex flex-col justify-between"
            >
              {/* Card Top */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-violet-950 border border-violet-500/30 shrink-0 relative">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/100x100/1e123d/8b5cf6?text=FM26';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-black text-base text-white group-hover:text-cyan-300 transition-colors">
                          {player.name}
                        </h3>
                        <span className="text-xs text-violet-300/60">({player.age} tuổi)</span>
                      </div>
                      <div className="text-xs text-violet-300/70 font-medium">
                        {player.club} · {player.nationality}
                      </div>
                    </div>
                  </div>

                  {/* Position Badge */}
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black font-mono shadow-sm ${
                    player.position === 'ST' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : player.position.includes('AM') || player.position.includes('W')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : player.position.includes('M')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {player.position}
                  </span>
                </div>

                {/* PA Rating Bar */}
                <div className="bg-[#120a26] p-2.5 rounded-lg border border-violet-500/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Star size={13} fill="currentColor" />
                    <span className="font-bold">PA: {player.pa}</span>
                    <span className="text-[11px] text-violet-300/60 font-mono">(CA: {player.ca})</span>
                  </div>
                  <div className="text-violet-300/80 font-mono font-medium">
                    Giá: <strong className="text-white">{player.value}</strong>
                  </div>
                </div>

                {/* Attributes Mini-Bar */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                  <div className="bg-[#120a26] p-1.5 rounded border border-violet-500/15">
                    <span className="text-violet-300/60 block text-[9px] uppercase">Tốc độ</span>
                    <strong className="text-cyan-300 text-xs">{player.attributes.pace}</strong>
                  </div>
                  <div className="bg-[#120a26] p-1.5 rounded border border-violet-500/15">
                    <span className="text-violet-300/60 block text-[9px] uppercase">Chuyền</span>
                    <strong className="text-violet-200 text-xs">{player.attributes.passing}</strong>
                  </div>
                  <div className="bg-[#120a26] p-1.5 rounded border border-violet-500/15">
                    <span className="text-violet-300/60 block text-[9px] uppercase">Dứt điểm</span>
                    <strong className="text-rose-300 text-xs">{player.attributes.finishing}</strong>
                  </div>
                </div>

                {/* Short Role Excerpt */}
                <p className="text-xs text-violet-200/70 line-clamp-2 leading-relaxed">
                  {player.scoutReport}
                </p>
              </div>

              {/* Card Footer */}
              <div className="p-3 sm:px-5 bg-[#140b2b] border-t border-violet-500/15 flex items-center justify-between text-xs">
                <span className="text-violet-400 font-medium text-[11px]">
                  {player.role}
                </span>
                <span className="font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Hồ sơ scout <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Detail Scouting Modal */}
      {activePlayerModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePlayerModal(null)}
        >
          <div 
            className="bg-[#191035] rounded-2xl border border-violet-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Close */}
            <button
              onClick={() => setActivePlayerModal(null)}
              className="absolute top-4 right-4 p-1.5 text-violet-300/70 hover:text-white rounded-lg hover:bg-violet-900/40 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Player Info Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-violet-950 border border-violet-500/40 shrink-0">
                <img
                  src={activePlayerModal.image}
                  alt={activePlayerModal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                    {activePlayerModal.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
                    {activePlayerModal.tier}
                  </span>
                </div>
                <div className="text-xs text-violet-300/80">
                  {activePlayerModal.club} · {activePlayerModal.nationality} · {activePlayerModal.age} tuổi · Chân thuận: {activePlayerModal.foot}
                </div>
                <div className="text-xs text-violet-400 font-medium">
                  Vai trò tối ưu: <strong className="text-white">{activePlayerModal.role}</strong> ({activePlayerModal.position})
                </div>
              </div>
            </div>

            {/* Financial & Ability Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-[#110924] p-2.5 rounded-lg border border-violet-500/20">
                <span className="text-violet-300/60 text-[10px] block uppercase">Chỉ số PA</span>
                <strong className="text-amber-300 text-sm font-bold flex items-center justify-center gap-1">
                  <Star size={14} fill="currentColor" /> {activePlayerModal.pa} / 200
                </strong>
              </div>
              <div className="bg-[#110924] p-2.5 rounded-lg border border-violet-500/20">
                <span className="text-violet-300/60 text-[10px] block uppercase">Chỉ số CA</span>
                <strong className="text-cyan-300 text-sm font-bold">{activePlayerModal.ca}</strong>
              </div>
              <div className="bg-[#110924] p-2.5 rounded-lg border border-violet-500/20">
                <span className="text-violet-300/60 text-[10px] block uppercase">Giá ước tính</span>
                <strong className="text-white text-xs">{activePlayerModal.value}</strong>
              </div>
              <div className="bg-[#110924] p-2.5 rounded-lg border border-violet-500/20">
                <span className="text-violet-300/60 text-[10px] block uppercase">Mức lương</span>
                <strong className="text-white text-xs">{activePlayerModal.wage}</strong>
              </div>
            </div>

            {/* Full Attributes Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300/80 flex items-center gap-1.5">
                <Zap size={14} className="text-cyan-400" /> Bộ chỉ số then chốt (FM26 Engine)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                {Object.entries(activePlayerModal.attributes).map(([attr, val]) => (
                  <div key={attr} className="bg-[#110924] p-2 rounded border border-violet-500/15 flex justify-between items-center">
                    <span className="text-violet-300/60 text-[11px] capitalize">{attr}</span>
                    <strong className={`font-bold ${val >= 16 ? 'text-cyan-300 font-extrabold' : val >= 14 ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {val}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Scout Report Section */}
            <div className="p-4 rounded-xl bg-[#120a26] border border-violet-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <TrendingUp size={14} /> Báo cáo Trinh sát (Scout Report)
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activePlayerModal.scoutReport}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">✓ Điểm mạnh:</span>
                  <ul className="space-y-1 text-slate-300">
                    {activePlayerModal.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-rose-400 font-bold block mb-1">✗ Điểm cần lưu ý:</span>
                  <ul className="space-y-1 text-slate-300">
                    {activePlayerModal.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-rose-400"></span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePlayerModal(null)}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
