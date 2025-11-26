import React, { useState, useEffect } from 'react';
import {
  Download, Eye, Calendar, User, Search, Menu, X,
  LayoutDashboard, Plus, Trash2, Edit, Save, LogIn, LogOut, Link as LinkIcon,
  Info, Heart, Coffee, QrCode, CreditCard, ExternalLink, Lock, AlertTriangle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp, increment
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

// 2. Logic chọn cấu hình (Sandbox vs Real)
const IS_SANDBOX = typeof __firebase_config !== 'undefined';
const firebaseConfig = IS_SANDBOX ? JSON.parse(__firebase_config) : YOUR_FIREBASE_CONFIG;

// 3. Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics
let analytics;
if (typeof window !== 'undefined' && !IS_SANDBOX) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.log("Analytics not supported in this environment");
  }
}

// App ID cho Firestore
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

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

// Dữ liệu khởi tạo
const SEED_DATA: ResourceItem[] = [
  // --- FACE PACKS ---
  {
    title: 'DF11 Player Faces Megapack 2025',
    category: 'Face',
    author: 'DF11Faces',
    image: 'https://placehold.co/400x500/22c55e/ffffff?text=DF11+Faces',
    downloadLink: 'https://drive.google.com/drive/folders/1Rwh5xZuHiXff4aMCQIVY1GnvEZvOoP4N?usp=drive_link',
    description: 'Bản cập nhật đầy đủ DF11 Faces Update 25. Bao gồm hơn 200,000 khuôn mặt cầu thủ với phong cách chân dung hiện đại.',
    views: 240371,
    likes: 1250,
    date: '2025-11-01',
    isHot: true,
    donateLink: 'https://df11faces.com/Donate',
  },
  {
    title: 'Cut-Out Player Faces Megapack',
    category: 'Face',
    author: 'Sortitoutsi',
    image: 'https://placehold.co/400x500/16a34a/ffffff?text=Cut-Out',
    downloadLink: 'https://drive.google.com/drive/folders/1GfhpSodXg5L_6yhLlNZZcsGkODf8DtAe?usp=sharing',
    description: 'Bộ mặt cầu thủ kiểu Cut-out phổ biến nhất thế giới.',
    views: 523012,
    likes: 3400,
    date: '2025-11-24',
    isHot: true,
  },
  {
    title: 'Face Gunzo (Update 2025)',
    category: 'Face',
    author: 'Gunzo',
    image: 'https://placehold.co/400x500/0ea5e9/ffffff?text=Gunzo+Face',
    downloadLink: 'https://drive.google.com/drive/folders/1tHoSwXEuUosgCqqvKzw1Qium8rUdDgVe?usp=sharing',
    description: 'Facepack phong cách Gunzo cập nhật mới nhất 2025.',
    views: 45000,
    likes: 890,
    date: '2025-10-15',
  },
  {
    title: 'Face OPZ Style 4.2GB',
    category: 'Face',
    author: 'OPZ',
    image: 'https://placehold.co/400x500/6366f1/ffffff?text=OPZ+Style',
    downloadLink: 'https://drive.google.com/file/d/1v8feO8W3VqHCklJySOLFrFmHSG582zrn/view?usp=sharing',
    description: 'Phong cách OPZ độc đáo, dung lượng 4.2GB.',
    views: 12000,
    likes: 340,
    date: '2024-12-20',
  },

  // --- LOGOS ---
  {
    title: 'FMG Standard Logos Megapack',
    category: 'Logo',
    author: 'FMG',
    image: 'https://placehold.co/400x500/eab308/ffffff?text=FMG+Logos',
    downloadLink: 'https://drive.google.com/drive/folders/11kJc2bPQBHglw5y7SvMd7Pj7OzQ1RtXK?usp=sharing',
    description: 'Bộ Logo FMG chuẩn Standard.',
    views: 98000,
    likes: 2200,
    date: '2024-11-10',
  },
  {
    title: 'TCM Logos Pack',
    category: 'Logo',
    author: 'TCMLogos',
    image: 'https://placehold.co/400x500/f59e0b/ffffff?text=TCM+Logos',
    downloadLink: 'https://drive.google.com/drive/folders/1f4AJ3__jDbU4k_RDbT79w8b-uxX9HccR?usp=sharing',
    description: 'Bộ Logo TCM nổi tiếng.',
    views: 87000,
    likes: 1800,
    date: '2024-10-05',
  },
  {
    title: 'Logo Siêu Nhẹ',
    category: 'Logo',
    author: 'Sưu tầm',
    image: 'https://placehold.co/400x500/94a3b8/ffffff?text=Lite+Logo',
    downloadLink: 'https://drive.google.com/file/d/1l3d4odGR8bYfYXia8GeMDMoljq_e7Q3P/view?usp=sharing',
    description: 'Bộ Logo tối ưu dung lượng.',
    views: 15000,
    likes: 670,
    date: '2024-07-20',
  },

  // --- KITS ---
  {
    title: "FC'12 Season 2024/25 Kits (2D)",
    category: 'Kit 2D',
    author: 'FM Slovakia',
    image: 'https://placehold.co/400x500/3b82f6/ffffff?text=Kits+2D+24/25',
    downloadLink: 'https://fmslovakia.com/',
    description: 'Bộ Kit 2D đầy đủ cho mùa giải 24/25 mới nhất.',
    views: 34000,
    likes: 450,
    date: '2025-08-15',
  },
  {
    title: 'Kit 2D & 3D Megapack 24/25',
    category: 'Kit 3D',
    author: 'Sưu tầm',
    image: 'https://placehold.co/400x500/1d4ed8/ffffff?text=Kit+3D+Mega',
    downloadLink: 'https://drive.google.com/file/d/1x4ezq02onetcoZeLuRnwLNHsL8L3fCpo/view?usp=sharing',
    description: 'Bộ sưu tập Kit 3D hiển thị trong trận đấu (Match Engine) và 2D.',
    views: 41000,
    likes: 980,
    date: '2025-09-15',
  },

  // --- DATABASE ---
  {
    title: 'V.League 2025/2026 Data for FM26',
    category: 'Database',
    author: 'Tan Nguyen',
    image: 'https://placehold.co/400x500/ef4444/ffffff?text=V.League+26',
    downloadLink: 'https://www.facebook.com/groups/DienDanFMVN/permalink/7242859179092239',
    description: 'Dữ liệu V.League đầy đủ cho FM26. Cập nhật chuyển nhượng, chỉ số cầu thủ Việt Nam chính xác nhất.',
    views: 5000,
    likes: 890,
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
    image: 'https://placehold.co/400x500/8b5cf6/ffffff?text=Real+Name+Fix',
    downloadLink: 'https://www.fmscout.com/a-fm24-real-names-license-fix.html',
    description: 'Sửa tên thật các giải đấu và CLB bị sai tên bản quyền.',
    views: 800000,
    likes: 5000,
    date: '2025-11-20',
  },

  // --- GUIDES ---
  {
    title: 'Hướng dẫn set Opposition Instruction',
    category: 'Guide',
    author: 'FM-VN (Sưu tầm)',
    image: 'https://placehold.co/400x500/6366f1/ffffff?text=OI+Guide',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Hướng dẫn chi tiết cách bắt chết đối thủ bằng Opposition Instructions (OI).',
    views: 12000,
    likes: 150,
    date: '2024-01-01',
  },
  {
    title: 'Set Set Pieces hiệu quả (Tấn công & Phòng thủ)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/818cf8/ffffff?text=Set+Pieces',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Tối ưu hóa các tình huống cố định để ghi bàn nhiều hơn.',
    views: 8500,
    likes: 210,
    date: '2024-02-15',
  },
  {
    title: 'Hướng dẫn tạo tactic (Cơ bản)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/4f46e5/ffffff?text=Create+Tactic',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Các bước cơ bản để xây dựng một chiến thuật hiệu quả trong FM.',
    views: 22000,
    likes: 560,
    date: '2024-01-10',
  },
  {
    title: 'Sự quan trọng của chỉ số Mental (Phòng ngự)',
    category: 'Guide',
    author: 'FM-VN (Sưu tầm)',
    image: 'https://placehold.co/400x500/4338ca/ffffff?text=Mental+Stats',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Phân tích các chỉ số tâm lý quan trọng cho hậu vệ.',
    views: 15000,
    likes: 300,
    date: '2024-02-01',
  },
  {
    title: 'Vị trí của các Role + Duty trên sân',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/3730a3/ffffff?text=Roles+Duties',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Hiểu rõ về cách di chuyển và hoạt động của từng Role.',
    views: 31000,
    likes: 890,
    date: '2024-03-05',
  },
  {
    title: 'Cách săn lùng cầu thủ trẻ (Wonderkid)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/a5b4fc/ffffff?text=Wonderkids',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Bí kíp tìm kiếm những tài năng trẻ (Newgen/Regen) xuất sắc nhất.',
    views: 45000,
    likes: 1200,
    date: '2024-03-10',
  },
  {
    title: 'Ý Nghĩa Các Chỉ Số Cầu Thủ (Attributes)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/c7d2fe/ffffff?text=Attributes',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Giải thích chi tiết ý nghĩa từng chỉ số Mental, Technical, Physical.',
    views: 67000,
    likes: 3400,
    date: '2024-01-20',
  },
  {
    title: 'Vị trí và Tố chất cầu thủ',
    category: 'Guide',
    author: 'FM Insight',
    image: 'https://placehold.co/400x500/e0e7ff/ffffff?text=Positions',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Mỗi vị trí cần những tố chất gì để thi đấu đỉnh cao.',
    views: 19000,
    likes: 420,
    date: '2024-04-12',
  },
  {
    title: 'CA (Current Ability) & PA (Potential Ability)',
    category: 'Guide',
    author: 'FM-VN',
    image: 'https://placehold.co/400x500/dbeafe/ffffff?text=CA+PA',
    downloadLink: 'http://fm-vn.com/diendan/showthread.php?30606',
    description: 'Tìm hiểu về chỉ số hiện tại và tiềm năng ẩn của cầu thủ.',
    views: 55000,
    likes: 2100,
    date: '2024-05-01',
  }
];

