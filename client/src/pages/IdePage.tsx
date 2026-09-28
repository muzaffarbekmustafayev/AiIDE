import React, { useEffect, useState } from 'react';
import TerminalUI from '../components/TerminalUI';
import CodeEditor from '../components/CodeEditor';
import AiPanel from '../components/AiPanel';
import FileTree from '../components/FileTree';
import WorkspaceSelector from '../components/WorkspaceSelector';
import { useEditorStore } from '../store';
import { 
  FolderTree, Code2, Terminal, Sparkles, 
  ChevronUp, ChevronDown, Maximize2, Minimize2, X 
} from 'lucide-react';

type MobileTab = 'explorer' | 'editor' | 'terminal' | 'ai';

function IdePage() {
  const { workspaceRoot, setWorkspaceRoot, setFileTree, setActiveFile, setConnected, activeFilePath } = useEditorStore();

  // Desktop panel visibility toggles
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState<'normal' | 'expanded'>('normal');

  // Mobile active tab
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('editor');

  // Auto-switch to editor on mobile when a file is clicked
  useEffect(() => {
    if (activeFilePath && window.innerWidth < 1024) {
      setActiveMobileTab('editor');
    }
  }, [activeFilePath]);

  // Initial connection / auto-restore on mount
  useEffect(() => {
    const tryConnect = async () => {
      let root = workspaceRoot;
      if (!root) {
        try {
          const wsRes = await fetch('/api/fs/workspace');
          if (wsRes.ok) {
            const wsData = await wsRes.json();
            if (wsData.root) {
              root = wsData.root;
              setWorkspaceRoot(root);
            }
          }
        } catch {
          setConnected(false);
          return;
        }
      }
      if (!root) {
        setConnected(false);
        return;
      }
      try {
        const encodedRoot = encodeURIComponent(root);
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
      }
    };
    tryConnect();
  }, [workspaceRoot, setFileTree, setActiveFile, setConnected, setWorkspaceRoot]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090b10] text-text-primary font-sans overflow-hidden relative">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Glass Navigation Bar */}
      <WorkspaceSelector 
        onToggleExplorer={() => setExplorerOpen(!explorerOpen)}
        explorerOpen={explorerOpen}
        onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
        terminalOpen={terminalOpen}
        onToggleAi={() => setAiOpen(!aiOpen)}
        aiOpen={aiOpen}
      />

      {/* Mobile Glass Tabs Switcher (Visible on screens < 1024px) */}
      <div className="lg:hidden flex items-center justify-around px-2 py-1.5 glass-nav border-b border-white/10 select-none">
        <button
          onClick={() => setActiveMobileTab('explorer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeMobileTab === 'explorer'
              ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-sm'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <FolderTree size={13} className={activeMobileTab === 'explorer' ? 'text-accent-blue' : ''} />
          <span>Fayllar</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeMobileTab === 'editor'
              ? 'bg-accent-blue/20 text-white border border-accent-blue/30 shadow-sm'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <Code2 size={13} className={activeMobileTab === 'editor' ? 'text-accent-blue' : ''} />
          <span>Tahrirlovchi</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeMobileTab === 'terminal'
              ? 'bg-accent-cyan/20 text-white border border-accent-cyan/30 shadow-sm'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <Terminal size={13} className={activeMobileTab === 'terminal' ? 'text-accent-cyan' : ''} />
          <span>Terminal</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('ai')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeMobileTab === 'ai'
              ? 'bg-accent-green/20 text-white border border-accent-green/30 shadow-sm'
              : 'text-text-muted hover:text-white'
          }`}
        >
          <Sparkles size={13} className={activeMobileTab === 'ai' ? 'text-accent-green' : ''} />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Main Workspace Area (Desktop Split Layout) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">

        {/* 1. Explorer Sidebar */}
        <div className={`
          ${activeMobileTab === 'explorer' ? 'flex' : 'hidden'} 
          lg:flex flex-col 
          ${explorerOpen ? 'lg:w-64' : 'lg:hidden'} 
          w-full h-full border-r border-white/5 bg-[#0d101b]/80 backdrop-blur-md transition-all duration-200 z-10
        `}>
          <FileTree />
        </div>

        {/* 2. Center: Code Editor & Terminal */}
        <div className={`
          ${(activeMobileTab === 'editor' || activeMobileTab === 'terminal') ? 'flex' : 'hidden'} 
          lg:flex flex-1 flex-col overflow-hidden relative bg-[#090b10]
        `}>
          
          {/* Editor Container */}
          <div className={`
            ${activeMobileTab === 'terminal' ? 'hidden lg:flex' : 'flex'}
            flex-1 overflow-hidden relative
          `}>
            <CodeEditor />
          </div>

          {/* Desktop Collapsible Bottom Terminal */}
          {terminalOpen && (
            <div className={`
              ${activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}
              ${terminalHeight === 'expanded' ? 'h-[50vh]' : 'h-[32vh]'} 
              border-t border-white/10 glass-panel flex flex-col relative z-20 transition-all duration-200
            `}>
              {/* Terminal Title Bar */}
              <div className="h-8 px-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-xs font-medium text-accent-cyan">
                  <Terminal size={13} />
                  <span>Terminal (PTY)</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTerminalHeight(terminalHeight === 'normal' ? 'expanded' : 'normal')}
                    className="p-1 rounded-md glass-button text-text-muted hover:text-white"
                    title={terminalHeight === 'normal' ? "Kattalashtirish" : "Kichiklashtirish"}
                  >
                    {terminalHeight === 'normal' ? <Maximize2 size={11} /> : <Minimize2 size={11} />}
                  </button>
                  <button
                    onClick={() => setTerminalOpen(false)}
                    className="p-1 rounded-md glass-button text-text-muted hover:text-white"
                    title="Terminalni yopish"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>

              {/* Terminal Element */}
              <div className="flex-1 p-2 overflow-hidden">
                <TerminalUI />
              </div>
            </div>
          )}

        </div>

        {/* 3. AI Assistant & Agent Panel */}
        <div className={`
          ${activeMobileTab === 'ai' ? 'flex' : 'hidden'} 
          lg:flex flex-col 
          ${aiOpen ? 'lg:w-80' : 'lg:hidden'} 
          w-full h-full border-l border-white/5 bg-[#0d101b]/80 backdrop-blur-md transition-all duration-200 z-10
        `}>
          <AiPanel />
        </div>

      </div>

      {/* Bottom Status Bar */}
      <footer className="h-6 px-3 glass-nav border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">AI IDE Ready</span>
          </span>
          {activeFilePath && (
            <span className="text-white/80 font-mono truncate max-w-[200px] sm:max-w-md">
              {activeFilePath}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTerminalOpen(!terminalOpen)}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Terminal size={11} />
            <span className="hidden sm:inline">Terminal: {terminalOpen ? 'Ochiq' : 'Yopiq'}</span>
          </button>
          <span>UTF-8</span>
        </div>
      </footer>

    </div>
  );
}

export default IdePage;
