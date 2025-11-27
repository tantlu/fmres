export default function Footer() {
  return (
    <footer className="bg-[#0b1120] text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="container mx-auto px-4 text-center">
        <img src="https://yt3.ggpht.com/83WfPjeUQMeiK56shkZPb4opoo8vqdP9PpSpf92ayYAUIEocv8GbRvze_tjZumiBAsK0sVWVUQ=s600-c-k-c0x00ffffff-no-rj-rp-mo" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 bg-[#1e293b] rounded-lg shadow-lg block mx-auto mb-4" />
        <p className="mb-4 font-bold text-white tracking-wide">FM RESOURCE HUB © 2025</p>
        <p className="text-xs max-w-md mx-auto leading-relaxed opacity-60 mb-8">Website chia sẻ tài nguyên phi lợi nhuận dành cho cộng đồng Football Manager Việt Nam.</p>
        <div className="flex justify-center gap-6 text-xs font-bold tracking-wider text-slate-500">
          <a href="https://www.facebook.com/groups/fmvnofficial" className="hover:text-emerald-500">FACEBOOK GROUP</a>
          <a href="https://www.youtube.com/@tenfm3024" className="hover:text-emerald-500">YOUTUBE</a>
          <a href="https://www.facebook.com/tanlan.2001/" className="hover:text-emerald-500">CONTACT</a>
        </div>
      </div>
    </footer>
  );
}