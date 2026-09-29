import { ArrowRight, Clock, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type ResourceItem, type Category, toSlug } from '../types';
import { DEFAULT_RESOURCES } from '../defaultData';

interface HeroProps {
  items?: ResourceItem[];
  onViewDetail?: (item: ResourceItem) => void;
  selectedCategory?: Category;
}

export default function Hero({ items = [], onViewDetail, selectedCategory = 'All' }: HeroProps) {
  const navigate = useNavigate();

  // Pick top articles from items or fallback
  const pool = items.length > 0 ? items : DEFAULT_RESOURCES;
  const articles = pool.filter(i => i.category === 'Bài viết');
  const guides = pool.filter(i => i.category === 'Guide');

  // Lead featured story (Hot article or first article)
  const leadArticle = articles.find(i => i.isHot) || articles[0] || pool[0];
  
  // Secondary stories
  const secondaryStories = pool
    .filter(i => i.id !== leadArticle?.id && (i.category === 'Bài viết' || i.category === 'Guide' || i.category === 'Tactics'))
    .slice(0, 3);

  const handleReadItem = (item: ResourceItem) => {
    if (onViewDetail) {
      onViewDetail(item);
    } else {
      navigate(`/item/${item.id}`);
    }
  };

  // If viewing a specific category other than 'All', show a focused editorial header
  if (selectedCategory !== 'All') {
    const isArticles = selectedCategory === 'Bài viết';
    const isGuide = selectedCategory === 'Guide';
    const isPlayerDb = selectedCategory === 'Database cầu thủ';

    return (
      <section className="relative border-b border-violet-500/20 bg-gradient-to-b from-[#180f33] via-[#140c2b] to-[#0f0722] py-8 md:py-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Sparkles size={13} />
              <span>Chuyên mục Football Manager</span>
              <span aria-hidden="true">·</span>
              <span className="text-violet-300">FM26 Match Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight mb-2.5">
              {isArticles 
                ? 'Bài viết & Tin tức Football Manager' 
                : isGuide 
                  ? 'Cẩm nang & Guide của tôi' 
                  : isPlayerDb
                    ? 'Database Cầu thủ & Wonderkids FM26'
                    : `Kho tài nguyên: ${selectedCategory}`}
            </h1>
            <p className="text-violet-200/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {isArticles
                ? 'Tổng hợp các bài viết phân tích chuyên sâu về Match Engine, tin tức chuyển nhượng, đánh giá Wonderkids và cập nhật hệ thống game.'
                : isGuide
                  ? 'Cẩm nang hướng dẫn chiến thuật, giáo trình đào tạo cầu thủ trẻ, thiết lập ban huấn luyện và kinh nghiệm cầm quân thực chiến.'
                  : isPlayerDb
                    ? 'Dữ liệu chỉ số trinh sát, tiềm năng PA, mức phí giải phóng hợp đồng và các Wonderkids đáng mua nhất trong FM26.'
                    : `Tất cả tài nguyên và nội dung ${selectedCategory} được chọn lọc kỹ lưỡng dành cho cộng đồng người chơi.`}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Home View: FM26 Lead Editorial Magazine Showcase
  return (
    <section className="relative border-b border-violet-500/20 bg-gradient-to-b from-[#170e30] via-[#130b28] to-[#0d071e] py-8 md:py-12 overflow-hidden">
      {/* Stadium Ambient Floodlights */}
      <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-cyan-500/12 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-20 left-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* FM26 Sub-bar ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-violet-500/20 gap-3">
          <div className="flex items-center gap-2 text-xs text-violet-300/80">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              FM26 LIVE HUB
            </span>
            <span aria-hidden="true" className="text-violet-500">·</span>
            <span>Tin tức, Match Engine, Wonderkids & Tactics</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-semibold text-violet-200/80 flex-wrap">
            <button 
              onClick={() => navigate(`/${toSlug('Bài viết')}`)}
              className="hover:text-cyan-300 transition-colors"
            >
              Bài viết ({articles.length})
            </button>
            <span aria-hidden="true" className="text-violet-500/40">·</span>
            <button 
              onClick={() => navigate(`/${toSlug('Guide')}`)}
              className="hover:text-cyan-300 transition-colors"
            >
              Guide cẩm nang ({guides.length})
            </button>
            <span aria-hidden="true" className="text-violet-500/40">·</span>
            <button 
              onClick={() => navigate(`/${toSlug('Database cầu thủ')}`)}
              className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <Star size={11} fill="currentColor" /> Database cầu thủ
            </button>
          </div>
        </div>

        {/* 3-Tier Front Page Magazine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Lead Story (Left 7 Cols) */}
          {leadArticle && (
            <article 
              onClick={() => handleReadItem(leadArticle)}
              className="lg:col-span-7 group cursor-pointer flex flex-col bg-[#191035]/90 hover:bg-[#201542] rounded-2xl border border-violet-500/25 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)]"
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#120a26]">
                <img
                  src={leadArticle.image}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', 'from-violet-950', 'to-slate-950');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191035] via-transparent to-transparent opacity-90"></div>
                
                {/* Clean unboxed tag */}
                <div className="absolute top-4 left-4 text-[11px] font-black tracking-wider text-cyan-300 uppercase bg-[#100724]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-500/30 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Bài viết tiêu điểm FM26
                </div>
              </div>

              {/* Lead Content */}
              <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-violet-300/80 mb-2">
                    <span className="font-semibold text-cyan-400">{leadArticle.category}</span>
                    <span aria-hidden="true" className="text-violet-500/40">·</span>
                    <span>{leadArticle.version || 'FM26'}</span>
                    {leadArticle.readTime && (
                      <>
                        <span aria-hidden="true" className="text-violet-500/40">·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {leadArticle.readTime}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white group-hover:text-cyan-300 transition-colors leading-tight mb-3">
                    {leadArticle.title}
                  </h2>

                  {leadArticle.summary && (
                    <p className="text-violet-200/80 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {leadArticle.summary}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-violet-500/20 text-xs text-violet-300/70">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-500/30 flex items-center justify-center text-cyan-300 font-bold text-[10px]">
                      {leadArticle.author ? leadArticle.author.charAt(0) : 'F'}
                    </div>
                    <span className="font-semibold text-white">{leadArticle.author}</span>
                    <span aria-hidden="true" className="text-violet-500/40">·</span>
                    <span>{leadArticle.date}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                    Đọc toàn văn <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          )}

          {/* Secondary Highlight Stories (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-violet-300/80 pb-1">
              <span>Bài viết & Cẩm nang nổi bật</span>
              <span className="text-[10px] text-cyan-400">FM26 META</span>
            </div>

            {secondaryStories.map((item) => (
              <article
                key={item.id}
                onClick={() => handleReadItem(item)}
                className="group cursor-pointer p-3.5 sm:p-4 bg-[#191035]/85 rounded-xl border border-violet-500/20 hover:border-cyan-400/50 hover:bg-[#201542] transition-all duration-200 flex gap-3.5 items-start shadow-md hover:shadow-violet-600/20"
              >
                {/* Thumbnail */}
                <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#120a26] border border-violet-500/20 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-violet-300/70 mb-1">
                    <span className="text-cyan-400 font-semibold">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime || '4 phút đọc'}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-violet-300/60 mt-2">
                    <span>{item.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </article>
            ))}

            {/* Banner jump to Database Cầu thủ */}
            <div
              onClick={() => navigate(`/${toSlug('Database cầu thủ')}`)}
              className="cursor-pointer p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#1a123d] to-[#1d1045] border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-between group shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Star size={16} fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Khám phá Database Cầu thủ & Wonderkids
                  </div>
                  <div className="text-[11px] text-violet-300/70">
                    Tra cứu PA, CA, mức giá và chỉ số FM26
                  </div>
                </div>
              </div>
              <ArrowRight size={15} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
