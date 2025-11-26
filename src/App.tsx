import React, { useState, useEffect, useRef } from 'react';
import {
  Download, Eye, Calendar, User, Search, X,
  Plus, Trash2, Edit, Save, LogIn, LogOut,
  Info, Heart, Coffee, AlertTriangle, Star, Crown,
  Bold, Italic, List, Image as ImageIcon, ArrowLeft, Check
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, increment
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  signInWithCustomToken, signInWithEmailAndPassword, signOut
} from 'firebase/auth';

// --- HELPER FUNCTIONS (SAFE GLOBAL ACCESS) ---
const getGlobal = (key: string) => {
  if (typeof window !== 'undefined') {
    return (window as any)[key];
  }
  return undefined;
};

// Hàm kiểm tra môi trường an toàn
const checkIsSandbox = () => {
  return typeof getGlobal('__firebase_config') !== 'undefined';
};

// --- FIREBASE CONFIGURATION ---

const YOUR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCSzggBgIGpa_galV9C2srBjVG8AFmxsYA",
  authDomain: "fmhub-ae832.firebaseapp.com",
  projectId: "fmhub-ae832",
  storageBucket: "fmhub-ae832.firebasestorage.app",
  messagingSenderId: "948273341866",
  appId: "1:948273341866:web:0017bf1bf95c613def77d3",
  measurementId: "G-TKF13CZEB0"
};

// Logic chọn cấu hình
const sandboxConfig = getGlobal('__firebase_config');
const firebaseConfig = checkIsSandbox() ? JSON.parse(sandboxConfig) : YOUR_FIREBASE_CONFIG;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const globalAppId = getGlobal('__app_id');
const appId = typeof globalAppId !== 'undefined' ? globalAppId : 'default-app-id';

// Hàm lấy Collection Reference thống nhất
const getCollectionRef = () => {
  if (checkIsSandbox()) {
    return collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1');
  }
  return collection(db, 'fm_resources_v1');
};

// --- ADMIN CONFIGURATION ---
const ADMIN_EMAIL = 'nguyentan7799@gmail.com';

// --- DATA TYPES & CONSTANTS ---
type Category = 'All' | 'Face' | 'Logo' | 'Database' | 'Việt hóa' | 'Tactics' | 'Guide' | 'Kits';

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
  donateLink?: string;
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
}

const CATEGORIES: Category[] = ['All', 'Face', 'Logo', 'Database', 'Việt hóa', 'Tactics', 'Guide', 'Kits'];

// Dữ liệu khởi tạo rỗng
const SEED_DATA: ResourceItem[] = [];

// --- COMPONENTS ---

