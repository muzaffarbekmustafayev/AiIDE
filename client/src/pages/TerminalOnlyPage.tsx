import React, { useState } from 'react';
import TerminalUI from '../components/TerminalUI';
import { ArrowLeft, Code2, Terminal, RefreshCw, Sparkles, Home, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../store';

const TerminalOnlyPage: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceRoot, connected } = useEditorStore();
  const [terminalKey, setTerminalKey] = useState(0);

  const restartTerminal = () => {
    setTerminalKey(prev => prev + 1);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090b10] text-text-primary relative overflow-hidden select-none">
      
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Glass Navigation Bar */}
      <header className="h-12 glass-nav flex items-center justify-between px-3 sm:px-6 relative z-20">
        
        {/* Left: Navigation links */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-white glass-button px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Bosh sahifaga qaytish"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Bosh sahifa</span>
          </button>

          <button 
            onClick={() => navigate('/ide')}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-blue glass-button px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Web IDE muharririga o'tish"
          >
            <Code2 size={14} className="text-accent-blue" />
            <span className="hidden sm:inline">Web IDE</span>
          </button>
        </div>

        {/* Center: Title & Workspace status */}
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Terminal size={14} className="text-accent-cyan" />
          <span>Masofaviy Terminal (PTY)</span>
          {workspaceRoot && (
            <span className="hidden md:inline text-[11px] font-mono text-text-muted px-2 py-0.5 rounded glass-panel-subtle truncate max-w-xs">
              {workspaceRoot}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={restartTerminal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium glass-button text-text-secondary hover:text-white transition-colors"
            title="Terminal sessiyasini qayta ishga tushirish"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Qayta yuklash</span>
          </button>

          <button
            onClick={() => navigate('/docs')}
            className="p-1.5 rounded-lg glass-button text-text-secondary hover:text-white transition-colors"
            title="Hujjatlar"
          >
            <BookOpen size={13} />
          </button>

          <div className="flex items-center gap-1.5 pl-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} />
          </div>
        </div>
      </header>

      {/* Terminal View Container */}
      <main className="flex-1 p-3 sm:p-4 overflow-hidden relative z-10 flex flex-col">
        <div className="flex-1 rounded-2xl glass-panel p-2 overflow-hidden shadow-2xl">
          <TerminalUI key={terminalKey} />
        </div>
      </main>

      {/* Status Bar */}
      <footer className="h-7 px-4 glass-nav border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          <span>Interactive Duplex WebSocket Shell</span>
        </div>
        <div>
          <span>xterm.js · UTF-8</span>
        </div>
      </footer>

    </div>
  );
};

export default TerminalOnlyPage;
