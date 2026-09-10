import { X, ShieldAlert, FileText, CheckCircle2, Lock, Mail } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'disclaimer' | 'safety' | 'privacy' | 'dmca';
}

export default function PolicyModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[80] p-4 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-[#191135] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-violet-500/30"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-6 border-b border-violet-500/20 flex justify-between items-center sticky top-0 bg-[#191135]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600/20 rounded-xl text-cyan-300 border border-violet-500/30">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Chính Sách & Tuyên Bố Miễn Trừ</h2>
              <p className="text-xs text-violet-300/70">Cam kết an toàn và minh bạch cho cộng đồng FMVN</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-violet-900/40 rounded-xl text-violet-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* Section 1: Non-Profit Disclaimer */}
          <section className="bg-[#130d25] p-5 rounded-2xl border border-violet-500/20 space-y-2.5">
            <h3 className="text-white font-bold font-display flex items-center gap-2 text-base">
              <FileText size={17} className="text-violet-400" />
              1. Tuyên bố phi lợi nhuận & Bản quyền thương hiệu
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>FM Res Hub</strong> là một trang web độc lập, hoạt động hoàn toàn phi thương mại và phi lợi nhuận do cộng đồng người chơi <em>Football Manager Việt Nam</em> phát triển.
            </p>
            <p className="text-xs text-slate-400">
              Thương hiệu <strong>Football Manager</strong>, logo và các tài sản liên quan thuộc quyền sở hữu trí tuệ của <em>Sports Interactive Limited</em> và <em>SEGA Publishing Europe Ltd</em>. Chúng tôi không phải là đại diện hay đối tác chính thức của SEGA / Sports Interactive. Các tệp tin được tổng hợp trên website đều là các tác phẩm do người chơi và người sáng tạo nội dung tự phát triển (fan-made mods).
            </p>
          </section>

          {/* Section 2: Safe Browsing & Anti-Malware */}
          <section className="bg-[#130d25] p-5 rounded-2xl border border-violet-500/20 space-y-2.5">
            <h3 className="text-white font-bold font-display flex items-center gap-2 text-base text-cyan-300">
              <CheckCircle2 size={17} className="text-cyan-400" />
              2. Cam kết an toàn & Phòng chống kỹ thuật xã hội (Anti-Malware Policy)
            </h3>
            <ul className="text-xs sm:text-sm space-y-2 list-disc list-inside text-slate-300">
              <li>
                <strong>Không lưu trữ mã độc:</strong> Website hoàn toàn không tải lên, phân phối hay tiếp tay cho việc phát tán phần mềm độc hại (trojan, spyware, adware, ransomware) hoặc bất kỳ tệp thực thi nào (.exe, .bat, .vbs) gây nguy hiểm cho máy tính người dùng.
              </li>
              <li>
                <strong>Định dạng tệp tin an toàn:</strong> Toàn bộ tài nguyên là các gói đồ họa (ảnh .png), gói giao diện game (file cấu hình .xml, .fmf) và chiến thuật game (.tac).
              </li>
              <li>
                <strong>Minh bạch liên kết:</strong> Website không chèn quảng cáo lừa đảo, không sử dụng trang rút gọn link độc hại gây hiểu nhầm (phishing) hay các nút tải xuống giả mạo (deceptive download buttons). Mọi nút tải về đều thông báo rõ ràng máy chủ lưu trữ (Google Drive, MediaFire, Fshare, Mega...).
              </li>
            </ul>
          </section>

          {/* Section 3: Privacy & Credential Harvesting Protection */}
          <section className="bg-[#130d25] p-5 rounded-2xl border border-violet-500/20 space-y-2.5">
            <h3 className="text-white font-bold font-display flex items-center gap-2 text-base text-amber-300">
              <Lock size={17} className="text-amber-400" />
              3. Chính sách quyền riêng tư (Không thu thập dữ liệu cá nhân)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Chúng tôi tôn trọng quyền riêng tư của mọi khách truy cập:
            </p>
            <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside text-slate-300">
              <li>Website không yêu cầu người dùng thông thường tạo tài khoản hay đăng nhập.</li>
              <li>Website tuyệt đối không thu thập mật khẩu tài khoản Google, Facebook, email cá nhân hay thông tin thẻ tín dụng/ngân hàng của người dùng.</li>
              <li>Tính năng Đăng nhập trên thanh menu chỉ dành riêng cho Ban quản trị viên được chỉ định để cập nhật bài viết bài bản.</li>
            </ul>
          </section>

          {/* Section 4: DMCA and Takedown Contact */}
          <section className="bg-[#130d25] p-5 rounded-2xl border border-violet-500/20 space-y-3">
            <h3 className="text-white font-bold font-display flex items-center gap-2 text-base text-rose-300">
              <Mail size={17} className="text-rose-400" />
              4. Báo cáo liên kết vi phạm & Quy trình xử lý DMCA (Takedown Notice)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Nếu bạn là tác giả của bất kỳ tài nguyên nào hoặc phát hiện có liên kết không an toàn, hỏng link hoặc vi phạm bản quyền, vui lòng liên hệ ngay với chúng tôi. Ban quản trị cam kết sẽ kiểm tra và gỡ bỏ liên kết trong vòng <strong>24 giờ</strong>:
            </p>
            <div className="bg-[#1e153d] p-3.5 rounded-xl border border-violet-500/30 text-xs space-y-1 font-mono">
              <p>• Email tiếp nhận: <a href="mailto:tanlan.2001@gmail.com" className="text-cyan-300 underline">tanlan.2001@gmail.com</a></p>
              <p>• Facebook Quản trị viên: <a href="https://www.facebook.com/tanlan.2001/" target="_blank" rel="noreferrer" className="text-cyan-300 underline">facebook.com/tanlan.2001/</a></p>
              <p>• Cộng đồng FMVN: <a href="https://www.facebook.com/groups/fmvnofficial" target="_blank" rel="noreferrer" className="text-cyan-300 underline">facebook.com/groups/fmvnofficial</a></p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-violet-500/20 bg-[#140c2b] flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-colors"
          >
            Đã hiểu & Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
