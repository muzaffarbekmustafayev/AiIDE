import React, { useRef, useState } from 'react';
import Editor, { type EditorProps } from '@monaco-editor/react';
import { useEditorStore } from '../store';
import axios from 'axios';
import { 
  FileCode, Check, Copy, FilePlus, Code2, 
  Sparkles, Save, X, ExternalLink 
} from 'lucide-react';

const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>('saved');
  const [copied, setCopied] = useState(false);
  const saveTimeoutRef = useRef<any>(null);

  const { 
    workspaceRoot, 
    activeFilePath, 
    activeFileContent, 
    activeFileLanguage, 
    updateFileContent,
    setActiveFile 
  } = useEditorStore();

  const handleEditorDidMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('glass-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5a627a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '4facfe', fontStyle: 'bold' },
        { token: 'string', foreground: '64ffda' },
        { token: 'number', foreground: 'e2c044' },
      ],
      colors: {
        'editor.background': '#0c0f18',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#141824',
        'editorLineNumber.foreground': '#384259',
        'editorLineNumber.activeForeground': '#4facfe',
        'editorCursor.foreground': '#00f2fe',
        'editor.selectionBackground': '#2a3b5c',
        'editorWidget.background': '#121624',
        'editorWidget.border': '#262f48'
      }
    });
    monaco.editor.setTheme('glass-dark');
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(value);
      setSaveStatus('saving');

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (activeFilePath && workspaceRoot) {
          axios.put('/api/fs/file', {
            root: workspaceRoot,
            path: activeFilePath,
            content: value
          })
          .then(() => setSaveStatus('saved'))
          .catch((err) => {
            console.error("Saqlashda xatolik:", err);
            setSaveStatus(null);
          });
        }
      }, 500);
    }
  };

  const handleCopy = () => {
    if (!activeFileContent) return;
    navigator.clipboard.writeText(activeFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setActiveFile(null, '', 'plaintext');
  };

  if (!activeFilePath) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#0c0f18]/60 backdrop-blur-md">
        <div className="glass-card max-w-sm w-full p-6 rounded-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue mb-4">
            <Code2 size={28} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Tahrirlash uchun fayl tanlang</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Chap tarafdagi Explorer orqali istalgan faylni bosing yoki yangi fayl oching.
          </p>
          <div className="w-full pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-text-muted">
            <span>Avtomatik saqlash yoqilgan</span>
            <span>·</span>
            <span className="text-accent-cyan font-mono">VS Code Engine</span>
          </div>
        </div>
      </div>
    );
  }

  const fileName = activeFilePath.split('/').pop() || activeFilePath;

  return (
    <div className="w-full h-full flex flex-col bg-[#0c0f18]">
      {/* File Tab Bar with Glass styling */}
      <div className="h-9 px-3 glass-nav flex items-center justify-between border-b border-white/5 select-none">
        
        {/* Active Tab */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.06] border border-white/10 text-xs font-mono text-white max-w-[70%]">
          <FileCode size={13} className="text-accent-blue flex-shrink-0" />
          <span className="truncate">{fileName}</span>
          <button 
            onClick={handleClose}
            className="p-0.5 rounded hover:bg-white/10 text-text-muted hover:text-white ml-1 transition-colors"
            title="Yopish"
          >
            <X size={11} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
            {saveStatus === 'saving' ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Saqlanmoqda...
              </span>
            ) : (
              <span className="text-emerald-400/80 flex items-center gap-1">
                <Check size={11} />
                Saqlandi
              </span>
            )}
          </div>

          <div className="w-px h-3.5 bg-white/10 hidden sm:block" />

          {/* Language Badge */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider glass-panel-subtle text-accent-cyan">
            {activeFileLanguage}
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1 rounded-md glass-button text-text-muted hover:text-white"
            title="Kodni nusxalash"
          >
            {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
          </button>
        </div>

      </div>

      {/* Editor Body */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={activeFileLanguage}
          theme="glass-dark"
          value={activeFileContent}
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
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
