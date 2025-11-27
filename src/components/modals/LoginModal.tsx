import { useState } from 'react'; // Bỏ React, giữ useState
import { LogIn } from 'lucide-react';
import { signInWithEmailAndPassword, type Auth, signOut, signInAnonymously } from 'firebase/auth'; // Thêm type vào Auth

export default function LoginModal({ isOpen, onClose, auth, adminEmail }: { isOpen: boolean; onClose: () => void; auth: Auth; adminEmail: string }) {
  // ... Code giữ nguyên ...
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email !== adminEmail) {
        alert("Không phải tài khoản Admin!");
        await signOut(auth); await signInAnonymously(auth);
      } else {
        onClose();
      }
    } catch (err: any) { alert("Lỗi: " + err.message); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 justify-center">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><LogIn size={24} className="text-emerald-500" /></div> Admin Login
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-5"><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="admin@example.com" /></div>
          <div className="mb-8"><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" placeholder="••••••••" /></div>
          <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white">Hủy</button><button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Đăng nhập</button></div>
        </form>
      </div>
    </div>
  );
}