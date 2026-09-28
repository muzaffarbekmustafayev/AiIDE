import React, { useRef, useState, useEffect } from 'react';
import Editor, { type EditorProps } from '@monaco-editor/react';
import { useEditorStore } from '../store';
import axios from 'axios';
import {
  FileCode, Check, Copy, Code2, X, Circle,
  FileText, FileJson, FileType, FileCog, FileImage,
  Globe, Hash, Layers, Terminal, Braces, Folder
} from 'lucide-react';

const getFileIcon = (name: string, isDir: boolean, _open: boolean) => {
  if (isDir) return <Folder size={12} className="text-amber-400 flex-shrink-0" />;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const s = 12;
  if (['ts','tsx'].includes(ext))         return <FileCode size={s} className="text-blue-400 flex-shrink-0" />;
  if (['js','jsx','mjs'].includes(ext))   return <FileCode size={s} className="text-yellow-400 flex-shrink-0" />;
  if (['py'].includes(ext))               return <FileCode size={s} className="text-green-400 flex-shrink-0" />;
  if (['json','jsonc'].includes(ext))     return <FileJson size={s} className="text-amber-300 flex-shrink-0" />;
  if (['html','htm'].includes(ext))       return <Globe    size={s} className="text-orange-400 flex-shrink-0" />;
  if (['css','scss','sass'].includes(ext)) return <Hash   size={s} className="text-pink-400 flex-shrink-0" />;
  if (['md','mdx'].includes(ext))         return <FileText size={s} className="text-emerald-400 flex-shrink-0" />;
  if (['sh','bash','zsh'].includes(ext))  return <Terminal size={s} className="text-cyan-400 flex-shrink-0" />;
  if (['yaml','yml','toml'].includes(ext)) return <Layers size={s} className="text-rose-300 flex-shrink-0" />;
  if (['rs'].includes(ext))               return <Braces  size={s} className="text-orange-400 flex-shrink-0" />;
  if (['go'].includes(ext))               return <FileType size={s} className="text-cyan-300 flex-shrink-0" />;
  if (['png','jpg','jpeg','gif','svg','webp','ico'].includes(ext)) return <FileImage size={s} className="text-purple-400 flex-shrink-0" />;
  if (['env'].some(s2 => name.includes(s2)))  return <FileCog size={s} className="text-red-400 flex-shrink-0" />;
  return <FileText size={s} className="text-slate-400 flex-shrink-0" />;
};

