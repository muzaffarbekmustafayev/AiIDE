import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ChevronRight, ChevronDown, Folder, FolderOpen, FolderPlus,
  FilePlus, Trash2, RefreshCw, Edit2, Search, X,
  FileCode, FileJson, FileText, FileType, FileCog, FileImage,
  Coffee, Database, Globe, Hash, Layers, Terminal, Braces
} from 'lucide-react';
import axios from 'axios';
import { useEditorStore, detectLanguage } from '../store';

// ── File icon helper ────────────────────────────────────────────────────────
const getFileIcon = (name: string, isDir: boolean, open: boolean) => {
  if (isDir) return open
    ? <FolderOpen size={14} className="text-amber-400 fill-amber-400/20 flex-shrink-0" />
    : <Folder     size={14} className="text-amber-400 flex-shrink-0" />;

  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const cls = 'flex-shrink-0';
  if (['ts','tsx'].includes(ext))       return <FileCode size={14} className={`text-blue-400 ${cls}`} />;
  if (['js','jsx','mjs'].includes(ext)) return <FileCode size={14} className={`text-yellow-400 ${cls}`} />;
  if (['py'].includes(ext))             return <FileCode size={14} className={`text-green-400 ${cls}`} />;
  if (['json','jsonc'].includes(ext))   return <FileJson size={14} className={`text-amber-300 ${cls}`} />;
  if (['html','htm'].includes(ext))     return <Globe    size={14} className={`text-orange-400 ${cls}`} />;
  if (['css','scss','sass'].includes(ext)) return <Hash  size={14} className={`text-pink-400 ${cls}`} />;
  if (['md','mdx'].includes(ext))       return <FileText size={14} className={`text-emerald-400 ${cls}`} />;
  if (['env','env.local','env.example'].some(s => name.endsWith(s))) return <FileCog size={14} className={`text-red-400 ${cls}`} />;
  if (['sh','bash','zsh'].includes(ext)) return <Terminal size={14} className={`text-cyan-400 ${cls}`} />;
  if (['sql'].includes(ext))            return <Database size={14} className={`text-violet-400 ${cls}`} />;
  if (['yaml','yml','toml'].includes(ext)) return <Layers size={14} className={`text-rose-300 ${cls}`} />;
  if (['java','kt'].includes(ext))      return <Coffee  size={14} className={`text-orange-500 ${cls}`} />;
  if (['rs'].includes(ext))             return <Braces  size={14} className={`text-orange-400 ${cls}`} />;
  if (['go'].includes(ext))             return <FileType size={14} className={`text-cyan-300 ${cls}`} />;
  if (['png','jpg','jpeg','gif','svg','webp','ico'].includes(ext)) return <FileImage size={14} className={`text-purple-400 ${cls}`} />;
  return <FileText size={14} className={`text-slate-400 ${cls}`} />;
};

