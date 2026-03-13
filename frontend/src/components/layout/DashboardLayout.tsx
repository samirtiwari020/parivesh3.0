import { motion } from 'framer-motion';
import { LayoutDashboard, FilePlus, FolderKanban, FileCheck, Bell, Settings, LogOut, Landmark, Menu, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
  { icon: FilePlus, label: 'Submit Proposal', path: '/app/submit' },
  { icon: FolderKanban, label: 'My Applications', path: '/app/applications' },
  { icon: FileCheck, label: 'Compliance Reports', path: '/app/compliance' },
  { icon: Bell, label: 'Notifications', path: '/app/notifications' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentLabel = sidebarLinks.find(l => l.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-emerald-50/30 flex overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-white to-primary/5 -z-10" />
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Premium Dark Green Glass */}
      <aside className={`w-72 bg-emerald-950/95 backdrop-blur-2xl border-r border-emerald-800/50 flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-8 border-b border-emerald-800/50 bg-emerald-950/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all shadow-inner">
              <Landmark className="text-accent" size={24} />
            </div>
            <h2 className="font-serif font-bold text-xl text-white tracking-wide">PARIVESH</h2>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-emerald-100 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group relative overflow-hidden ${
                  isActive ? 'text-emerald-950 shadow-md' : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-accent rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Optional subtle glow for active */}
                {isActive && <div className="absolute inset-0 bg-white/20 blur-md pointer-events-none rounded-xl" />}
                
                <link.icon size={20} className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-950' : 'text-emerald-400 group-hover:text-accent'}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-emerald-800/50 bg-emerald-950/30">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-emerald-100/70 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all group">
            <LogOut size={20} className="group-hover:text-red-400" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        {/* Header - Glassmorphism */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/50 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-white border border-emerald-100 text-emerald-900 shadow-sm hover:bg-emerald-50 transition-colors">
              <Menu size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-emerald-950">{currentLabel}</h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2.5 rounded-xl bg-white border border-emerald-100 text-emerald-600 shadow-sm hover:bg-emerald-50 transition-all group">
              <Bell size={20} className="group-hover:text-primary" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-white animate-pulse" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-emerald-950">Project Proponent</p>
                <p className="text-xs text-emerald-600 font-medium">pp@example.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-md border border-emerald-200 group-hover:shadow-lg transition-all transform group-hover:-translate-y-0.5">
                PP
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
