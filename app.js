import React, { useState, useEffect } from 'react';
// Import Firebase Auth
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase'; // Sesuaikan path jika berbeda

// Import ikon yang kamu butuhkan (tetap seperti kodemu)
import { 
  LayoutDashboard, FolderKanban, Bell, Search, Filter, 
  CheckCircle2, Clock, AlertCircle, ChevronLeft, FileText, 
  ListTodo, Grid, Image as ImageIcon, HardDrive, Upload, 
  Download, User, MapPin, Plus, MoreVertical, File, Folder,
  Menu, X, Trash2, LogOut // Tambahkan ikon LogOut
} from 'lucide-react';

// ... (MOCK DATA TETAP DI SINI SEMENTARA KITA BELUM MASUK TAHAP 2) ...

export default function App() {
  const [user, setUser] = useState(null); // State untuk menyimpan data user yang login
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mengecek apakah user sudah login setiap kali aplikasi dibuka
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Login dengan Google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Gagal login:", error.message);
    }
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Gagal logout:", error.message);
    }
  };

  // Fungsi Navigasi (tetap seperti aslinya)
  const navigateTo = (view, project = null) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); 
    if (project) {
      setSelectedProject(project);
      setActiveTab('overview');
    }
  };

  // TAMPILAN LOGIN (Jika user belum login)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <FolderKanban size={48} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">ArchiManage</h1>
          <p className="text-slate-500 mb-8 text-sm">Manajemen Proyek Arsitektur Terpadu</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  // TAMPILAN APLIKASI UTAMA (Jika user sudah login)
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Kode aslimu untuk Sidebar, Topbar, dan Main Area ditaruh di sini */}
      {/* Jangan lupa tambahkan tombol Logout di Sidebar bagian bawah! */}
      
      {/* Contoh penambahan tombol Logout di profil sidebar: */}
      {/* <div className="p-4 border-t border-slate-800 shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full" />
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400">
             <LogOut size={18} />
          </button>
        </div>
      */}

      {/* Sisanya biarkan sama persis dengan kodemu sebelumnya */}
    </div>
  );
}

// ... (KODE VIEW LAINNYA DI BAWAH SINI TETAP SAMA) ...
