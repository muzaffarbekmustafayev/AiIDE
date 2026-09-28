import React, { useEffect, useState, useCallback, useRef } from 'react';
import TerminalUI from '../components/TerminalUI';
import CodeEditor from '../components/CodeEditor';
import AiPanel from '../components/AiPanel';
import FileTree from '../components/FileTree';
import WorkspaceSelector from '../components/WorkspaceSelector';
import { useEditorStore } from '../store';
import {
  FolderTree, Code2, Terminal, Sparkles,
  Maximize2, Minimize2, X
} from 'lucide-react';

type MobileTab = 'explorer' | 'editor' | 'terminal' | 'ai';

// Sidebar resize handle
const ResizeHandle = ({ onResize }: { onResize: (dx: number) => void }) => {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      onResize(e.clientX - lastX.current);
      lastX.current = e.clientX;
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onResize]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 flex-shrink-0 cursor-col-resize bg-transparent hover:bg-blue-400/30 transition-colors duration-150 active:bg-blue-400/50 z-20"
    />
  );
};

function IdePage() {
  const { workspaceRoot, setWorkspaceRoot, setFileTree, setActiveFile, setConnected, activeTabPath } = useEditorStore();

  const [explorerOpen, setExplorerOpen] = useState(true);
  const [explorerWidth, setExplorerWidth] = useState(256); // px
  const [aiOpen, setAiOpen] = useState(true);
  const [aiWidth, setAiWidth] = useState(320); // px
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('editor');

  // Auto-switch to editor on mobile when file opens
  useEffect(() => {
    if (activeTabPath && window.innerWidth < 1024) setActiveMobileTab('editor');
  }, [activeTabPath]);

  // Initial connection
  useEffect(() => {
    const tryConnect = async () => {
      let root = workspaceRoot;
      if (!root) {
        try {
          const r = await fetch('/api/fs/workspace');
          if (r.ok) { const d = await r.json(); if (d.root) { root = d.root; setWorkspaceRoot(root); } }
        } catch { setConnected(false); return; }
      }
      if (!root) { setConnected(false); return; }
      try {
        const r = await fetch(`/api/fs/tree?root=${encodeURIComponent(root)}`);
        if (r.ok) { setFileTree(await r.json()); setConnected(true); }
        else setConnected(false);
      } catch { setConnected(false); }
    };
    tryConnect();
  }, [workspaceRoot, setFileTree, setActiveFile, setConnected, setWorkspaceRoot]);

  const handleExplorerResize = useCallback((dx: number) => {
    setExplorerWidth(w => Math.max(160, Math.min(480, w + dx)));
  }, []);

  const handleAiResize = useCallback((dx: number) => {
    setAiWidth(w => Math.max(200, Math.min(560, w - dx)));
  }, []);

  const terminalH = terminalExpanded ? '50vh' : '32vh';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090b10] text-white font-sans overflow-hidden relative">

      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <WorkspaceSelector
        onToggleExplorer={() => setExplorerOpen(v => !v)}
        explorerOpen={explorerOpen}
        onToggleTerminal={() => setTerminalOpen(v => !v)}
        terminalOpen={terminalOpen}
        onToggleAi={() => setAiOpen(v => !v)}
        aiOpen={aiOpen}
      />

      {/* Mobile tabs */}
      <div className="lg:hidden flex items-center justify-around px-2 py-1.5 bg-[#0a0c14]/90 border-b border-white/8 select-none flex-shrink-0">
        {([
          ['explorer', 'Fayllar',     <FolderTree size={13} />, 'blue'],
          ['editor',   'Tahrirlovchi',<Code2      size={13} />, 'blue'],
          ['terminal', 'Terminal',    <Terminal   size={13} />, 'cyan'],
          ['ai',       'AI Chat',     <Sparkles   size={13} />, 'emerald'],
        ] as const).map(([tab, label, icon, color]) => (
          <button
            key={tab}
            onClick={() => setActiveMobileTab(tab as MobileTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMobileTab === tab
                ? `bg-${color}-500/15 text-white border border-${color}-400/25`
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {icon}<span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-row overflow-hidden">

        {/* ── Explorer Sidebar ── */}
        {/* Mobile: show/hide by tab */}
        <div
          className={`
            flex-col h-full border-r border-white/5 bg-[#0d101b]/80 backdrop-blur-md overflow-hidden
            ${activeMobileTab === 'explorer' ? 'flex' : 'hidden'}
            lg:flex
          `}
          style={{
            width: explorerOpen ? explorerWidth : 0,
            minWidth: explorerOpen ? Math.min(explorerWidth, 160) : 0,
            opacity: explorerOpen ? 1 : 0,
            transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease, min-width 220ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: explorerOpen ? 'auto' : 'none',
          }}
        >
          <div style={{ width: explorerWidth, minWidth: 160 }} className="h-full">
            <FileTree />
          </div>
        </div>

        {/* Explorer resize handle */}
        {explorerOpen && (
          <div className="hidden lg:block">
            <ResizeHandle onResize={handleExplorerResize} />
          </div>
        )}

        {/* ── Center: Editor + Terminal ── */}
        <div className={`
          ${(activeMobileTab === 'editor' || activeMobileTab === 'terminal') ? 'flex' : 'hidden'}
          lg:flex flex-1 flex-col overflow-hidden bg-[#090b10] min-w-0
        `}>

          {/* Editor */}
          <div className={`
            ${activeMobileTab === 'terminal' ? 'hidden lg:flex' : 'flex'}
            flex-1 overflow-hidden
          `}>
            <CodeEditor />
          </div>

          {/* Terminal panel */}
          <div
            className={`
              ${activeMobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}
              flex-col border-t border-white/8 bg-[#080a10] overflow-hidden
            `}
            style={{
              height: terminalOpen ? terminalH : 0,
              opacity: terminalOpen ? 1 : 0,
              transition: 'height 220ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease',
              minHeight: 0,
            }}
          >
            {/* Terminal titlebar */}
            <div className="flex-shrink-0 h-8 px-3 bg-black/30 border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                <Terminal size={12} />
                <span>Terminal</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setTerminalExpanded(v => !v)}
                  className="p-1 rounded glass-button text-slate-500 hover:text-white"
                  title={terminalExpanded ? 'Kichiklashtirish' : 'Kattalashtirish'}
                >
                  {terminalExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                </button>
                <button
                  onClick={() => setTerminalOpen(false)}
                  className="p-1 rounded glass-button text-slate-500 hover:text-white"
                  title="Yopish"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-2 overflow-hidden">
              <TerminalUI />
            </div>
          </div>
        </div>

        {/* AI resize handle */}
        {aiOpen && (
          <div className="hidden lg:block">
            <ResizeHandle onResize={handleAiResize} />
          </div>
        )}

        {/* ── AI Panel ── */}
        <div
          className={`
            flex-col h-full border-l border-white/5 bg-[#0d101b]/80 backdrop-blur-md overflow-hidden
            ${activeMobileTab === 'ai' ? 'flex' : 'hidden'}
            lg:flex
          `}
          style={{
            width: aiOpen ? aiWidth : 0,
            minWidth: aiOpen ? Math.min(aiWidth, 200) : 0,
            opacity: aiOpen ? 1 : 0,
            transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease, min-width 220ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: aiOpen ? 'auto' : 'none',
          }}
        >
          <div style={{ width: aiWidth, minWidth: 200 }} className="h-full">
            <AiPanel />
          </div>
        </div>

      </div>

      {/* Status bar */}
      <footer className="flex-shrink-0 h-6 px-3 bg-[#060810]/90 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline text-emerald-400/80">AI IDE Ready</span>
          </span>
          {activeTabPath && (
            <span className="text-slate-400 font-mono truncate max-w-[200px] sm:max-w-md">
              {activeTabPath}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTerminalOpen(v => !v)}
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
