import React, { useState } from 'react';
import { FolderOpen, RefreshCw, Check, X, Server, Folder, Home, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useEditorStore } from '../store';

interface WorkspaceSelectorProps {
  onToggleTerminal?: () => void;
  terminalOpen?: boolean;
  onToggleAi?: () => void;
  aiOpen?: boolean;
  onToggleExplorer?: () => void;
  explorerOpen?: boolean;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  onToggleTerminal,
  terminalOpen,
  onToggleAi,
  aiOpen,
  onToggleExplorer,
  explorerOpen,
}) => {
  const { workspaceRoot, setWorkspaceRoot, connected, setConnected, setFileTree, setActiveFile } = useEditorStore();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(workspaceRoot);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (targetRoot?: string) => {
    const rootToUse = (targetRoot || inputValue).trim();
    if (!rootToUse) {
      setError('Iltimos, ishchi papka yo\'lini kiriting');
      return;
    }
    
    setConnecting(true);
    setError('');
    
    try {
      const encodedRoot = encodeURIComponent(rootToUse);
      const res = await fetch(`/api/fs/tree?root=${encodedRoot}`);
      
      if (!res.ok) throw new Error('Papkani o\'qib bo\'lmadi');
      
      const tree = await res.json();
      setWorkspaceRoot(rootToUse);
      setFileTree(tree);
      setActiveFile(null, '', 'plaintext');
      setConnected(true);
      setShowModal(false);
    } catch (err: any) {
      setError('Papka yo\'li topilmadi yoki ruxsat yo\'q. Qayta tekshirib ko\'ring.');
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  const handleRefresh = async () => {
    if (!workspaceRoot) return;
    setConnecting(true);
    try {
      const encodedRoot = encodeURIComponent(workspaceRoot);
      const res = await fetch(`/api/fs/tree?root=${encodedRoot}`);
      if (res.ok) {
        const tree = await res.json();
        setFileTree(tree);
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  const folderName = workspaceRoot ? workspaceRoot.split('/').filter(Boolean).pop() || workspaceRoot : 'Loyiha tanlanmagan';

  return (
    <>
      {/* Top Glass Navigation & Workspace Bar */}
      <header className="h-12 flex items-center justify-between px-3 sm:px-4 glass-nav select-none relative z-30">
        
        {/* Left: Brand & Home / Docs links */}
        <div className="flex items-center gap-3">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity" 
            title="Bosh sahifaga qaytish"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-accent-blue via-accent-cyan to-accent-green p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[5px] flex items-center justify-center">
                <Sparkles size={12} className="text-accent-cyan" />
              </div>
            </div>
            <span className="font-bold text-xs tracking-tight hidden sm:inline">AI IDE</span>
          </NavLink>

          <div className="w-px h-4 bg-white/10 hidden sm:block" />

          {/* Quick Breadcrumbs / Current Folder */}
          <div 
            onClick={() => { setShowModal(true); setInputValue(workspaceRoot); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-panel-subtle hover:border-accent-blue/40 cursor-pointer transition-all max-w-[180px] sm:max-w-[280px]"
            title={`Joriy papka: ${workspaceRoot || 'Tanlanmagan'} (O'zgartirish uchun bosing)`}
          >
            <Folder size={13} className={connected ? 'text-accent-blue flex-shrink-0' : 'text-text-muted flex-shrink-0'} />
            <span className="text-xs text-text-primary font-mono truncate font-medium">
              {folderName}
            </span>
          </div>
        </div>

        {/* Center: Desktop Panel Toggles */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5">
          {onToggleExplorer && (
            <button
              onClick={onToggleExplorer}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                explorerOpen ? 'bg-white/15 text-white shadow-sm' : 'text-text-muted hover:text-white'
              }`}
            >
              Fayllar
            </button>
          )}
          {onToggleTerminal && (
            <button
              onClick={onToggleTerminal}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                terminalOpen ? 'bg-white/15 text-white shadow-sm' : 'text-text-muted hover:text-white'
              }`}
            >
              <Terminal size={11} /> Terminal
            </button>
          )}
          {onToggleAi && (
            <button
              onClick={onToggleAi}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                aiOpen ? 'bg-white/15 text-white shadow-sm' : 'text-text-muted hover:text-white'
              }`}
            >
              <Sparkles size={11} className="text-accent-cyan" /> AI Panel
            </button>
          )}
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-2">
          
          {/* Refresh File Tree */}
          <button
            onClick={handleRefresh}
            disabled={!connected || connecting}
            className="p-1.5 rounded-lg glass-button text-text-secondary hover:text-white transition-colors disabled:opacity-40"
            title="Fayllar daraxtini yangilash"
          >
            <RefreshCw size={13} className={connecting ? 'animate-spin' : ''} />
          </button>

          {/* Open Folder Button */}
          <button
            onClick={() => { setShowModal(true); setInputValue(workspaceRoot); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium glass-button text-white hover:border-accent-blue/40"
            title="Boshqa papkani ochish"
          >
            <FolderOpen size={13} className="text-accent-blue" />
            <span className="hidden sm:inline">Papka ochish</span>
          </button>

          {/* Terminal Dedicated Page Link */}
          <NavLink
            to="/terminal"
            className="p-1.5 rounded-lg glass-button text-text-secondary hover:text-accent-cyan transition-colors"
            title="Alohida to'liq ekranli terminal"
          >
            <Terminal size={13} />
          </NavLink>

          {/* Docs Link */}
          <NavLink
            to="/docs"
            className="p-1.5 rounded-lg glass-button text-text-secondary hover:text-white transition-colors"
            title="Qo'llanma va Hujjatlar"
          >
            <BookOpen size={13} />
          </NavLink>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 pl-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} />
          </div>

        </div>
      </header>

      {/* Workspace Selector Glass Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="glass-modal rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue">
                  <FolderOpen size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Ishchi Papkani Tanlash</h2>
                  <p className="text-[11px] text-text-secondary">Loyihangiz joylashgan manzilni kiriting</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 rounded-lg glass-button text-text-secondary hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block font-medium">Papka yo'li:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                    placeholder="/workspace yoki /app/applet"
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-text-muted outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleConnect()}
                    disabled={connecting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-button-primary text-white disabled:opacity-50"
                  >
                    {connecting ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Ulanish</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Quick suggestions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] text-text-muted block">Tezkor yo'llar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['/app/applet', '/', '/client', '/server'].map((path) => (
                    <button
                      key={path}
                      onClick={() => {
                        setInputValue(path);
                        handleConnect(path);
                      }}
                      className="px-2.5 py-1 rounded-lg glass-button text-[11px] font-mono text-accent-cyan hover:border-accent-cyan/40"
                    >
                      {path}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceSelector;
