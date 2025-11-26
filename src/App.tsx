import React, { useState, useEffect } from 'react';
import {
  Download, Eye, Calendar, User, Search, X,
  LayoutDashboard, Plus, Trash2, Edit, Save, LogIn, LogOut,
  Info, Heart, Coffee, AlertTriangle, Star
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
// Removed unused analytics import
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, increment
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  signInWithCustomToken, signInWithEmailAndPassword, signOut
} from 'firebase/auth';

// --- FIREBASE CONFIGURATION ---

// 1. Cấu hình Firebase của BẠN (Dùng cho Production/Local)
const YOUR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCSzggBgIGpa_galV9C2srBjVG8AFmxsYA",
  authDomain: "fmhub-ae832.firebaseapp.com",
  projectId: "fmhub-ae832",
  storageBucket: "fmhub-ae832.firebasestorage.app",
  messagingSenderId: "948273341866",
  appId: "1:948273341866:web:0017bf1bf95c613def77d3",
  measurementId: "G-TKF13CZEB0"
};

// Helper để lấy biến global an toàn trong TypeScript
const getGlobal = (key: string) => {
  if (typeof window !== 'undefined') {
    return (window as any)[key];
  }
  return undefined;
};

// 2. Logic chọn cấu hình (Sandbox vs Real)
const sandboxConfig = getGlobal('__firebase_config');
const IS_SANDBOX = typeof sandboxConfig !== 'undefined';
const firebaseConfig = IS_SANDBOX ? JSON.parse(sandboxConfig) : YOUR_FIREBASE_CONFIG;

// 3. Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// App ID cho Firestore (Fix TS error bằng cách dùng helper)
const globalAppId = getGlobal('__app_id');
const appId = typeof globalAppId !== 'undefined' ? globalAppId : 'default-app-id';

// --- ADMIN CONFIGURATION ---
// Chỉ email này mới có quyền Thêm/Sửa/Xóa
const ADMIN_EMAIL = 'nguyentan7799@gmail.com';

// --- DATA TYPES & CONSTANTS ---
type Category = 'All' | 'Face' | 'Logo' | 'Database' | 'Việt hóa' | 'Guide' | 'Kit 2D' | 'Kit 3D';

interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  author: string;
  image: string;
  downloadLink: string;
  description: string;
  views: number;
  likes: number;
  date: string;
  isHot?: boolean;
  createdAt?: any;
  // Donate Fields
  donateLink?: string;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
}

const CATEGORIES: Category[] = ['All', 'Face', 'Logo', 'Database', 'Việt hóa', 'Guide', 'Kit 2D', 'Kit 3D'];

