import { useState, useEffect } from 'react';
import { addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
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
import ViewItem from './pages/ViewItem'; // Import trang chi tiết mới

export default function App() {
  // State quản lý dữ liệu danh sách
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  // Routing State
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để chuyển trang
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [filterVersion, setFilterVersion] = useState<GameVersion>('All');

  // Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

  const isAdmin = user && !user.isAnonymous && user.email === ADMIN_EMAIL;

  // 1. Handle URL Change (Logic Category)
  useEffect(() => {
    // Chỉ xử lý category nếu KHÔNG PHẢI là trang chi tiết item
    if (!location.pathname.startsWith('/item/')) {
      const currentSlug = location.pathname.substring(1); 
      if (!currentSlug) {
        setSelectedCategory('All');
      } else {
        const foundCategory = CATEGORIES.find(c => toSlug(c) === currentSlug);
        if (foundCategory) setSelectedCategory(foundCategory);
        else setSelectedCategory('All');
      }
    }
  }, [location]);

  // 2. Auth & Data Logic (Giữ nguyên)
  useEffect(() => {
    const init = async () => {
      try {
        const globalToken = (window as any)['__initial_auth_token'];
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
           const getTime = (item: ResourceItem) => {
             if (item.createdAt && item.createdAt.seconds) return item.createdAt.seconds * 1000;
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
        const { id, ...updateData } = data;
        await updateDoc(docRef, updateData);
      } else {
        await addDoc(getCollectionRef(), { ...data, createdAt: serverTimestamp() });
      }
      setIsEditModalOpen(false); setEditingItem(null);
    } catch (error: any) { alert(error.message); }
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
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col">
      {/* Header luôn hiển thị */}
      <Header 
        selectedCategory={selectedCategory} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        isAdmin={isAdmin || false} userEmail={user?.email}
        onLoginClick={() => setShowLogin(true)} onLogoutClick={handleLogout}
        onAddItemClick={() => { setEditingItem(null); setIsEditModalOpen(true); }}
      />
      {permissionError && <div className="bg-red-50 border-b border-red-200 p-4 text-red-700 flex gap-3"><AlertTriangle /> <span>Lỗi quyền truy cập Firestore.</span></div>}

      <Routes>
        {/* Route 1: Trang Chi tiết Item (Dùng file ViewItem mới tạo) */}
        <Route path="/item/:id" element={<ViewItem />} />

        {/* Route 2: Trang Chủ (Mặc định) - Hiển thị danh sách */}
        <Route path="/*" element={
          <>
            <Hero />
            <main className="flex-grow container mx-auto px-4 py-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-emerald-500 rounded-full block shadow-[0_0_15px_rgba(16,185,129,0.6)]"></span>
                    {selectedCategory === 'All' ? 'Tài nguyên nổi bật' : selectedCategory}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 ml-4">
                    <span className="text-xs text-slate-500 uppercase font-bold mr-1">Lọc theo:</span>
                    {(['All', 'FM26', 'FM25', 'FM24'] as GameVersion[]).map(ver => (
                      <button key={ver} onClick={() => setFilterVersion(ver)} className={`px-3 py-1 rounded text-[10px] font-bold border transition-all ${filterVersion === ver ? 'bg-blue-600 text-white border-blue-500 shadow' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}>{ver === 'All' ? 'TẤT CẢ' : ver}</button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">{isLoading ? '...' : filteredItems.length} kết quả</span>
              </div>

              <ResourceList 
                isLoading={isLoading} items={filteredItems} isAdmin={isAdmin || false}
                onEdit={(item) => { setEditingItem(item); setIsEditModalOpen(true); }}
                onDelete={handleDeleteItem} 
                onViewDetail={handleViewDetail} // Bây giờ hàm này sẽ navigate
                onLike={handleLikeItem}
                onDonate={handleViewDetail} // Donate ở ngoài cũng bấm vào chi tiết để hiện popup
                onAddNew={() => { setEditingItem(null); setIsEditModalOpen(true); }}
              />
            </main>
          </>
        } />
      </Routes>

      <Footer />
      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} auth={auth} adminEmail={ADMIN_EMAIL} />}
      <AdminModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={editingItem} onSave={handleSaveItem} />
    </div>
  );
}