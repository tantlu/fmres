import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, checkIsSandbox, appId } from '../firebase';
import { type ResourceItem } from '../types';
import DetailPage from '../components/modals/DetailPage';
import DonateModal from '../components/modals/DonateModal';

export default function ViewItem() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [item, setItem] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        // Logic tìm đúng đường dẫn collection y hệt file App
        const docRef = checkIsSandbox() 
          ? doc(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1', id) 
          : doc(db, 'fm_resources_v1', id);
          
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as ResourceItem);
        } else {
          alert("Bài viết không tồn tại hoặc đã bị xóa!");
          navigate('/');
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Đang tải...</div>;

  return (
    <>
      <DetailPage 
        item={item} 
        onClose={() => navigate(-1)} // Quay lại trang trước
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