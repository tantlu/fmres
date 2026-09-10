import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, checkIsSandbox, appId } from '../firebase';
import { type ResourceItem } from '../types';
import DetailPage from '../components/modals/DetailPage';
import DonateModal from '../components/modals/DonateModal';

export default function ViewItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // --- HÀM XỬ LÝ QUAY LẠI THÔNG MINH ---
  const handleBack = () => {
    // window.history.state.idx: Chỉ số lịch sử của React Router
    // Nếu > 0 nghĩa là người dùng đã duyệt qua các trang trước đó trong web này
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Quay lại trang trước (giữ vị trí scroll)
    } else {
      navigate('/', { replace: true }); // Về trang chủ (nếu là link trực tiếp)
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const docRef = checkIsSandbox() 
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', id) 
          : doc(db, 'fm_resources_v1', id);
          
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as ResourceItem);
        } else {
          // Nếu bài không tồn tại, tự động về trang chủ sau thông báo
          alert("Bài viết không tồn tại hoặc đã bị xóa!");
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#110b22] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-violet-300 text-sm font-bold animate-pulse font-display">Đang tải tài nguyên...</p>
      </div>
    </div>
  );

  return (
    <>
      <DetailPage 
        item={item} 
        onClose={handleBack} // <-- Sử dụng hàm xử lý mới ở đây
        onDonate={() => setIsDonateOpen(true)}
      />
      <DonateModal 
        isOpen={isDonateOpen} 
        onClose={() => setIsDonateOpen(false)} 
        item={item} 
      />
    </>
  );
}