import { useState } from 'react';
import { LogIn, Lock, Mail, X } from 'lucide-react';
import { signInWithEmailAndPassword, type Auth, signOut, signInAnonymously } from 'firebase/auth';

export default function LoginModal({ isOpen, onClose, auth, adminEmail }: { isOpen: boolean; onClose: () => void; auth: Auth; adminEmail: string }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email !== adminEmail) {
        alert("Tài khoản không có quyền Quản trị viên!");
        await signOut(auth); 
        await signInAnonymously(auth);
      } else {
        onClose();
      }
    } catch (err: unknown) { 
      alert("Lỗi đăng nhập: " + (err instanceof Error ? err.message : String(err))); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#1c133a] rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-violet-500/30 relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-violet-400 hover:text-white p-1 rounded-full hover:bg-violet-900/40 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-violet-600/20 border border-violet-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-cyan-300 shadow-md">
            <LogIn size={26} />
          </div>
          <h3 className="text-xl font-black text-white font-display">Đăng nhập Admin</h3>
          <p className="text-xs text-violet-300/70 mt-1">Dành cho ban quản trị Football Manager Hub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-violet-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail size={13} /> Email quản trị
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-[#130d25] border border-violet-500/20 rounded-xl p-3 text-sm text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all placeholder:text-slate-500" 
              placeholder="admin@example.com" 
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock size={13} /> Mật khẩu
            </label>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              className="w-full bg-[#130d25] border border-violet-500/20 rounded-xl p-3 text-sm text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all placeholder:text-slate-500" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-[#261a49] hover:bg-[#322360] rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-105"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}