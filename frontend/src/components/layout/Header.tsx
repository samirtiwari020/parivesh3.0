import { motion } from 'framer-motion';
import { Landmark, Bell, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { tickerMessages } from '@/data/mockData';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Clearances', path: '/clearances' },
  { label: 'Manuals', path: '/manuals' },
  { label: 'Helpdesk', path: '/helpdesk' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-soft">
      {/* Ticker */}
      <div className="gov-ticker">
        <div className="px-4 shrink-0 flex items-center gap-2 border-r border-primary-foreground/20 mr-4">
          <Bell size={14} />
          <span className="hidden sm:inline">UPDATES</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-4">
          <div className="absolute whitespace-nowrap animate-ticker">
            {tickerMessages.join('  •  ')}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="gov-container px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Landmark className="text-primary" size={22} />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-base md:text-lg leading-tight text-primary">PARIVESH</h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Ministry of Environment, Forest & Climate Change
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary font-semibold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/login" className="hidden sm:flex text-sm font-medium px-3 md:px-4 py-2 hover:bg-muted rounded-lg transition-colors items-center gap-2">
            <LogIn size={16} />
            Login
          </Link>
          <Link to="/register" className="hidden sm:flex text-sm font-medium px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-soft items-center gap-2">
            <UserPlus size={16} />
            Register
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-surface"
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium px-4 py-2.5 hover:bg-muted rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-medium px-4 py-2.5 bg-primary text-primary-foreground rounded-lg">
                Register
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
