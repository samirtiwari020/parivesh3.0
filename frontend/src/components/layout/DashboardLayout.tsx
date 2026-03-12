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
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-surface border-r border-border flex flex-col fixed h-full z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 md:h-20 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <Landmark className="text-primary" size={22} />
            <h2 className="font-serif font-bold text-lg text-primary">PARIVESH</h2>
          </Link>
        </div>

        <nav className="flex-1 py-4 md:py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon size={18} className="relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 md:h-20 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu size={20} />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-foreground">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              PP
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