const RichTextEditor = ({
  value,
  onChange
}: {
  value: string;
  onChange: (html: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddImage = () => {
    const url = prompt("Nhập đường dẫn (URL) ảnh của bạn:");
    if (url) {
      execCommand('insertImage', url);
    }
  };

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-[#0f172a]">
      <div className="flex items-center gap-1 p-2 bg-slate-800 border-b border-slate-700">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
          title="In đậm"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
          title="In nghiêng"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
          title="Danh sách"
        >
          <List size={16} />
        </button>
        <div className="w-px h-4 bg-slate-600 mx-1"></div>
        <button
          type="button"
          onClick={handleAddImage}
          className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 rounded flex items-center gap-1"
          title="Chèn ảnh từ URL"
        >
          <ImageIcon size={16} /> <span className="text-xs font-bold">Ảnh</span>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 text-slate-300 focus:outline-none prose prose-invert prose-sm max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <p className="text-[10px] text-slate-500 p-2 bg-slate-900 italic">
        Mẹo: Bạn có thể copy ảnh từ nơi khác và paste trực tiếp vào đây.
      </p>
    </div>
  );
};

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

      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 z-20 uppercase tracking-wider shadow-sm">
        {item.category}
      </div>

      {item.isHot && (
        <div className="absolute top-3 right-auto left-12 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm z-20 shadow-md animate-pulse">
          HOT
        </div>
      )}

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

      <div className="flex flex-col p-4 flex-grow bg-[#1e293b]">
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-medium">
          <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={10} />
          </div>
          <span className="truncate max-w-[150px] tracking-wide text-slate-300">{item.author}</span>
          <Check size={12} className="text-emerald-500 ml-0.5" strokeWidth={3} />
        </div>

        <h3
          className="text-white font-bold text-sm leading-snug mb-4 line-clamp-2 group-hover:text-amber-400 transition-colors cursor-pointer"
          onClick={() => onViewDetail(item)}
        >
          {item.title}
        </h3>

        <div className="grid grid-cols-2 gap-2 w-full mt-auto">
          <a
            href={item.downloadLink}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Download size={14} /> TẢI VỀ
          </a>

          <button
            onClick={() => onViewDetail(item)}
            className="col-span-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold py-2 rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Info size={14} /> CHI TIẾT
          </button>

          <button
            onClick={handleDonateClick}
            className="col-span-1 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[11px] font-bold py-2 rounded-lg shadow-md shadow-amber-900/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Coffee size={14} /> DONATE
          </button>
        </div>
      </div>

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
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" onClick={onClose}>
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

const DetailPage = ({
  item,
  onClose,
  onDonate
}: {
  item: ResourceItem | null;
  onClose: () => void;
  onDonate: () => void;
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navbar for Detail Page */}
      <div className="sticky top-0 z-10 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between shadow-lg">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400 text-xs">Bạn đang xem chi tiết tài nguyên</span>
          <div className="w-px h-4 bg-slate-700 hidden md:block"></div>
          <button
            onClick={onDonate}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Coffee size={14} /> DONATE
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Image & Main Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1e293b] p-2 rounded-2xl border border-slate-700 shadow-2xl">
              <div className="bg-[#0f172a] rounded-xl overflow-hidden relative aspect-[4/5] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0f172a] to-[#0f172a]"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain relative z-10 hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500/1e293b/94a3b8?text=No+Image'; }}
                />
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-5 space-y-4">
              <div className="flex justify-between text-sm text-slate-400 border-b border-slate-700 pb-3">
                <span>Lượt xem</span>
                <span className="text-white font-mono flex items-center gap-1"><Eye size={14} className="text-sky-500" /> {item.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400 border-b border-slate-700 pb-3">
                <span>Yêu thích</span>
                <span className="text-white font-mono flex items-center gap-1"><Heart size={14} className="text-rose-500" /> {item.likes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Ngày đăng</span>
                <span className="text-white font-mono">{item.date}</span>
              </div>
            </div>

            <a
              href={item.downloadLink}
              target="_blank"
              rel="noreferrer"
              className="w-full block bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
            >
              <Download size={24} /> TẢI XUỐNG NGAY
            </a>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-8 min-h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {item.category}
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-full">
                  <User size={14} /> <span>Tác giả: <strong className="text-slate-200">{item.author}</strong></span>
                  <Check size={14} className="text-emerald-500" strokeWidth={3} />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
                {item.title}
              </h1>

              {/* Render HTML Content Here */}
              <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-4">
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>

              {/* Additional Helper Info */}
              <div className="mt-12 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-start gap-3">
                <Info className="text-blue-400 shrink-0 mt-1" />
                <div className="text-sm text-blue-200/80">
                  <p className="font-bold text-blue-400 mb-1">Hướng dẫn cài đặt:</p>
                  <p>Tải file về, giải nén (nếu có) và chép vào thư mục <code>Documents/Sports Interactive/Football Manager 20xx/graphics</code>. Sau đó vào game, Clear Cache và Reload Skin.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

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
      <div className="bg-[#1e293b] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-600">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-[#1e293b] z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-emerald-500" />}
            {initialData ? 'Chỉnh sửa Item' : 'Tạo Item Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                  placeholder="VD: DF11 Megapack"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tác giả gốc</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                    placeholder="VD: Sortitoutsi"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Ảnh (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Link Download</label>
                <input
                  type="text"
                  value={formData.downloadLink}
                  onChange={e => setFormData({ ...formData, downloadLink: e.target.value })}
                  className="w-full p-3 bg-[#0f172a] border border-slate-600 rounded-lg text-blue-400 focus:border-emerald-500 outline-none"
                  placeholder="Google Drive / Fshare..."
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-2">
              Nội dung bài viết <span className="text-emerald-500 text-[10px] normal-case">(Có thể chèn ảnh minh họa)</span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData({ ...formData, description: html })}
            />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
              <Coffee size={16} /> Cấu hình Donate (Tùy chọn)
            </h4>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formData.donateLink || ''}
                  onChange={e => setFormData({ ...formData, donateLink: e.target.value })}
                  className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white"
                  placeholder="Link Donate (nếu có)..."
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white"
                  placeholder="Tên Ngân hàng"
                />
                <input
                  type="text"
                  value={formData.bankAccount || ''}
                  onChange={e => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white"
                  placeholder="Số Tài khoản"
                />
                <input
                  type="text"
                  value={formData.bankOwner || ''}
                  onChange={e => setFormData({ ...formData, bankOwner: e.target.value })}
                  className="w-full p-2 bg-[#0f172a] border border-slate-600 rounded text-sm text-white"
                  placeholder="Chủ Tài khoản"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-slate-800/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
          >
            <Save size={18} /> Lưu bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [items, setItems] = useState<ResourceItem[]>(SEED_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
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

  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

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
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Fetch Data (BACKGROUND SYNC) - Wait for Auth Ready
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const colRef = getCollectionRef();

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setPermissionError(false);
      setIsLoading(false);

      if (!snapshot.empty) {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          likes: 0,
          ...doc.data()
        })) as ResourceItem[];
        setItems(fetchedItems);
      } else {
        setItems([]);
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      if (error.code === 'permission-denied') {
        setPermissionError(true);
      }
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  // --- HANDLERS ---

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
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
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSaveItem = async (data: ResourceItem) => {
    if (!user) return;
    const colRef = getCollectionRef();

    try {
      if (editingItem && editingItem.id) {
        const docRef = checkIsSandbox()
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', editingItem.id)
          : doc(db, 'fm_resources_public', editingItem.id);

        const { id, ...updateData } = data;
        await updateDoc(docRef, updateData);
      } else {
        await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
      }
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error("Error saving:", error);
      alert("Lỗi khi lưu dữ liệu: " + error.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa item này không?")) return;
    try {
      const docRef = checkIsSandbox()
        ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', id)
        : doc(db, 'fm_resources_public', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleLikeItem = async (item: ResourceItem) => {
    if (!item.id) return;
    try {
      const docRef = checkIsSandbox()
        ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', item.id)
        : doc(db, 'fm_resources_public', item.id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking item:", error);
    }
  };

  const handleViewDetail = async (item: ResourceItem) => {
    setSelectedItem(item);

    if (item.id) {
      try {
        const docRef = checkIsSandbox()
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', item.id)
          : doc(db, 'fm_resources_public', item.id);
        await updateDoc(docRef, {
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
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedCategory('All')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-900/50 text-white group-hover:scale-105 transition-transform">FM</div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight text-white">FM RES <span className="text-emerald-500">HUB</span></h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase">Vietnam Community</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-full border border-slate-700/50">
              {CATEGORIES.slice(0, 9).map(cat => (
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
            <Crown size={16} className="fill-amber-500 text-amber-500" /> ADMIN MODE ACTIVE <span className="opacity-50">|</span> {user.email}
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
              {!checkIsSandbox() ? (
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
            Hiển thị {isLoading ? '...' : filteredItems.length} kết quả
          </span>
        </div>

        {/* LOADING STATE & EMPTY STATE HANDLING */}
        {isLoading ? (
          // SKELETON LOADING UI (Hiệu ứng chờ tải)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-800 h-96 animate-pulse">
                <div className="h-44 bg-slate-800"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-10 bg-slate-800 rounded mt-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
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

      {/* ... FOOTER & MODALS code ... */}
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

      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={editingItem}
        onSave={handleSaveItem}
      />

      {/* FULL PAGE DETAIL VIEW */}
      {selectedItem && (
        <DetailPage
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDonate={() => {
            setDonateItem(selectedItem);
            setIsDonateModalOpen(true);
          }}
        />
      )}

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        item={donateItem}
      />

    </div>
  );
}