// Dữ liệu khởi tạo (Hiển thị NGAY LẬP TỨC - Views & Likes = 0)
const SEED_DATA: ResourceItem[] = [
  // --- FACE PACKS ---
  {
    title: 'DF11 Player Faces Megapack 2025',
    category: 'Face',
    author: 'DF11Faces',
    image: 'https://placehold.co/400x500/1e293b/fbbf24?text=DF11+Faces',
    downloadLink: 'https://drive.google.com/drive/folders/1Rwh5xZuHiXff4aMCQIVY1GnvEZvOoP4N?usp=drive_link',
    description: 'Bản cập nhật đầy đủ DF11 Faces Update 25. Bao gồm hơn 200,000 khuôn mặt cầu thủ với phong cách chân dung hiện đại.',
    views: 0,
    likes: 0,
    date: '2025-11-01',
    isHot: true,
    donateLink: 'https://df11faces.com/Donate',
  },
  {
    title: 'Cut-Out Player Faces Megapack',
    category: 'Face',
    author: 'Sortitoutsi',
    image: 'https://placehold.co/400x500/1e293b/10b981?text=Cut-Out',
    downloadLink: 'https://drive.google.com/drive/folders/1GfhpSodXg5L_6yhLlNZZcsGkODf8DtAe?usp=sharing',
    description: 'Bộ mặt cầu thủ kiểu Cut-out phổ biến nhất thế giới.',
    views: 0,
    likes: 0,
    date: '2025-11-24',
    isHot: true,
  },
  {
    title: 'Face Gunzo (Update 2025)',
    category: 'Face',
    author: 'Gunzo',
    image: 'https://placehold.co/400x500/1e293b/38bdf8?text=Gunzo+Face',
    downloadLink: 'https://drive.google.com/drive/folders/1tHoSwXEuUosgCqqvKzw1Qium8rUdDgVe?usp=sharing',
    description: 'Facepack phong cách Gunzo cập nhật mới nhất 2025.',
    views: 0,
    likes: 0,
    date: '2025-10-15',
  },
  {
    title: 'Face OPZ Style 4.2GB',
    category: 'Face',
    author: 'OPZ',
    image: 'https://placehold.co/400x500/1e293b/818cf8?text=OPZ+Style',
    downloadLink: 'https://drive.google.com/file/d/1v8feO8W3VqHCklJySOLFrFmHSG582zrn/view?usp=sharing',
    description: 'Phong cách OPZ độc đáo, dung lượng 4.2GB.',
    views: 0,
    likes: 0,
    date: '2024-12-20',
  },

  // --- LOGOS ---
  {
    title: 'FMG Standard Logos Megapack',
    category: 'Logo',
    author: 'FMG',
    image: 'https://placehold.co/400x500/1e293b/f59e0b?text=FMG+Logos',
    downloadLink: 'https://drive.google.com/drive/folders/11kJc2bPQBHglw5y7SvMd7Pj7OzQ1RtXK?usp=sharing',
    description: 'Bộ Logo FMG chuẩn Standard.',
    views: 0,
    likes: 0,
    date: '2024-11-10',
  },
  {
    title: 'TCM Logos Pack',
    category: 'Logo',
    author: 'TCMLogos',
    image: 'https://placehold.co/400x500/1e293b/f97316?text=TCM+Logos',
    downloadLink: 'https://drive.google.com/drive/folders/1f4AJ3__jDbU4k_RDbT79w8b-uxX9HccR?usp=sharing',
    description: 'Bộ Logo TCM nổi tiếng.',
    views: 0,
    likes: 0,
    date: '2024-10-05',
  },
  {
    title: 'Logo Siêu Nhẹ',
    category: 'Logo',
    author: 'Sưu tầm',
    image: 'https://placehold.co/400x500/1e293b/94a3b8?text=Lite+Logo',
    downloadLink: 'https://drive.google.com/file/d/1l3d4odGR8bYfYXia8GeMDMoljq_e7Q3P/view?usp=sharing',
    description: 'Bộ Logo tối ưu dung lượng.',
    views: 0,
    likes: 0,
    date: '2024-07-20',
  },

  // --- KITS ---
  {
    title: "FC'12 Season 2024/25 Kits (2D)",
    category: 'Kit 2D',
    author: 'FM Slovakia',
    image: 'https://placehold.co/400x500/1e293b/60a5fa?text=Kits+2D+24/25',
    downloadLink: 'https://fmslovakia.com/',
    description: 'Bộ Kit 2D đầy đủ cho mùa giải 24/25 mới nhất.',
    views: 0,
    likes: 0,
    date: '2025-08-15',
  },
  {
    title: 'Kit 2D & 3D Megapack 24/25',
    category: 'Kit 3D',
    author: 'Sưu tầm',
    image: 'https://placehold.co/400x500/1e293b/3b82f6?text=Kit+3D+Mega',
    downloadLink: 'https://drive.google.com/file/d/1x4ezq02onetcoZeLuRnwLNHsL8L3fCpo/view?usp=sharing',
    description: 'Bộ sưu tập Kit 3D hiển thị trong trận đấu (Match Engine) và 2D.',
    views: 0,
    likes: 0,
    date: '2025-09-15',
  },

  // --- DATABASE ---
  {
    title: 'V.League 2025/2026 Data for FM26',
    category: 'Database',
    author: 'Tan Nguyen',
    image: 'https://placehold.co/400x500/1e293b/ef4444?text=V.League+26',
    downloadLink: 'https://www.facebook.com/groups/DienDanFMVN/permalink/7242859179092239',
    description: 'Dữ liệu V.League đầy đủ cho FM26. Cập nhật chuyển nhượng, chỉ số cầu thủ Việt Nam chính xác nhất.',
    views: 0,
    likes: 0,
    date: '2025-11-26',
    isHot: true,
    bankName: 'MB Bank',
    bankAccount: '999988886666',
    bankOwner: 'NGUYEN VAN TAN'
  },
  {
    title: 'Real Names Licence Fix FM26',
    category: 'Database',
    author: 'FM Scout',
    image: 'https://placehold.co/400x500/1e293b/a855f7?text=Real+Name+Fix',
    downloadLink: 'https://www.fmscout.com/a-fm24-real-names-license-fix.html',
    description: 'Sửa tên thật các giải đấu và CLB bị sai tên bản quyền.',
    views: 0,
    likes: 0,
    date: '2025-11-20',
  },

  // --- GUIDES ---
  {
    title: 'Hướng dẫn set Opposition Instruction',
    category: 'Guide',
    author: 'FM-VN (Sưu tầm)',
    image: 'https://placehold.co/400x500/1e293b/6366f1?text=OI+Guide',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Hướng dẫn chi tiết cách bắt chết đối thủ bằng Opposition Instructions (OI).',
    views: 0,
    likes: 0,
    date: '2024-01-01',
  },
  {
    title: 'Set Set Pieces hiệu quả (Tấn công & Phòng thủ)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/818cf8?text=Set+Pieces',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Tối ưu hóa các tình huống cố định để ghi bàn nhiều hơn.',
    views: 0,
    likes: 0,
    date: '2024-02-15',
  },
  {
    title: 'Hướng dẫn tạo tactic (Cơ bản)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/4f46e5?text=Create+Tactic',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Các bước cơ bản để xây dựng một chiến thuật hiệu quả trong FM.',
    views: 0,
    likes: 0,
    date: '2024-01-10',
  },
  {
    title: 'Sự quan trọng của chỉ số Mental (Phòng ngự)',
    category: 'Guide',
    author: 'FM-VN (Sưu tầm)',
    image: 'https://placehold.co/400x500/1e293b/4338ca?text=Mental+Stats',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Phân tích các chỉ số tâm lý quan trọng cho hậu vệ.',
    views: 0,
    likes: 0,
    date: '2024-02-01',
  },
  {
    title: 'Vị trí của các Role + Duty trên sân',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/3730a3?text=Roles+Duties',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Hiểu rõ về cách di chuyển và hoạt động của từng Role.',
    views: 0,
    likes: 0,
    date: '2024-03-05',
  },
  {
    title: 'Cách săn lùng cầu thủ trẻ (Wonderkid)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/a5b4fc?text=Wonderkids',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Bí kíp tìm kiếm những tài năng trẻ (Newgen/Regen) xuất sắc nhất.',
    views: 0,
    likes: 0,
    date: '2024-03-10',
  },
  {
    title: 'Ý Nghĩa Các Chỉ Số Cầu Thủ (Attributes)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/c7d2fe?text=Attributes',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Giải thích chi tiết ý nghĩa từng chỉ số Mental, Technical, Physical.',
    views: 0,
    likes: 0,
    date: '2024-01-20',
  },
  {
    title: 'Vị trí và Tố chất cầu thủ',
    category: 'Guide',
    author: 'FM Insight',
    image: 'https://placehold.co/400x500/1e293b/e0e7ff?text=Positions',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Mỗi vị trí cần những tố chất gì để thi đấu đỉnh cao.',
    views: 0,
    likes: 0,
    date: '2024-04-12',
  },
  {
    title: 'CA (Current Ability) & PA (Potential Ability)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/1e293b/dbeafe?text=CA+PA',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Tìm hiểu về chỉ số hiện tại và tiềm năng ẩn của cầu thủ.',
    views: 0,
    likes: 0,
    date: '2024-05-01',
  }
];

