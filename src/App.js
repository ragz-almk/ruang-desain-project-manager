import React, { useState, useEffect } from 'react';

// --- IMPORT FIREBASE AUTH ---
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase'; // Pastikan file firebase.js sudah dibuat di folder src

// --- IMPORT IKON ---
import { 
  LayoutDashboard, FolderKanban, Bell, Search, Filter, 
  CheckCircle2, Clock, AlertCircle, ChevronLeft, FileText, 
  ListTodo, Grid, Image as ImageIcon, HardDrive, Upload, 
  Download, User, MapPin, Plus, MoreVertical, File, Folder,
  Menu, X, Trash2, LogOut 
} from 'lucide-react';

// ==========================================
// MOCK DATA (Data Sementara)
// ==========================================
const mockProjects = [
  { id: 1, name: 'Villa Senja', status: 'Ongoing', client: 'Bpk. Budi Santoso', location: 'Ubud, Bali', progress: 65, type: 'Residensial', deadline: '2026-08-15', description: 'Desain villa tropis modern dengan 4 kamar tidur dan kolam renang infinity.' },
  { id: 2, name: 'Kantor Tech Nusantara', status: 'Completed', client: 'PT. Tech Indo', location: 'SCBD, Jakarta', progress: 100, type: 'Komersial', deadline: '2026-01-10', description: 'Renovasi interior kantor startup 3 lantai dengan konsep open space.' },
  { id: 3, name: 'Cafe Ruang Seduh', status: 'On Hold', client: 'Ibu Anita', location: 'Dago, Bandung', progress: 30, type: 'Komersial', deadline: '2026-05-20', description: 'Desain arsitektur dan interior kedai kopi industrial.' },
  { id: 4, name: 'Resort Pantai Mutiara', status: 'Ongoing', client: 'Mutiara Group', location: 'Lombok', progress: 15, type: 'Hospitality', deadline: '2027-02-10', description: 'Masterplan dan desain arsitektur untuk resort bintang 5.' },
];

const mockTasks = [
  { id: 1, project: 'Villa Senja', title: 'Revisi Denah Lantai 1', assignee: 'Andi (Drafter)', due: 'Hari ini', status: 'pending' },
  { id: 2, project: 'Resort Pantai Mutiara', title: 'Rapat Konsep Fasad', assignee: 'Siska (Principal)', due: 'Besok', status: 'pending' },
  { id: 3, project: 'Cafe Ruang Seduh', title: 'Submit RAB Preliminary', assignee: 'Budi (QS)', due: 'Tertunda', status: 'overdue' },
];

