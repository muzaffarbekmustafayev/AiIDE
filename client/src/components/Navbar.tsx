import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Terminal, Code2, BookOpen, Home, Menu, X, Sparkles, Folder } from 'lucide-react';
import { useEditorStore } from '../store';

interface NavbarProps {
  minimal?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ minimal = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { connected, workspaceRoot } = useEditorStore();

  const navItems = [
    { to: '/', label: 'Bosh sahifa', icon: Home },
    { to: '/ide', label: 'Web IDE', icon: Code2 },
    { to: '/terminal', label: 'Terminal', icon: Terminal },
    { to: '/docs', label: 'Hujjatlar', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-blue/80 via-accent-cyan/80 to-accent-green/80 p-[1px] shadow-lg shadow-accent-blue/20">
            <div className="w-full h-full bg-slate-950/90 rounded-[7px] flex items-center justify-center group-hover:bg-slate-900/60 transition-colors">
              <Sparkles size={16} className="text-accent-cyan animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              AI IDE
              <span className="text-[10px] font-normal uppercase tracking-wider text-accent-blue border border-accent-blue/30 px-1 py-0.2 rounded-sm bg-accent-blue/10">
                PRO
              </span>
            </span>
          </div>
        </NavLink>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                    : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-accent-blue' : 'text-text-muted'} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right side stats / status */}
        <div className="flex items-center gap-3">
          {/* Active workspace hint (desktop) */}
          {workspaceRoot && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono glass-panel-subtle text-text-secondary max-w-[200px] truncate" title={workspaceRoot}>
              <Folder size={12} className="text-accent-blue flex-shrink-0" />
              <span className="truncate">{workspaceRoot.split('/').pop() || workspaceRoot}</span>
            </div>
          )}

          {/* Server Connection indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium glass-panel-subtle border border-white/5">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} />
            <span className="text-text-secondary hidden sm:inline">{connected ? 'Server Faol' : 'Lokal rejim'}</span>
          </div>

          {/* Quick launch IDE button if not already in IDE */}
          {location.pathname !== '/ide' && (
            <NavLink
              to="/ide"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass-button-primary text-white shadow-sm"
            >
              <Code2 size={13} />
              <span>IDE Ochish</span>
            </NavLink>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-button text-text-secondary hover:text-white focus:outline-none"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-modal border-t border-b border-white/10 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-blue/15 text-white border border-accent-blue/30'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-accent-blue' : 'text-text-muted'} />
                {item.label}
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <NavLink
              to="/ide"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold glass-button-primary text-white"
            >
              <Code2 size={15} /> Web IDE-ga o'tish
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
