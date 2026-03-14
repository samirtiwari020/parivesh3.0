import { motion } from 'framer-motion';
import { LayoutDashboard, FilePlus, FolderKanban, FileCheck, Bell, Settings, LogOut, Landmark, Menu } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/applicant' },
  { icon: FilePlus, label: 'Submit Application', path: '/applicant/submit' },
  { icon: FolderKanban, label: 'My Applications', path: '/applicant/applications' },
  { icon: FileCheck, label: 'Documents', path: '/applicant/documents' },
  { icon: Bell, label: 'Notifications', path: '/applicant/notifications' },
  { icon: Settings, label: 'Settings', path: '/applicant/settings' },
];

export default function ApplicantLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentLabel = sidebarLinks.find(l => l.path === location.pathname)?.label || 'Dashboard';

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) return;
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`w-64 bg-surface border-r border-border flex flex-col fixed h-full z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 md:h-20 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <Landmark className="text-primary" size={22} />
            <div>
              <h2 className="font-serif font-bold text-lg text-primary">PARIVESH</h2>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Applicant</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 md:py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                {isActive && <motion.div layoutId="applicant-nav" className="absolute inset-0 bg-primary/10 rounded-lg" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <link.icon size={18} className="relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 md:h-20 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"><Menu size={20} /></button>
            <h1 className="text-base md:text-lg font-semibold text-foreground">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