const mockActivities = [
  { id: 1, text: 'Andi mengunggah file CAD terbaru', project: 'Villa Senja', time: '2 jam yang lalu' },
  { id: 2, text: 'Klien menyetujui Moodboard Interior', project: 'Kantor Tech Nusantara', time: '5 jam yang lalu' },
  { id: 3, text: 'Tugas "Render Eksterior" selesai', project: 'Resort Pantai Mutiara', time: '1 hari yang lalu' },
];

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // --- STATE UNTUK LOGIN & NAVIGASI ---
  const [user, setUser] = useState(null); // Menyimpan data user yang login
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
      alert("Gagal login. Pastikan konfigurasi Firebase sudah benar.");
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

  // Fungsi Navigasi antar halaman
  const navigateTo = (view, project = null) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); 
    if (project) {
      setSelectedProject(project);
      setActiveTab('overview');
    }
  };

  // --- TAMPILAN LOGIN (Jika user belum login) ---
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
          <div className="flex justify-center mb-4">
            <FolderKanban size={56} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ArchiManage</h1>
          <p className="text-slate-500 mb-8 text-sm">Masuk untuk mengelola proyek arsitektur studio Anda.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <User size={20} /> Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN APLIKASI UTAMA (Jika user sudah login) ---
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            <FolderKanban className="text-blue-500" /> ArchiManage
          </h1>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => navigateTo('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard Utama</span>
          </button>
          <button 
            onClick={() => navigateTo('directory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'directory' || currentView === 'project_detail' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <FolderKanban size={20} />
            <span>Direktori Proyek</span>
          </button>
        </nav>
        
        {/* User Profile & Logout Area di bagian bawah Sidebar */}
        <div className="p-4 border-t border-slate-800 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {user.photoURL ? (
               <img src={user.photoURL} alt="Profil" className="w-10 h-10 rounded-full shrink-0" />
            ) : (
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                 {user.displayName ? user.displayName.charAt(0) : 'U'}
               </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.displayName || 'Pengguna'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Keluar"
            className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 md:hidden">ArchiManage</h1>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input type="text" placeholder="Cari proyek, tugas, atau file..." className="bg-transparent border-none outline-none ml-2 w-full text-sm" />
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="md:hidden relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-slate-50">
          {currentView === 'dashboard' && <DashboardView onNavigate={navigateTo} />}
          {currentView === 'directory' && <DirectoryView onNavigate={navigateTo} />}
          {currentView === 'project_detail' && <ProjectDetailView project={selectedProject} onBack={() => navigateTo('directory')} activeTab={activeTab} setActiveTab={setActiveTab} />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// VIEWS (Halaman & Tab) - Ini persis sama dengan kode awalmu
// ==========================================

function DashboardView({ onNavigate }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Selamat datang kembali!</h2>
        <p className="text-sm md:text-base text-slate-500">Berikut adalah ringkasan aktivitas studio Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Proyek', value: '12', icon: FolderKanban, color: 'bg-blue-500' },
          { label: 'Berjalan', value: '5', icon: Clock, color: 'bg-amber-500' },
          { label: 'Selesai', value: '6', icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Tertunda', value: '1', icon: AlertCircle, color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            <div className={`${stat.color} p-2 md:p-3 rounded-lg text-white shrink-0`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-900">Tugas Mendesak</h3>
            <button className="text-xs md:text-sm text-blue-600 font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {mockTasks.map(task => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer gap-2 sm:gap-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-3.5 h-3.5 shrink-0 rounded-full border-2 ${task.status === 'overdue' ? 'border-red-500' : 'border-amber-500'}`}></div>
                  <div>
                    <p className="text-sm md:text-base font-semibold text-slate-900 leading-tight">{task.title}</p>
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5">{task.project} • {task.assignee}</p>
                  </div>
                </div>
                <div className="ml-6 sm:ml-0">
                  <span className={`text-[10px] md:text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${task.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {task.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 md:mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-5 md:space-y-6">
            {mockActivities.map(act => (
              <div key={act.id} className="relative pl-5 md:pl-6 border-l-2 border-slate-100 last:border-transparent">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-xs md:text-sm font-medium text-slate-800 leading-snug">{act.text}</p>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                  <span className="text-[10px] md:text-xs text-blue-600 font-medium">{act.project}</span>
                  <span className="text-[10px] md:text-xs text-slate-400">• {act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryView({ onNavigate }) {
  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Direktori Proyek</h2>
          <p className="text-sm md:text-base text-slate-500">Kelola semua proyek arsitektur studio Anda.</p>
        </div>
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm md:text-base font-medium flex justify-center items-center gap-2 transition-colors">
          <Plus size={18} /> Proyek Baru
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1 bg-white border border-slate-200 rounded-lg flex items-center px-3 py-2.5 md:py-2 shadow-sm">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input type="text" placeholder="Cari proyek atau klien..." className="bg-transparent border-none outline-none ml-2 w-full text-sm" />
        </div>
        <div className="flex gap-2">
          <select className="flex-1 sm:flex-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 md:py-2 text-sm text-slate-700 shadow-sm outline-none">
            <option>Semua Status</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
          <button className="bg-white border border-slate-200 p-2.5 md:p-2 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockProjects.map(project => (
          <div 
            key={project.id} 
            onClick={() => onNavigate('project_detail', project)}
            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
          >
            <div className="p-4 md:p-5 flex-1">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-md 
                  ${project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 
                    project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                    'bg-slate-100 text-slate-700'}`}
                >
                  {project.status}
                </span>
                <button className="text-slate-400 hover:text-slate-600 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1">
                  <MoreVertical size={16} />
                </button>
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 leading-tight">{project.name}</h3>
              <p className="text-xs md:text-sm text-slate-500 mb-3 md:mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-1.5 md:space-y-2 mb-2">
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                  <User size={14} className="text-slate-400 shrink-0" /> 
                  <span className="truncate">{project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400 shrink-0" /> 
                  <span className="truncate">{project.location}</span>
                </div>
              </div>
            </div>
            
            <div className="px-4 md:px-5 py-3 md:py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] md:text-xs font-medium text-slate-500">Progres</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-700">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailView({ project, onBack, activeTab, setActiveTab }) {
  if (!project) return null;

  const tabs = [
    { id: 'overview', label: 'Ikhtisar', icon: FileText },
    { id: 'tasks', label: 'Tugas & Linimasa', icon: ListTodo },
    { id: 'spatial', label: 'Program Ruang', icon: Grid },
    { id: 'concept', label: 'Konsep', icon: ImageIcon },
    { id: 'vault', label: 'Berkas', icon: HardDrive },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="mb-4 md:mb-6 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-xs md:text-sm text-slate-500 hover:text-slate-900 mb-3 md:mb-4 transition-colors">
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Kembali ke Direktori</span><span className="sm:hidden">Kembali</span>
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{project.name}</h2>
              <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md ${project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                {project.status}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">{project.type} • {project.location}</p>
          </div>
          <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 md:py-2 rounded-lg text-sm font-medium transition-colors">
            Pengaturan
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200 mb-4 md:mb-6 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors shrink-0
              ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <tab.icon size={16} className="md:w-[18px] md:h-[18px]" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6 relative">
        {activeTab === 'overview' && <TabOverview project={project} />}
        {activeTab === 'tasks' && <TabTasks />}
        {activeTab === 'spatial' && <TabSpatial />}
        {activeTab === 'concept' && <TabConcept />}
        {activeTab === 'vault' && <TabVault />}
      </div>
    </div>
  );
}

function TabOverview({ project }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">Deskripsi Proyek</h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-4xl">{project.description} Proyek ini menargetkan efisiensi ruang maksimal dengan estetika yang sesuai dengan preferensi klien.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2"><User size={18}/> Informasi Klien</h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Nama Klien / Perusahaan</p>
              <p className="text-sm md:text-base text-slate-800 font-medium">{project.client}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Kontak Utama</p>
              <p className="text-sm md:text-base text-slate-800 font-medium">0812-3456-7890</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Email</p>
              <p className="text-sm md:text-base text-slate-800 font-medium truncate">client@example.com</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2"><MapPin size={18}/> Detail Lokasi & Waktu</h4>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Alamat Tapak</p>
              <p className="text-sm md:text-base text-slate-800 font-medium">{project.location}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Luas Tanah (Estimasi)</p>
              <p className="text-sm md:text-base text-slate-800 font-medium">450 m²</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Tenggat Waktu Utama</p>
              <p className="text-sm md:text-base text-slate-800 font-medium">{project.deadline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabTasks() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900">Manajemen Tugas</h3>
        <button className="text-xs md:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 md:py-1.5 rounded-lg transition-colors flex items-center gap-1 w-full sm:w-auto justify-center">
          <Plus size={16} /> Tambah Tugas
        </button>
      </div>

      <div className="space-y-4">
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-3 md:px-4 py-2.5 md:py-3 border-b border-slate-200 flex justify-between items-center gap-2">
            <h4 className="font-semibold text-slate-800 text-xs md:text-sm leading-tight">Tahap Konseptual (Schematic)</h4>
            <span className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold shrink-0">100%</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-3 md:p-4 flex items-start gap-2 md:gap-3 bg-white opacity-60">
              <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium line-through text-slate-500">Studi Massa Bangunan</p>
              </div>
            </div>
            <div className="p-3 md:p-4 flex items-start gap-2 md:gap-3 bg-white opacity-60">
              <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium line-through text-slate-500">Zoning & Sirkulasi Makro</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-3 md:px-4 py-2.5 md:py-3 border-b border-slate-200 flex justify-between items-center gap-2">
            <h4 className="font-semibold text-slate-800 text-xs md:text-sm leading-tight">Pengembangan Desain (DED)</h4>
            <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold shrink-0">In Progress</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-start gap-3 bg-white">
              <div className="flex items-start gap-2 md:gap-3 flex-1">
                <div className="w-4 h-4 rounded border-2 border-slate-300 mt-0.5 shrink-0 cursor-pointer hover:border-blue-500"></div>
                <div>
                  <p className="text-sm md:text-sm font-medium text-slate-800">Detail Denah Arsitektur</p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1">Sub: Denah LT1, Denah LT2, Atap</p>
                </div>
              </div>
              <div className="ml-6 sm:ml-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 mt-1 sm:mt-0">
                <p className="text-[10px] md:text-xs text-slate-400">Drafter: Andi</p>
                <span className="text-[10px] md:text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Due: 15 Mar</span>
              </div>
            </div>
            <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-start gap-3 bg-white">
              <div className="flex items-start gap-2 md:gap-3 flex-1">
                <div className="w-4 h-4 rounded border-2 border-slate-300 mt-0.5 shrink-0 cursor-pointer hover:border-blue-500"></div>
                <div>
                  <p className="text-sm md:text-sm font-medium text-slate-800">Pembuatan Model 3D Dasar</p>
                </div>
              </div>
              <div className="ml-6 sm:ml-0 flex items-center justify-end mt-1 sm:mt-0">
                <span className="text-[10px] md:text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">Due: 20 Mar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabSpatial() {
  const [zones, setZones] = useState([
    {
      id: 1,
      title: 'Zona Publik',
      circulationPercent: 20,
      rooms: [
        { id: 1, room: 'Ruang Keluarga', capacity: '6-8', area: '45', needs: 'Pencahayaan alami', relations: 'Dapur, Ruang Makan' },
        { id: 2, room: 'Dapur Bersih', capacity: '3', area: '15', needs: 'Sirkulasi udara baik', relations: 'Ruang Makan' },
      ]
    },
    {
      id: 2,
      title: 'Zona Privat',
      circulationPercent: 15,
      rooms: [
        { id: 3, room: 'Kamar Tidur Utama', capacity: '2', area: '30', needs: 'Kedap suara', relations: 'Kamar Mandi Utama' },
      ]
    }
  ]);

  const addZone = () => {
    setZones([...zones, {
      id: Date.now(),
      title: 'Zona Baru',
      circulationPercent: 20,
      rooms: []
    }]);
  };

  const addRoom = (zoneId) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return {
          ...z,
          rooms: [...z.rooms, { id: Date.now(), room: '', capacity: '', area: '0', needs: '', relations: '' }]
        };
      }
      return z;
    }));
  };

  const updateZoneField = (zoneId, field, value) => {
    setZones(zones.map(z => z.id === zoneId ? { ...z, [field]: value } : z));
  };

  const updateRoomField = (zoneId, roomId, field, value) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return {
          ...z,
          rooms: z.rooms.map(r => r.id === roomId ? { ...r, [field]: value } : r)
        };
      }
      return z;
    }));
  };

  const removeRoom = (zoneId, roomId) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, rooms: z.rooms.filter(r => r.id !== roomId) };
      }
      return z;
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-900">Program Ruang</h3>
          <p className="text-xs md:text-sm text-slate-500">Estimasi luasan dan kebutuhan fungsi ruangan per zona.</p>
        </div>
        <button 
          onClick={addZone}
          className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Tambah Zona Baru
        </button>
      </div>

      <div className="space-y-8">
        {zones.map(zone => {
          const subTotal = zone.rooms.reduce((sum, room) => sum + (parseFloat(room.area) || 0), 0);
          const sirkulasiArea = subTotal * (parseFloat(zone.circulationPercent) || 0) / 100;
          const totalArea = subTotal + sirkulasiArea;

          return (
            <div key={zone.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex-1 flex items-center">
                  <input 
                    type="text" 
                    value={zone.title}
                    onChange={(e) => updateZoneField(zone.id, 'title', e.target.value)}
                    className="font-bold text-slate-800 text-sm md:text-base bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-100 rounded px-1 w-full max-w-xs"
                    placeholder="Nama Zona..."
                  />
                </div>
                <button 
                  onClick={() => addRoom(zone.id)}
                  className="text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 w-fit"
                >
                  <Plus size={14} /> Baris Baru
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-slate-600 min-w-[700px]">
                  <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 w-[20%]">Nama Ruang</th>
                      <th className="px-4 py-2.5 w-[12%]">Kapasitas</th>
                      <th className="px-4 py-2.5 w-[12%]">Luasan (m²)</th>
                      <th className="px-4 py-2.5 w-[25%]">Kebutuhan Khusus</th>
                      <th className="px-4 py-2.5 w-[25%]">Hubungan Ruang</th>
                      <th className="px-4 py-2.5 w-[6%] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {zone.rooms.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-2">
                          <input type="text" value={item.room} onChange={(e) => updateRoomField(zone.id, item.id, 'room', e.target.value)} className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="Nama..." />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <input type="text" value={item.capacity} onChange={(e) => updateRoomField(zone.id, item.id, 'capacity', e.target.value)} className="w-12 bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="0" />
                            <span className="text-xs text-slate-400">org</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={item.area} onChange={(e) => updateRoomField(zone.id, item.id, 'area', e.target.value)} className="w-16 bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="0" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={item.needs} onChange={(e) => updateRoomField(zone.id, item.id, 'needs', e.target.value)} className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="-" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={item.relations} onChange={(e) => updateRoomField(zone.id, item.id, 'relations', e.target.value)} className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="-" />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => removeRoom(zone.id, item.id)} className="text-slate-400 hover:text-red-500 p-1">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    <tr className="bg-slate-50/50">
                      <td colSpan="2" className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal Luasan Ruang:</td>
                      <td className="px-4 py-2 font-medium text-slate-700">{subTotal.toFixed(2)} m²</td>
                      <td colSpan="3"></td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td colSpan="2" className="px-4 py-2 text-right text-xs font-medium text-slate-500 flex items-center justify-end gap-2">
                        <span>Sirkulasi:</span>
                        <div className="flex items-center bg-white border border-slate-200 rounded px-2 py-0.5 w-16">
                          <input 
                            type="number" 
                            value={zone.circulationPercent} 
                            onChange={(e) => updateZoneField(zone.id, 'circulationPercent', e.target.value)}
                            className="w-full text-xs text-slate-700 outline-none text-right pr-1" 
                          />
                          <span className="text-[10px] text-slate-400">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium text-slate-500">+{sirkulasiArea.toFixed(2)} m²</td>
                      <td colSpan="3"></td>
                    </tr>
                    <tr className="bg-slate-50/80 border-t border-slate-200">
                      <td colSpan="2" className="px-4 py-3 text-right font-bold text-slate-800">Total Luasan {zone.title}:</td>
                      <td className="px-4 py-3 font-bold text-blue-600 text-base">{totalArea.toFixed(2)} m²</td>
                      <td colSpan="3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabConcept() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900">Concept & Moodboard</h3>
        <button className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
          <Upload size={16} /> Unggah Referensi
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { color: 'bg-stone-200', note: 'Fasad bata ekspos' },
          { color: 'bg-zinc-200', note: 'Interior kayu minimalis' },
          { color: 'bg-neutral-200', note: 'Void area tangga' },
          { color: 'bg-slate-200', note: 'Palet warna master' },
          { color: 'bg-gray-200', note: 'Referensi lighting' }
        ].map((img, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-square">
            <div className={`w-full h-full ${img.color} flex items-center justify-center`}>
              <ImageIcon size={32} className="text-slate-400 opacity-50" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end">
              <p className="text-white text-[10px] md:text-xs font-medium line-clamp-2">{img.note}</p>
            </div>
          </div>
        ))}
        
        <div className="rounded-xl border-2 border-dashed border-slate-300 aspect-square flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-colors">
          <Plus size={24} className="mb-1 md:mb-2" />
          <span className="text-[10px] md:text-xs font-medium text-center px-2">Tambah</span>
        </div>
      </div>
    </div>
  );
}

function TabVault() {
  const folders = [
    { name: '1. Gambar Kerja', count: '12 File', size: '45 MB' },
    { name: '2. Model 3D (RVT)', count: '3 File', size: '210 MB' },
    { name: '3. Visualisasi', count: '8 File', size: '120 MB' },
    { name: '4. Administrasi', count: '5 File', size: '15 MB' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-900">File Vault</h3>
          <p className="text-xs md:text-sm text-slate-500">Penyimpanan terpusat dokumen proyek.</p>
        </div>
        <button className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
          <Upload size={16} /> Unggah File Baru
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {folders.map((folder, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <Folder size={24} className="text-blue-500 mb-2 md:mb-3 group-hover:scale-110 transition-transform md:w-8 md:h-8" />
              <h4 className="font-semibold text-slate-800 text-xs md:text-sm mb-1 line-clamp-2">{folder.name}</h4>
            </div>
            <div className="flex flex-col xl:flex-row xl:justify-between text-[10px] md:text-xs text-slate-500 mt-2 gap-1">
              <span>{folder.count}</span>
              <span className="hidden sm:inline">{folder.size}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-5 md:pt-6">
        <h4 className="font-semibold text-slate-800 text-sm md:text-base mb-3 md:mb-4">File Terbaru</h4>
        <div className="space-y-2">
          {[
            { name: 'Denah_Lt1_Rev2.dwg', date: 'Hari ini, 10:30', uploader: 'Andi' },
            { name: 'Konsep_Interior.pdf', date: 'Kemarin, 15:45', uploader: 'Siska' },
            { name: 'RAB_Preliminary.xlsx', date: '10 Mar 2026', uploader: 'Budi' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 md:p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-slate-200 p-2 rounded text-slate-500 shrink-0">
                  <File size={16} className="md:w-5 md:h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs md:text-sm font-medium text-slate-800 truncate">{file.name}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 truncate">Oleh {file.uploader} • {file.date}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-blue-600 p-2 shrink-0">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
