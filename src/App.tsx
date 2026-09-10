import { useState, useEffect, useMemo } from 'react';
import { addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { type User, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { AlertTriangle } from 'lucide-react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom'; // Thêm Routes, Route, useNavigate

import { auth, db, getCollectionRef, checkIsSandbox, appId } from './firebase';
import { CATEGORIES, ADMIN_EMAIL, toSlug, type ResourceItem, type Category, type GameVersion } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ResourceList from './components/ResourceList';
import AdminModal from './components/modals/AdminModal';
import LoginModal from './components/modals/LoginModal';
import DownloadSafetyModal from './components/modals/DownloadSafetyModal';
import PolicyModal from './components/modals/PolicyModal';
import DonateModal from './components/modals/DonateModal';
import ViewItem from './pages/ViewItem'; // Import trang chi tiết mới

export default function App() {
  // State quản lý dữ liệu danh sách
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  // Routing State
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để chuyển trang
  const [filterVersion, setFilterVersion] = useState<GameVersion>('All');

  // Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [safetyModalItem, setSafetyModalItem] = useState<ResourceItem | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [donateItem, setDonateItem] = useState<ResourceItem | null>(null);

  const isAdmin = user && !user.isAnonymous && user.email === ADMIN_EMAIL;

  // 1. Derive Category from URL
  const selectedCategory: Category = useMemo(() => {
    if (location.pathname.startsWith('/item/')) return 'All';
    const currentSlug = location.pathname.substring(1);
    if (!currentSlug) return 'All';
    return CATEGORIES.find(c => toSlug(c) === currentSlug) || 'All';
  }, [location.pathname]);

  // 2. Auth & Data Logic (Giữ nguyên)
  useEffect(() => {
    const init = async () => {
      try {
        const globalToken = (window as unknown as Record<string, unknown>)['__initial_auth_token'] as string | undefined;
        if (globalToken) await signInWithCustomToken(auth, globalToken);
        else await signInAnonymously(auth);
      } catch (e) { console.error(e) }
    };
    init();
    return onAuthStateChanged(auth, (u) => { setUser(u); setIsAuthReady(true); });
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) return;
    const unsubscribe = onSnapshot(getCollectionRef(), (snapshot) => {
      setPermissionError(false);
      setIsLoading(false);
      if (!snapshot.empty) {
        const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, likes: 0, ...doc.data() } as ResourceItem));
        // Sắp xếp mới nhất lên đầu
        fetchedItems.sort((a, b) => {
           const getTime = (item: ResourceItem): number => {
             if (item.createdAt && typeof item.createdAt === 'object' && 'seconds' in item.createdAt && typeof (item.createdAt as { seconds: number }).seconds === 'number') {
               return (item.createdAt as { seconds: number }).seconds * 1000;
             }
             if (item.date) return new Date(item.date).getTime();
             return 0;
           };
           return getTime(b) - getTime(a);
        });
        setItems(fetchedItems);
      } else setItems([]);
    }, (error) => {
      setIsLoading(false);
      if (error.code === 'permission-denied') setPermissionError(true);
    });
    return () => unsubscribe();
  }, [isAuthReady, user]);

  // 3. Action Handlers
  const handleLogout = async () => { await signOut(auth); await signInAnonymously(auth); };
  
  const handleSaveItem = async (data: ResourceItem) => {
    if (!user) return;
    try {
      if (editingItem && editingItem.id) {
        const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', editingItem.id) : doc(db, 'fm_resources_v1', editingItem.id);
        const updateData = { ...data };
        delete updateData.id;
        await updateDoc(docRef, updateData);
      } else {
        await addDoc(getCollectionRef(), { ...data, createdAt: serverTimestamp() });
      }
      setIsEditModalOpen(false); setEditingItem(null);
    } catch (error: unknown) { alert(error instanceof Error ? error.message : String(error)); }
  };

  const handleDeleteItem = async (id: string) => {
     if(!confirm("Xóa?")) return;
     const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', id) : doc(db, 'fm_resources_v1', id);
     await deleteDoc(docRef);
  };
  
  const handleLikeItem = async (item: ResourceItem) => {
    if (!item.id) return;
    const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', item.id) : doc(db, 'fm_resources_v1', item.id);
    await updateDoc(docRef, { likes: increment(1) });
  };

  // --- HÀM QUAN TRỌNG: CHUYỂN HƯỚNG SANG TRANG CHI TIẾT ---
  const handleViewDetail = (item: ResourceItem) => {
    if (item.id) {
       // Tăng view ở background
       const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', item.id) : doc(db, 'fm_resources_v1', item.id);
       updateDoc(docRef, { views: increment(1) }).catch(console.error);
       
       // Chuyển hướng URL
       navigate(`/item/${item.id}`);
    }
  };

  // 4. Filter Logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory || (item.tags && item.tags.includes(selectedCategory));
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVersion = filterVersion === 'All' || !item.version || item.version === 'All' || item.version === filterVersion;
    return matchesCategory && matchesSearch && matchesVersion;
  });

  return (
    <div className="min-h-screen bg-[#110b22] font-sans text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Header luôn hiển thị */}
      <Header 
        selectedCategory={selectedCategory} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        isAdmin={isAdmin || false} userEmail={user?.email || undefined}
        onLoginClick={() => setShowLogin(true)} onLogoutClick={handleLogout}
        onAddItemClick={() => { setEditingItem(null); setIsEditModalOpen(true); }}
      />
      {permissionError && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 p-4 text-rose-300 flex items-center justify-center gap-3 text-sm font-semibold">
          <AlertTriangle className="text-rose-400 shrink-0" size={18} /> 
          <span>Không thể kết nối với Firestore. Vui lòng kiểm tra quyền truy cập hoặc kết nối mạng.</span>
        </div>
      )}

      <Routes>
        {/* Route 1: Trang Chi tiết Item */}
        <Route path="/item/:id" element={<ViewItem />} />

        {/* Route 2: Trang Chủ (Mặc định) - Hiển thị danh sách */}
        <Route path="/*" element={
          <>
            <Hero />
            <main id="resource-list-section" className="flex-grow container mx-auto px-4 py-10 md:py-14">
              
              {/* Filter & Section Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-5 border-b border-violet-500/20 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-7 bg-gradient-to-b from-violet-500 via-purple-500 to-cyan-400 rounded-full block shadow-[0_0_12px_rgba(139,92,246,0.6)]"></span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                      {selectedCategory === 'All' ? 'Tất cả tài nguyên' : selectedCategory}
                    </h3>
                  </div>

                  {/* Version Pill Filter */}
                  <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                    <span className="text-xs text-violet-300/70 uppercase font-bold tracking-wider mr-1">Phiên bản:</span>
                    {(['All', 'FM26', 'FM25', 'FM24'] as GameVersion[]).map(ver => {
                      const isSelected = filterVersion === ver;
                      const isFm26 = ver === 'FM26';
                      return (
                        <button 
                          key={ver} 
                          onClick={() => setFilterVersion(ver)} 
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? isFm26
                                ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white shadow-md shadow-violet-600/30 border border-violet-400'
                                : 'bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-400'
                              : 'bg-[#1c1439] text-slate-300 border border-violet-500/20 hover:bg-violet-900/30 hover:text-white'
                          }`}
                        >
                          {isFm26 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>}
                          {ver === 'All' ? 'TẤT CẢ' : ver}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Counter Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-violet-300 bg-[#1e153c] px-3.5 py-1.5 rounded-xl border border-violet-500/25 shadow-sm font-display">
                    {isLoading ? 'Đang tải...' : `${filteredItems.length} tài nguyên`}
                  </span>
                </div>
              </div>

              <ResourceList 
                isLoading={isLoading} 
                items={filteredItems} 
                isAdmin={isAdmin || false}
                onEdit={(item) => { setEditingItem(item); setIsEditModalOpen(true); }}
                onDelete={handleDeleteItem} 
                onViewDetail={handleViewDetail}
                onLike={handleLikeItem}
                onDonate={(item) => setDonateItem(item)}
                onDownload={(item) => setSafetyModalItem(item)}
                onAddNew={() => { setEditingItem(null); setIsEditModalOpen(true); }}
              />
            </main>
          </>
        } />
      </Routes>

      <Footer onOpenPolicy={() => setShowPolicyModal(true)} />
      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} auth={auth} adminEmail={ADMIN_EMAIL} />}
      <AdminModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={editingItem} onSave={handleSaveItem} />
      <DownloadSafetyModal isOpen={!!safetyModalItem} onClose={() => setSafetyModalItem(null)} item={safetyModalItem} />
      <PolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />
      <DonateModal isOpen={!!donateItem} onClose={() => setDonateItem(null)} item={donateItem} />
    </div>
  );
}