// ── Context-menu (absolutely positioned) ────────────────────────────────────
interface CtxMenuProps {
  x: number; y: number;
  isDir: boolean;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
}
const ContextMenu: React.FC<CtxMenuProps> = ({ x, y, isDir, onClose, onNewFile, onNewFolder, onRename, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Clamp to viewport
  const [pos, setPos] = useState({ left: x, top: y });
  useEffect(() => {
    if (!ref.current) return;
    const { right, bottom } = ref.current.getBoundingClientRect();
    setPos({
      left: right > window.innerWidth  ? x - (right - window.innerWidth)  - 8 : x,
      top:  bottom > window.innerHeight ? y - (bottom - window.innerHeight) - 8 : y,
    });
  }, [x, y]);

  const item = (icon: React.ReactNode, label: string, action: () => void, danger = false) => (
    <button
      onClick={() => { action(); onClose(); }}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
        danger ? 'text-red-400 hover:bg-red-500/15' : 'text-slate-200 hover:bg-white/10'
      }`}
    >{icon}{label}</button>
  );

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', left: pos.left, top: pos.top, zIndex: 9999 }}
      className="glass-modal rounded-xl overflow-hidden min-w-[168px] py-1 shadow-2xl animate-fadeIn"
    >
      {isDir && (<>
        {item(<FilePlus   size={13} className="text-blue-400" />,   'Yangi fayl',   onNewFile)}
        {item(<FolderPlus size={13} className="text-amber-400" />,  'Yangi papka',  onNewFolder)}
        <div className="border-t border-white/10 my-1" />
      </>)}
      {item(<Edit2 size={13} className="text-slate-400" />, "Nomini o'zgartirish", onRename)}
      {item(<Trash2 size={13} />, "O'chirish", onDelete, true)}
    </div>
  );
};

// ── Inline create input ──────────────────────────────────────────────────────
interface InlineInputProps { onConfirm: (name: string) => void; onCancel: () => void; icon: React.ReactNode; }
const InlineInput: React.FC<InlineInputProps> = ({ onConfirm, onCancel, icon }) => {
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const confirm = () => { if (val.trim()) onConfirm(val.trim()); else onCancel(); };
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {icon}
      <input
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') onCancel(); }}
        onBlur={onCancel}
        placeholder="Nom kiriting..."
        className="flex-1 glass-input rounded px-2 py-0.5 text-xs text-white outline-none"
      />
    </div>
  );
};

// ── FileTreeNode ─────────────────────────────────────────────────────────────
interface NodeProps { node: any; depth?: number; searchQuery?: string; }

const FileTreeNode: React.FC<NodeProps> = ({ node, depth = 0, searchQuery = '' }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const [renameMode, setRenameMode] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);
  const [creating, setCreating] = useState<'file'|'folder'|null>(null);
  const [ctxMenu, setCtxMenu] = useState<{x:number;y:number}|null>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const { workspaceRoot, openFile, activeTabPath, setFileTree, openTabs } = useEditorStore();

  // Auto-open if search matches a child
  const hasMatch = useCallback((n: any): boolean => {
    if (!searchQuery) return false;
    if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
    return n.children?.some(hasMatch) ?? false;
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery && node.isDirectory && hasMatch(node)) setIsOpen(true);
  }, [searchQuery, node, hasMatch]);

  useEffect(() => { if (renameMode) renameRef.current?.focus(); }, [renameMode]);

  const refreshTree = async () => {
    const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
    setFileTree(res.data);
  };

  const handleClick = async () => {
    if (node.isDirectory) { setIsOpen(v => !v); return; }
    try {
      const lang = detectLanguage(node.name);
      // If already open, just activate
      const already = openTabs.find(t => t.path === node.path);
      if (already) { useEditorStore.getState().setActiveTab(node.path); return; }
      const res = await axios.get(
        `/api/fs/file?root=${encodeURIComponent(workspaceRoot)}&path=${encodeURIComponent(node.path)}`
      );
      useEditorStore.getState().openFile(node.path, res.data.content, lang);
    } catch (e) { console.error('File open error:', e); }
  };

  const handleCreate = async (name: string, isDir: boolean) => {
    setCreating(null);
    const parentPath = node.isDirectory ? node.path : node.path.substring(0, node.path.lastIndexOf('/'));
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    await axios.post('/api/fs/create', { root: workspaceRoot, path: fullPath, isDirectory: isDir });
    await refreshTree();
    if (!isDir) {
      useEditorStore.getState().openFile(fullPath, '', detectLanguage(name));
      if (node.isDirectory) setIsOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${node.name}" ni o'chirishga ishonchingiz komilmi?`)) return;
    await axios.delete(`/api/fs/delete?root=${encodeURIComponent(workspaceRoot)}&path=${encodeURIComponent(node.path)}`);
    await refreshTree();
  };

  const handleRename = async () => {
    setRenameMode(false);
    if (!renameVal || renameVal === node.name) return;
    const newPath = node.path.substring(0, node.path.lastIndexOf('/') + 1) + renameVal;
    await axios.post('/api/fs/rename', { root: workspaceRoot, oldPath: node.path, newPath });
    await refreshTree();
  };

  const isActive = activeTabPath === node.path;
  const indent   = depth * 12;

  // Search: hide if no match
  if (searchQuery) {
    const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!node.isDirectory && !matches) return null;
    if (node.isDirectory && !hasMatch(node) && !matches) return null;
  }

  return (
    <div className="select-none text-xs">
      {/* Context menu portal */}
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x} y={ctxMenu.y}
          isDir={node.isDirectory}
          onClose={() => setCtxMenu(null)}
          onNewFile={() => { setIsOpen(true); setCreating('file'); }}
          onNewFolder={() => { setIsOpen(true); setCreating('folder'); }}
          onRename={() => { setRenameMode(true); setRenameVal(node.name); }}
          onDelete={handleDelete}
        />
      )}

      {/* Row */}
      {renameMode ? (
        <div style={{ paddingLeft: indent + 20 }} className="py-0.5 pr-2">
          <input
            ref={renameRef}
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenameMode(false); }}
            className="w-full glass-input rounded px-2 py-0.5 text-xs text-white outline-none"
          />
        </div>
      ) : (
        <div
          onClick={handleClick}
          onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY }); }}
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleClick()}
          className={`group flex items-center gap-1 py-[5px] pr-2 cursor-pointer rounded-lg mx-1 transition-all duration-100 outline-none focus-visible:ring-1 focus-visible:ring-blue-400/50 ${
            isActive
              ? 'bg-blue-500/15 text-white font-medium border border-blue-400/25'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
          }`}
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          {/* Chevron for directories */}
          <span className="w-3.5 flex-shrink-0 flex items-center justify-center">
            {node.isDirectory
              ? (isOpen ? <ChevronDown size={12} className="text-slate-500" /> : <ChevronRight size={12} className="text-slate-500" />)
              : null
            }
          </span>

          {getFileIcon(node.name, node.isDirectory, isOpen)}

          {/* Highlight matching text */}
          {searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase()) ? (
            <span className="flex-1 truncate">
              {(() => {
                const lo = node.name.toLowerCase();
                const qi = lo.indexOf(searchQuery.toLowerCase());
                return <>
                  {node.name.slice(0, qi)}
                  <mark className="bg-yellow-400/30 text-yellow-200 rounded-sm px-0">{node.name.slice(qi, qi + searchQuery.length)}</mark>
                  {node.name.slice(qi + searchQuery.length)}
                </>;
              })()}
            </span>
          ) : (
            <span className="flex-1 truncate">{node.name}</span>
          )}

          {/* Hover actions (directories only) */}
          {node.isDirectory && (
            <div className="flex items-center gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button onClick={e => { e.stopPropagation(); setIsOpen(true); setCreating('file'); }}
                className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white" title="Yangi fayl">
                <FilePlus size={11} />
              </button>
              <button onClick={e => { e.stopPropagation(); setIsOpen(true); setCreating('folder'); }}
                className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white" title="Yangi papka">
                <FolderPlus size={11} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline create row */}
      {creating && node.isDirectory && (
        <div style={{ paddingLeft: indent + 20 }}>
          <InlineInput
            icon={creating === 'file'
              ? <FileText size={13} className="text-slate-400 flex-shrink-0" />
              : <Folder   size={13} className="text-amber-400 flex-shrink-0" />
            }
            onConfirm={name => handleCreate(name, creating === 'folder')}
            onCancel={() => setCreating(null)}
          />
        </div>
      )}

      {/* Children */}
      {node.isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child: any) => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} searchQuery={searchQuery} />
          ))}
          {/* Empty folder message */}
          {node.children.length === 0 && (
            <div style={{ paddingLeft: indent + 28 }} className="py-1 text-[10px] text-slate-600 italic">Bo'sh papka</div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Loading skeleton ─────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-1 px-2 py-2 animate-pulse">
    {[0.7, 0.5, 0.85, 0.6, 0.75].map((w, i) => (
      <div key={i} className="flex items-center gap-2 py-1" style={{ paddingLeft: (i % 3) * 12 + 8 }}>
        <div className="w-3 h-3 rounded bg-white/10" />
        <div className="h-2.5 rounded bg-white/10" style={{ width: `${w * 100}%` }} />
      </div>
    ))}
  </div>
);

// ── FileTree root ─────────────────────────────────────────────────────────────
const FileTree: React.FC = () => {
  const { fileTree, setFileTree, workspaceRoot, connected } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const refreshTree = useCallback(async () => {
    if (!workspaceRoot || !connected) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
      setFileTree(res.data);
    } catch (e) { console.error('Tree error:', e); }
    finally { setLoading(false); }
  }, [workspaceRoot, connected, setFileTree]);

  useEffect(() => { refreshTree(); }, [refreshTree]);

  const handleCreateRoot = async (isDir: boolean) => {
    if (!workspaceRoot) return;
    const name = prompt(isDir ? 'Yangi papka nomi:' : 'Yangi fayl nomi:');
    if (!name) return;
    await axios.post('/api/fs/create', { root: workspaceRoot, path: name, isDirectory: isDir });
    refreshTree();
  };

  return (
    <div className="h-full flex flex-col text-slate-200 select-none overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between gap-1 flex-shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Explorer</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => handleCreateRoot(false)}
            className="p-1 rounded glass-button text-slate-500 hover:text-white" title="Yangi fayl">
            <FilePlus size={12} />
          </button>
          <button onClick={() => handleCreateRoot(true)}
            className="p-1 rounded glass-button text-slate-500 hover:text-white" title="Yangi papka">
            <FolderPlus size={12} />
          </button>
          <button onClick={refreshTree}
            className={`p-1 rounded glass-button text-slate-500 hover:text-white ${loading ? 'animate-spin' : ''}`} title="Yangilash">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-2 py-1.5 border-b border-white/5 flex-shrink-0">
        <div className="relative flex items-center">
          <Search size={11} className="absolute left-2 text-slate-500 pointer-events-none" />
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Fayl qidirish..."
            className="w-full glass-input rounded-lg pl-6 pr-6 py-1 text-xs text-white placeholder:text-slate-600 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-1.5 text-slate-500 hover:text-white">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Tree content */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading && fileTree.length === 0 ? (
          <Skeleton />
        ) : fileTree.length > 0 ? (
          fileTree.map(node => (
            <FileTreeNode key={node.path} node={node} depth={0} searchQuery={search} />
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <FolderOpen size={28} className="mx-auto mb-2 text-slate-700" />
            <p className="text-[11px] text-slate-600">
              {connected ? 'Papka bo\u02bcsh.' : 'Papka tanlanmagan.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