// --- COMPONENTS ---

// 1. Resource Card (Giao diện Dark Mode Luxury)
const ResourceCard = ({
  item,
  onEdit,
  onViewDetail,
  onLike,
  onDonate
}: {
  item: ResourceItem;
  onEdit?: (item: ResourceItem) => void;
  onViewDetail: (item: ResourceItem) => void;
  onLike: (item: ResourceItem) => void;
  onDonate: (item: ResourceItem) => void;
}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(false);
  }, [item.id]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      onLike(item);
    }
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDonate(item);
  };

  return (
    <div className="group relative flex flex-col bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 h-full">

      {/* Category Tag */}
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 z-20 uppercase tracking-wider shadow-sm">
        {item.category}
      </div>

      {/* Hot Badge */}
      {item.isHot && (
        <div className="absolute top-3 right-auto left-12 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm z-20 shadow-md animate-pulse">
          HOT
        </div>
      )}

      {/* Heart Button */}
      <button
        onClick={handleLikeClick}
        className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-300 shadow-sm border ${liked
          ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 scale-110'
          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-rose-500/20 hover:text-rose-500 hover:border-rose-500/30 backdrop-blur-md'
          }`}
        title="Thả tim"
      >
        <Heart size={14} fill={liked ? "currentColor" : "none"} />
      </button>

      {/* Admin Edit Button */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="absolute top-14 left-3 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all shadow-lg transform hover:scale-110"
          title="Chỉnh sửa"
        >
          <Edit size={14} />
        </button>
      )}

      {/* Image Section */}
      <div
        className="relative h-44 w-full flex items-center justify-center overflow-hidden bg-[#0f172a] cursor-pointer group-hover:bg-[#111827] transition-colors"
        onClick={() => onViewDetail(item)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-80"></div>
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }}
          className="relative z-10 h-36 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-4 flex-grow bg-[#1e293b]">
        {/* Author Credit */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-medium">
          <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={10} />
          </div>
          <span className="truncate max-w-[150px] tracking-wide text-slate-300">{item.author}</span>
        </div>

        <h3
          className="text-white font-bold text-sm leading-snug mb-4 line-clamp-2 group-hover:text-amber-400 transition-colors cursor-pointer"
          onClick={() => onViewDetail(item)}
        >
          {item.title}
        </h3>

        {/* Buttons Layout - Sang trọng hơn */}
        <div className="grid grid-cols-2 gap-2 w-full mt-auto">
          {/* Download */}
          <a
            href={item.downloadLink}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Download size={14} /> TẢI VỀ
          </a>

          {/* Details */}
          <button
            onClick={() => onViewDetail(item)}
            className="col-span-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold py-2 rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Info size={14} /> CHI TIẾT
          </button>

          {/* Donate */}
          <button
            onClick={handleDonateClick}
            className="col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[11px] font-bold py-2 rounded-lg shadow-md shadow-amber-900/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Coffee size={14} /> DONATE
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#161f2e] px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-400 font-medium w-full border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Lượt xem">
            <Eye size={12} /> {item.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-rose-400" title="Lượt thích">
            <Heart size={12} fill="currentColor" /> {(item.likes || 0).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-70">
          <Calendar size={12} /> {item.date}
        </div>
      </div>
    </div>
  );
};

// 2. Donate Modal (Giao diện Dark)
const DonateModal = ({
  isOpen,
  onClose,
  item
}: {
  isOpen: boolean;
  onClose: () => void;
  item: ResourceItem | null;
}) => {
  if (!isOpen || !item) return null;

  const qrData = `Bank:${item.bankName}|Acc:${item.bankAccount}|Name:${item.bankOwner}|Info:Donate FM Resource`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/20 relative z-10">
            <Coffee size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1 relative z-10">Mời tác giả ly cà phê!</h2>
          <p className="text-white/90 text-xs relative z-10">Ủng hộ trực tiếp cho: <strong className="text-white">{item.author}</strong></p>
        </div>

        <div className="p-6 text-center space-y-6">
          <div className="bg-white p-4 inline-block rounded-xl shadow-inner">
            <div className="w-40 h-40 flex items-center justify-center mx-auto">
              <img
                src={qrUrl}
                alt="QR Code Donate"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 -mt-2">Quét mã QR để chuyển khoản nhanh</p>

          <div className="space-y-3 text-sm">
            <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Ngân hàng</span>
              <span className="font-bold text-slate-200">{item.bankName}</span>
            </div>
            <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Số tài khoản</span>
              <span className="font-bold text-emerald-400 text-lg tracking-wider font-mono">{item.bankAccount}</span>
            </div>
            <div className="bg-[#0f172a] p-3 rounded-lg flex items-center justify-between border border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase">Chủ tài khoản</span>
              <span className="font-bold text-slate-200">{item.bankOwner}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors border-t border-slate-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Detail Modal (Giao diện Dark)
const DetailModal = ({
  item,
  isOpen,
  onClose,
  onDonate
}: {
  item: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDonate: () => void;
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="bg-[#1e293b] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-2/5 bg-[#0f172a] flex items-center justify-center p-8 border-r border-slate-700 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0f172a] to-[#0f172a]"></div>
          <img
            src={item.image}
            alt={item.title}
            className="max-h-64 md:max-h-full w-auto object-contain drop-shadow-2xl relative z-10"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }}
          />
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto bg-[#1e293b]">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {item.category}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-full">
              <X size={24} />
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{item.title}</h2>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 border-b border-slate-700 pb-6">
            <div className="flex items-center gap-1.5">
              <User size={16} className="text-emerald-500" /> <span className="font-medium text-slate-200">{item.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-rose-500" /> <span>{(item.likes || 0).toLocaleString()} Likes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="text-sky-500" /> <span>{item.views.toLocaleString()} Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-slate-500" /> <span>{item.date}</span>
            </div>
          </div>

          <div className="mb-8 flex-grow">
            <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Info size={16} className="text-amber-500" /> Mô tả / Hướng dẫn
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {item.description || "Chưa có mô tả chi tiết cho tài nguyên này."}
            </p>
          </div>

          <div className="mt-auto pt-4 space-y-3">
            <a
              href={item.downloadLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 text-sm tracking-wide hover:-translate-y-0.5"
            >
              <Download size={18} /> TẢI XUỐNG NGAY
            </a>
            <button
              onClick={onDonate}
              className="w-full bg-[#2d3b4e] hover:bg-[#37465b] text-amber-400 font-bold py-3 px-6 rounded-xl border border-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm hover:text-amber-300"
            >
              <Coffee size={18} /> ỦNG HỘ TÁC GIẢ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Admin Modal (Giữ nguyên chức năng, chỉ đổi màu)
const AdminModal = ({
  isOpen,
  onClose,
  initialData,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ResourceItem | null;
  onSave: (data: ResourceItem) => void;
}) => {
  const [formData, setFormData] = useState<ResourceItem>({
    title: '',
    category: 'Face',
    author: '',
    image: '',
    downloadLink: '',
    description: '',
    views: 0,
    likes: 0,
    date: new Date().toISOString().split('T')[0],
    donateLink: '',
    bankName: '',
    bankAccount: '',
    bankOwner: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        category: 'Face',
        author: '',
        image: '',
        downloadLink: '',
        description: '',
        views: 0,
        likes: 0,
        date: new Date().toISOString().split('T')[0],
        donateLink: '',
        bankName: '',
        bankAccount: '',
        bankOwner: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Giữ nguyên nội dung Admin modal màu sáng để dễ nhập liệu */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {initialData ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
            {initialData ? 'Chỉnh sửa Item' : 'Tạo Item Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="VD: DF11 Megapack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả gốc (Author)</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="VD: Sortitoutsi"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Download</label>
                <input
                  type="text"
                  value={formData.downloadLink}
                  onChange={e => setFormData({ ...formData, downloadLink: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none text-blue-600"
                  placeholder="Google Drive / Fshare..."
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <Coffee size={16} /> Cấu hình Donate (Tùy chọn)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Link Donate bên ngoài</label>
                <input
                  type="text"
                  value={formData.donateLink || ''}
                  onChange={e => setFormData({ ...formData, donateLink: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                  placeholder="VD: https://playerduo.net/..."
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Tên Ngân hàng</label>
                  <input
                    type="text"
                    value={formData.bankName || ''}
                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                    placeholder="VD: MB Bank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Số Tài khoản</label>
                  <input
                    type="text"
                    value={formData.bankAccount || ''}
                    onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                    placeholder="VD: 0123456789"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Chủ Tài khoản</label>
                  <input
                    type="text"
                    value={formData.bankOwner || ''}
                    onChange={e => setFormData({ ...formData, bankOwner: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                    placeholder="VD: NGUYEN VAN A"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Nhập hướng dẫn cài đặt hoặc thông tin chi tiết..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow-md transition-colors flex items-center gap-2"
          >
            <Save size={18} /> Lưu lại
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  // OPTIMISTIC UI: KHỞI TẠO STATE VỚI SEED_DATA NGAY LẬP TỨC
  const [items, setItems] = useState<ResourceItem[]>(SEED_DATA);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Error State
  const [permissionError, setPermissionError] = useState(false);

  // States
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ResourceItem | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateItem, setDonateItem] = useState<ResourceItem | null>(null);

  // Derived Admin State
  const isAdmin = user && !user.isAnonymous && user.email === ADMIN_EMAIL;

  // 1. Initial Auth & Load Data
  useEffect(() => {
    const init = async () => {
      try {
        const globalToken = getGlobal('__initial_auth_token');
        if (globalToken) {
          await signInWithCustomToken(auth, globalToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    init();

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Fetch Data (BACKGROUND SYNC)
  // Dữ liệu sẽ được tải ngầm. Nếu có thay đổi so với SEED_DATA, giao diện sẽ tự cập nhật.
  useEffect(() => {
    if (!user) return;

    const colRef = IS_SANDBOX
      ? collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources')
      : collection(db, 'fm_resources');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setPermissionError(false);
      if (snapshot.empty) {
        if (isAdmin || IS_SANDBOX) {
          SEED_DATA.forEach(async (item) => {
            try { await addDoc(colRef, { ...item, createdAt: serverTimestamp() }); } catch (e) { }
          });
        }
      } else {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          likes: 0,
          ...doc.data()
        })) as ResourceItem[];
        setItems(fetchedItems);
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      if (error.code === 'permission-denied') {
        setPermissionError(true);
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  // --- HANDLERS ---

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      // Strict Admin Check
      if (userCredential.user.email !== ADMIN_EMAIL) {
        alert("Tài khoản này không có quyền Admin.");
        await signOut(auth);
        await signInAnonymously(auth);
        return;
      }

      setShowLogin(false);
      setLoginEmail('');
      setLoginPass('');
    } catch (error: any) {
      alert('Đăng nhập thất bại: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth); // Fallback to viewer mode
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSaveItem = async (data: ResourceItem) => {
    if (!user) return;
    const colRef = IS_SANDBOX
      ? collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources')
      : collection(db, 'fm_resources');

    try {
      if (editingItem && editingItem.id) {
        const finalDocRef = IS_SANDBOX
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources', editingItem.id)
          : doc(db, 'fm_resources', editingItem.id);

        const { id, ...updateData } = data;
        await updateDoc(finalDocRef, updateData);
      } else {
        await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
      }
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Lỗi khi lưu dữ liệu (Kiểm tra quyền ghi trong Firestore Rules)");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa item này không?")) return;
    try {
      const finalDocRef = IS_SANDBOX
        ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources', id)
        : doc(db, 'fm_resources', id);
      await deleteDoc(finalDocRef);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Tăng Like khi bấm Tim
  const handleLikeItem = async (item: ResourceItem) => {
    if (!user || !item.id) return;
    try {
      const finalDocRef = IS_SANDBOX
        ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources', item.id)
        : doc(db, 'fm_resources', item.id);
      await updateDoc(finalDocRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

  // Tăng View khi bấm Chi tiết
  const handleViewDetail = async (item: ResourceItem) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);

    // Logic tăng View (chỉ tăng nếu có ID và User)
    if (user && item.id) {
      try {
        const finalDocRef = IS_SANDBOX
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources', item.id)
          : doc(db, 'fm_resources', item.id);
        await updateDoc(finalDocRef, {
          views: increment(1)
        });
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    }
  };

  const handleDonateClick = (item: ResourceItem) => {
    const hasBankInfo = item.bankName && item.bankAccount;
    const hasDonateLink = item.donateLink;

    if (hasBankInfo) {
      setDonateItem(item);
      setIsDonateModalOpen(true);
    } else if (hasDonateLink) {
      window.open(item.donateLink, '_blank');
    } else {
      alert("Tác giả chưa cập nhật thông tin Donate cho tài nguyên này.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col">

      {/* HEADER */}
      <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedCategory('All')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-900/50 text-white group-hover:scale-105 transition-transform">FM</div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight text-white">FM RES <span className="text-emerald-500">HUB</span></h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Vietnam Community</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-32 md:w-48 transition-all focus:w-64 placeholder-slate-500"
                />
              </div>

              {isAdmin ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:shadow-emerald-900/30 transition-all"
                    title="Thêm Item Mới"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-400 p-2 rounded-full border border-slate-700"
                    title="Đăng xuất Admin"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-slate-500 hover:text-white p-2 transition-colors"
                  title="Admin Login"
                >
                  <User size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-hide bg-[#1e293b]">
          <div className="flex p-3 space-x-2 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ADMIN STATUS */}
      {isAdmin && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 text-center backdrop-blur-sm">
          <p className="text-xs text-amber-500 font-bold flex items-center justify-center gap-2 tracking-wide">
            <LayoutDashboard size={14} /> ADMIN MODE ACTIVE <span className="opacity-50">|</span> {user.email}
          </p>
        </div>
      )}

      {/* PERMISSION ERROR ALERT */}
      {permissionError && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="container mx-auto flex items-start gap-3 text-red-700">
            <AlertTriangle className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold">Chưa cấu hình quyền truy cập (Firestore Security Rules)</h3>
              {!IS_SANDBOX ? (
                <>
                  <p className="text-sm mt-1">
                    Bạn đang chạy trên Firebase cá nhân nhưng chưa mở quyền truy cập. Hãy vào <a href="https://console.firebase.google.com/" target="_blank" className="underline font-bold">Firebase Console</a> {'>'} Firestore Database {'>'} Rules và sửa thành:
                  </p>
                  <pre className="bg-red-100 p-2 rounded mt-2 text-xs font-mono">
                    {`allow read, write: if true;`}
                  </pre>
                </>
              ) : (
                <p className="text-sm mt-1">
                  Lỗi quyền truy cập Sandbox. Vui lòng refresh trang hoặc thử lại sau ít phút.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HERO BANNER */}
      <div className="relative bg-[#0f172a] border-b border-slate-800 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div
          className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center md:text-left"
        >
          <div className="max-w-3xl mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-[10px] font-bold mb-6 uppercase tracking-widest">
              <Star size={12} className="fill-emerald-400" /> Top 1 Cộng đồng FM Việt Nam
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              KHO TÀI NGUYÊN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">FOOTBALL MANAGER</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed font-light mx-auto md:mx-0">
              Tổng hợp tất cả tài nguyên Facepack, Logo, Kits, Guide và Việt Hóa chất lượng cao nhất. Cập nhật liên tục, tải xuống tốc độ cao.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-1 flex items-center gap-2">
                <Download size={18} /> TẢI MỚI NHẤT
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold text-sm border border-slate-700 transition-all flex items-center gap-2">
                <Info size={18} /> HƯỚNG DẪN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-4 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full block shadow-[0_0_15px_rgba(16,185,129,0.6)]"></span>
              {selectedCategory === 'All' ? 'Tài nguyên nổi bật' : selectedCategory}
            </h3>
            <p className="text-slate-500 text-xs mt-2 ml-4">Cập nhật mới nhất từ cộng đồng</p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">
            Hiển thị {filteredItems.length} kết quả
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-[#161f2e] rounded-2xl border border-dashed border-slate-800">
            <div className="inline-block p-5 bg-slate-800/50 rounded-full mb-4">
              <Search size={40} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">Không tìm thấy dữ liệu phù hợp.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsEditModalOpen(true);
                }}
                className="mt-6 text-emerald-500 font-bold text-sm hover:text-emerald-400 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} /> Thêm bài viết ngay
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id || item.title} className="relative group/card h-full">
                <ResourceCard
                  item={item}
                  onEdit={isAdmin ? () => {
                    setEditingItem(item);
                    setIsEditModalOpen(true);
                  } : undefined}
                  onViewDetail={handleViewDetail}
                  onLike={handleLikeItem}
                  onDonate={handleDonateClick}
                />

                {isAdmin && item.id && (
                  <button
                    onClick={() => handleDeleteItem(item.id!)}
                    className="absolute top-3 right-12 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/card:opacity-100 transition-all z-30 hover:scale-110"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6 text-emerald-500 font-bold text-xl">FM</div>
          <p className="mb-4 font-bold text-white tracking-wide">FM RESOURCE HUB © 2025</p>
          <p className="text-xs max-w-md mx-auto leading-relaxed opacity-60 mb-8">
            Website chia sẻ tài nguyên phi lợi nhuận dành cho cộng đồng Football Manager Việt Nam.
            Tất cả tài nguyên thuộc bản quyền của tác giả gốc.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold tracking-wider text-slate-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">FACEBOOK GROUP</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">DISCORD</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">CONTACT</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-sm shadow-2xl transform transition-all border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 justify-center">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <LogIn size={24} className="text-emerald-500" />
              </div>
              Admin Login
            </h3>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin@example.com"
                  autoFocus
                />
              </div>
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 text-sm shadow-lg shadow-emerald-900/20 transition-all"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Admin Edit/Create Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editingItem}
        onSave={handleSaveItem}
      />

      {/* 3. Detail View Modal */}
      <DetailModal
        item={viewingItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onDonate={() => {
          setIsDetailModalOpen(false);
          if (viewingItem) handleDonateClick(viewingItem);
        }}
      />

      {/* 4. Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        item={donateItem}
      />

    </div>
  );
}