import { useState, useEffect } from 'react'; // Xóa React, chỉ giữ hook
import { addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken, signOut } from 'firebase/auth';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { auth, db, getCollectionRef, checkIsSandbox, appId } from './firebase';
// CHÚ Ý DÒNG DƯỚI: Thêm chữ type vào trước interface
import { CATEGORIES, ADMIN_EMAIL, toSlug, type ResourceItem, type Category } from './types'; 
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ResourceList from './components/ResourceList';
import AdminModal from './components/modals/AdminModal';
import DetailPage from './components/modals/DetailPage';
import DonateModal from './components/modals/DonateModal';
import LoginModal from './components/modals/LoginModal';

export default function App() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  // Routing State
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  // Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateItem, setDonateItem] = useState<ResourceItem | null>(null);

  const isAdmin = user && !user.isAnonymous && user.email === ADMIN_EMAIL;

  // 1. Handle URL Change (Logic Routing)
  useEffect(() => {
    const currentSlug = location.pathname.substring(1); 
    if (!currentSlug) {
      setSelectedCategory('All');
    } else {
      const foundCategory = CATEGORIES.find(c => toSlug(c) === currentSlug);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      } else {
        setSelectedCategory('All');
      }
    }
  }, [location]);

  // 2. Auth & Data Logic
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
      if (!snapshot.empty) setItems(snapshot.docs.map(doc => ({ id: doc.id, likes: 0, ...doc.data() } as ResourceItem)));
      else setItems([]);
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
        const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', editingItem.id) : doc(db, 'fm_resources_public', editingItem.id);
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
     const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', id) : doc(db, 'fm_resources_public', id);
     await deleteDoc(docRef);
  };
  
  const handleLikeItem = async (item: ResourceItem) => {
    if (!item.id) return;
    const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', item.id) : doc(db, 'fm_resources_public', item.id);
    await updateDoc(docRef, { likes: increment(1) });
  };

  const handleViewDetail = async (item: ResourceItem) => {
    setSelectedItem(item);
    if (item.id) {
       const docRef = checkIsSandbox() ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_public', item.id) : doc(db, 'fm_resources_public', item.id);
       await updateDoc(docRef, { views: increment(1) });
    }
  };

  // 4. Filter Logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col">
      <Header 
        selectedCategory={selectedCategory} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        isAdmin={isAdmin || false} userEmail={user?.email}
        onLoginClick={() => setShowLogin(true)} onLogoutClick={handleLogout}
        onAddItemClick={() => { setEditingItem(null); setIsEditModalOpen(true); }}
      />
      {permissionError && <div className="bg-red-50 border-b border-red-200 p-4 text-red-700 flex gap-3"><AlertTriangle /> <span>Lỗi quyền truy cập Firestore.</span></div>}
      <Hero />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-4 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full block shadow-[0_0_15px_rgba(16,185,129,0.6)]"></span>
              {selectedCategory === 'All' ? 'Tài nguyên nổi bật' : selectedCategory}
            </h3>
            <p className="text-slate-500 text-xs mt-2 ml-4">Cập nhật mới nhất từ cộng đồng</p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800">{isLoading ? '...' : filteredItems.length} kết quả</span>
        </div>
        <ResourceList 
          isLoading={isLoading} items={filteredItems} isAdmin={isAdmin || false}
          onEdit={(item) => { setEditingItem(item); setIsEditModalOpen(true); }}
          onDelete={handleDeleteItem} onViewDetail={handleViewDetail} onLike={handleLikeItem}
          onDonate={(item) => { setDonateItem(item); setIsDonateModalOpen(true); }}
          onAddNew={() => { setEditingItem(null); setIsEditModalOpen(true); }}
        />
      </main>
      <Footer />
      {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} auth={auth} adminEmail={ADMIN_EMAIL} />}
      <AdminModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={editingItem} onSave={handleSaveItem} />
      <DetailPage item={selectedItem} onClose={() => setSelectedItem(null)} onDonate={() => { setDonateItem(selectedItem); setIsDonateModalOpen(true); }} />
      <DonateModal isOpen={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} item={donateItem} />
    </div>
  );
}