// --- COMPONENTS ---

// 1. Resource Card
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
    <div className="group relative flex flex-col bg-gradient-to-b from-[#6cb968] to-[#4ca048] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-green-600/30 h-full">

      {/* Category Tag */}
      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm z-20 uppercase tracking-wide">
        {item.category}
      </div>

      {/* Heart Button */}
      <button
        onClick={handleLikeClick}
        className={`absolute top-2 left-2 z-20 p-1.5 rounded-full transition-all duration-300 shadow-sm ${liked
            ? 'bg-red-500 text-white scale-110'
            : 'bg-black/20 text-white hover:bg-red-500/80 hover:scale-105 backdrop-blur-sm'
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
          className="absolute top-10 left-2 bg-blue-600 text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          title="Chỉnh sửa"
        >
          <Edit size={14} />
        </button>
      )}

      {/* Image Section */}
      <div
        className="relative h-48 w-full flex items-end justify-center pt-4 overflow-hidden bg-gradient-to-b from-green-400/50 to-transparent cursor-pointer"
        onClick={() => onViewDetail(item)}
      >
        <div className="absolute w-32 h-32 bg-white/30 rounded-full blur-2xl mb-4"></div>
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/cccccc/666666?text=No+Image'; }}
          className="relative z-10 h-44 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center text-center p-3 pt-1 flex-grow">
        <h3
          className="text-white font-bold text-base leading-tight mb-1 drop-shadow-md line-clamp-2 min-h-[40px] flex items-center justify-center cursor-pointer hover:underline"
          onClick={() => onViewDetail(item)}
        >
          {item.title}
        </h3>

        {/* Author Credit */}
        <div className="flex items-center gap-1 text-green-100 text-[11px] mb-3 bg-black/10 px-2 py-0.5 rounded-full">
          <User size={10} />
          <span className="truncate max-w-[120px]">{item.author}</span>
        </div>

        {/* Buttons Layout */}
        <div className="grid grid-cols-2 gap-2 w-full mb-3 px-2 mt-auto">
          {/* Download */}
          <a
            href={item.downloadLink}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 bg-white hover:bg-gray-100 text-green-700 text-[11px] font-bold py-2 rounded shadow-md transition-colors flex items-center justify-center gap-1 border-b-2 border-green-800"
          >
            <Download size={14} /> DOWNLOAD
          </a>

          {/* Details & Donate */}
          <button
            onClick={() => onViewDetail(item)}
            className="col-span-1 bg-black/20 hover:bg-black/30 text-white text-[11px] font-bold py-2 rounded border border-white/20 backdrop-blur-sm transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <Info size={14} /> CHI TIẾT
          </button>

          <button
            onClick={handleDonateClick}
            className="col-span-1 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-bold py-2 rounded shadow-sm flex items-center justify-center gap-1 transition-colors border-b-2 border-yellow-700"
          >
            <Coffee size={14} /> DONATE
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/20 px-3 py-2 flex justify-between items-center text-[10px] text-green-50 font-medium w-full border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Lượt xem">
            <Eye size={10} /> {item.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-pink-200" title="Lượt thích">
            <Heart size={10} fill="currentColor" /> {(item.likes || 0).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={10} /> {item.date}
        </div>
      </div>
    </div>
  );
};

// 2. Donate Modal
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Coffee size={32} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Mời tác giả ly cà phê!</h2>
          <p className="text-white/90 text-xs">Ủng hộ trực tiếp cho: <strong>{item.author}</strong></p>
        </div>

        <div className="p-6 text-center space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 inline-block bg-gray-50">
            <div className="w-48 h-48 bg-white flex items-center justify-center mx-auto">
              <img
                src={qrUrl}
                alt="QR Code Donate"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Quét mã QR để chuyển khoản</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Ngân hàng</span>
              <span className="font-bold text-gray-800">{item.bankName}</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Số tài khoản</span>
              <span className="font-bold text-green-600 text-lg tracking-wider">{item.bankAccount}</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Chủ tài khoản</span>
              <span className="font-bold text-gray-800">{item.bankOwner}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Detail Modal
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-6 border-r border-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-64 md:max-h-full object-contain drop-shadow-xl"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/cccccc/666666?text=No+Image'; }}
          />
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              {item.category}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{item.title}</h2>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-1">
              <User size={14} className="text-green-600" /> <span className="font-medium text-gray-700">{item.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-pink-500" /> <span>{(item.likes || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} className="text-green-600" /> <span>{item.views.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-8 flex-grow">
            <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Mô tả / Hướng dẫn</h4>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {item.description || "Chưa có mô tả chi tiết cho tài nguyên này."}
            </p>
          </div>

          <div className="mt-auto pt-4 space-y-3">
            <a
              href={item.downloadLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Download size={20} /> TẢI XUỐNG NGAY
            </a>
            <button
              onClick={onDonate}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border-b-2 border-yellow-600"
            >
              <Coffee size={18} /> ỦNG HỘ TÁC GIẢ (DONATE)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Admin Modal
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
  const [items, setItems] = useState<ResourceItem[]>([]);
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

  // Derived Admin State: Admin is logged in via email AND matches specific admin email
  const isAdmin = user && !user.isAnonymous && user.email === ADMIN_EMAIL;

  // 1. Initial Auth & Load Data
  useEffect(() => {
    const init = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
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

  // 2. Fetch Data
  useEffect(() => {
    if (!user) return;

    // Switch path based on Environment (Sandbox vs Custom)
    const colRef = IS_SANDBOX
      ? collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources')
      : collection(db, 'fm_resources');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setPermissionError(false); // Clear previous errors
      if (snapshot.empty) {
        // Only seed if we have write permission (which we might not initially)
        // In real app, seeding usually done manually or via admin script
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

  const handleViewDetail = (item: ResourceItem) => {
    setViewingItem(item);
    setIsDetailModalOpen(true);
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
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 flex flex-col">

      {/* HEADER */}
      <header className="bg-[#1a1f2c] text-white shadow-xl sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory('All')}>
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold text-xl shadow-lg shadow-green-500/50">FM</div>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight">FM RES HUB</h1>
                <p className="text-[10px] text-gray-400 tracking-wider">VIETNAM COMMUNITY</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${selectedCategory === cat
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm face, logo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:ring-1 focus:ring-green-500 outline-none w-32 md:w-48 transition-all focus:w-64"
                />
              </div>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                    title="Thêm Item Mới"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 text-red-400 hover:text-red-300 p-2 rounded-full"
                    title="Đăng xuất Admin"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-400 hover:text-white p-2"
                  title="Admin Login"
                >
                  <User size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden border-t border-gray-800 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex p-2 space-x-2 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
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
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-1 text-center">
          <p className="text-xs text-yellow-700 font-bold flex items-center justify-center gap-2">
            <LayoutDashboard size={12} /> ADMIN MODE ACTIVE (Email: {user.email})
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

      {/* HERO */}
      <div className="bg-[#1a1f2c] border-b border-gray-800">
        <div
          className="container mx-auto px-4 py-8 md:py-12 bg-cover bg-center rounded-b-3xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-[#1a1f2c]"></div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              KHO TÀI NGUYÊN <span className="text-green-500">FOOTBALL MANAGER</span>
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
              Nơi tổng hợp tất cả tài nguyên Facepack, Logo, Kits, Guide và Việt Hóa chất lượng cao nhất cho cộng đồng FM Việt Nam.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-green-900/50 transition-all transform hover:-translate-y-0.5">
                TẢI MỚI NHẤT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-600 rounded-full block"></span>
            {selectedCategory === 'All' ? 'Tài nguyên nổi bật' : selectedCategory}
          </h3>
          <span className="text-xs text-gray-500 font-medium">Hiển thị {filteredItems.length} kết quả</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có dữ liệu cho mục này.</p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsEditModalOpen(true);
                }}
                className="mt-4 text-green-600 font-bold text-sm hover:underline"
              >
                + Thêm bài viết ngay
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group/card">
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
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover/card:opacity-100 transition-all z-30 hover:bg-red-600 hover:scale-110"
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
      <footer className="bg-[#1a1f2c] text-gray-400 py-8 border-t border-gray-800 text-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 font-medium text-gray-300">FM Resources Hub © 2025</p>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Login Modal (Real Firebase Auth) */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl transform transition-all">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LogIn size={20} className="text-green-600" /> Admin Login
            </h3>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="admin@example.com"
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="******"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-600 text-white rounded font-bold hover:bg-green-700 text-sm shadow-md"
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