// ── Tab Bar ───────────────────────────────────────────────────────────────
const TabBar: React.FC = () => {
  const { openTabs, activeTabPath, setActiveTab, closeTab } = useEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (!scrollRef.current || !activeTabPath) return;
    const el = scrollRef.current.querySelector(`[data-path="${activeTabPath}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [activeTabPath]);

  if (openTabs.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="flex items-end overflow-x-auto scrollbar-none border-b border-white/5 bg-[#090b10] flex-shrink-0"
      style={{ minHeight: 36 }}
    >
      {openTabs.map(tab => {
        const isActive = tab.path === activeTabPath;
        return (
          <div
            key={tab.path}
            data-path={tab.path}
            onClick={() => setActiveTab(tab.path)}
            onMouseDown={e => e.button === 1 && (e.preventDefault(), closeTab(tab.path))}
            title={tab.path}
            className={`group flex items-center gap-1.5 px-3 h-9 cursor-pointer flex-shrink-0 border-r border-white/5 transition-colors select-none ${
              isActive
                ? 'bg-[#0c0f18] text-white border-t-2 border-t-blue-400'
                : 'bg-[#090b10] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-t-2 border-t-transparent'
            }`}
          >
            <span className="flex-shrink-0">{getFileIcon(tab.name, false, false)}</span>
            <span className="text-xs font-mono truncate max-w-[120px]">{tab.name}</span>
            {/* dirty dot or close button */}
            <span className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center ml-0.5">
              {tab.isDirty ? (
                <Circle size={6} className="text-blue-400 fill-blue-400" />
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); closeTab(tab.path); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white text-slate-500"
                  title="Yopish"
                >
                  <X size={11} />
                </button>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── CodeEditor ───────────────────────────────────────────────────────────────
const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'saved' | 'saving'>>({});
  const [copied, setCopied] = useState(false);
  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const {
    workspaceRoot,
    openTabs,
    activeTabPath,
    updateTabContent,
    markTabSaved,
  } = useEditorStore();

  const activeTab = openTabs.find(t => t.path === activeTabPath) ?? null;

  const handleEditorDidMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('glass-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment',  foreground: '4a5568', fontStyle: 'italic' },
        { token: 'keyword',  foreground: '4facfe', fontStyle: 'bold'   },
        { token: 'string',   foreground: '64ffda' },
        { token: 'number',   foreground: 'e2c044' },
        { token: 'type',     foreground: 'f6c90e' },
        { token: 'function', foreground: '79c0ff' },
      ],
      colors: {
        'editor.background':                '#0c0f18',
        'editor.foreground':                '#e2e8f0',
        'editor.lineHighlightBackground':   '#141824',
        'editorLineNumber.foreground':      '#384259',
        'editorLineNumber.activeForeground':'#4facfe',
        'editorCursor.foreground':          '#00f2fe',
        'editor.selectionBackground':       '#2a3b5c',
        'editorWidget.background':          '#121624',
        'editorWidget.border':              '#262f48',
        'editorBracketMatch.background':    '#2a3b5c',
        'editorBracketMatch.border':        '#4facfe',
      }
    });
    monaco.editor.setTheme('glass-dark');
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || !activeTabPath) return;
    updateTabContent(activeTabPath, value);
    setSaveStatus(s => ({ ...s, [activeTabPath]: 'saving' }));

    if (saveTimersRef.current[activeTabPath]) clearTimeout(saveTimersRef.current[activeTabPath]);

    saveTimersRef.current[activeTabPath] = setTimeout(() => {
      if (!workspaceRoot) return;
      axios.put('/api/fs/file', { root: workspaceRoot, path: activeTabPath, content: value })
        .then(() => {
          setSaveStatus(s => ({ ...s, [activeTabPath]: 'saved' }));
          markTabSaved(activeTabPath);
        })
        .catch(err => console.error('Saqlashda xatolik:', err));
    }, 600);
  };

  const handleCopy = () => {
    if (!activeTab?.content) return;
    navigator.clipboard.writeText(activeTab.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Empty state
  if (!activeTab) {
    return (
      <div className="w-full h-full flex flex-col bg-[#0c0f18]">
        <TabBar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="glass-card max-w-sm w-full p-6 rounded-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-4">
              <Code2 size={28} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Fayl tanlang</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Chap paneldagi Explorer dan faylni bosing yoki yangi fayl yarating.
            </p>
            <div className="w-full pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <span>Avtomatik saqlash</span>
              <span>·</span>
              <span className="text-blue-400 font-mono">Monaco Editor</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabSave = saveStatus[activeTabPath ?? ''] ?? 'saved';

  return (
    <div className="w-full h-full flex flex-col bg-[#0c0f18]">

      {/* Tab Bar */}
      <TabBar />

      {/* Editor toolbar */}
      <div className="h-8 px-3 flex items-center justify-between border-b border-white/5 select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileCode size={12} className="text-blue-400" />
          <span className="text-xs font-mono text-slate-300 truncate max-w-[300px]">{activeTab.path}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Save status */}
          <span className={`text-[10px] flex items-center gap-1 ${
            tabSave === 'saving' ? 'text-amber-400' : 'text-emerald-400/70'
          }`}>
            {tabSave === 'saving'
              ? <><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />Saqlanmoqda...</>
              : <><Check size={10} />Saqlandi</>
            }
          </span>

          <div className="w-px h-3 bg-white/10" />

          {/* Language badge */}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider glass-panel-subtle text-blue-300">
            {activeTab.language}
          </span>

          {/* Copy */}
          <button onClick={handleCopy}
            className="p-1 rounded glass-button text-slate-500 hover:text-white" title="Kodni nusxalash">
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          key={activeTab.path}
          height="100%"
          language={activeTab.language}
          theme="glass-dark"
          value={activeTab.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
            minimap: { enabled: true, maxColumn: 80 },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 12, bottom: 12 },
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            renderLineHighlight: 'gutter',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
