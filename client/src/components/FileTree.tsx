import React, { useEffect, useState, useRef } from 'react';
import { 
  ChevronRight, ChevronDown, File, Folder, FolderPlus, 
  FilePlus, Trash2, RefreshCw, Edit2, Code, FileText 
} from 'lucide-react';
import axios from 'axios';
import { useEditorStore } from '../store';

const getFileIcon = (fileName: string, isDirectory: boolean, isOpen: boolean) => {
  if (isDirectory) {
    return <Folder size={14} className={isOpen ? 'text-accent-yellow fill-accent-yellow/20' : 'text-accent-yellow'} />;
  }
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
    return <Code size={14} className="text-accent-blue" />;
  }
  if (ext === 'json' || ext === 'yaml' || ext === 'yml') {
    return <FileText size={14} className="text-amber-400" />;
  }
  if (ext === 'css' || ext === 'scss' || ext === 'html') {
    return <Code size={14} className="text-accent-cyan" />;
  }
  if (ext === 'md') {
    return <FileText size={14} className="text-emerald-400" />;
  }
  return <File size={14} className="text-text-muted" />;
};

const FileTreeNode = ({ node, paddingLeft = 12 }: { node: any; paddingLeft?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [renameMode, setRenameMode] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const contextRef = useRef<HTMLDivElement>(null);
  const { workspaceRoot, setActiveFile, activeFilePath, setFileTree } = useEditorStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showContextMenu]);

  const handleFileClick = async () => {
    if (node.isDirectory) {
      setIsOpen(!isOpen);
    } else {
      try {
        const encodedRoot = encodeURIComponent(workspaceRoot);
        const encodedPath = encodeURIComponent(node.path);
        const res = await axios.get(`/api/fs/file?root=${encodedRoot}&path=${encodedPath}`);
        
        const ext = node.name.split('.').pop()?.toLowerCase();
        let lang = 'plaintext';
        if (ext === 'js' || ext === 'jsx') lang = 'javascript';
        if (ext === 'ts' || ext === 'tsx') lang = 'typescript';
        if (ext === 'py') lang = 'python';
        if (ext === 'html') lang = 'html';
        if (ext === 'css') lang = 'css';
        if (ext === 'json') lang = 'json';
        if (ext === 'md') lang = 'markdown';

        setActiveFile(node.path, res.data.content, lang);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    }
  };

  const handleCreate = async (isDir: boolean) => {
    try {
      const name = prompt(isDir ? 'Yangi papka nomi:' : 'Yangi fayl nomi:');
      if (!name) return;
      const parentPath = node.isDirectory ? node.path : node.path.substring(0, node.path.lastIndexOf('/'));
      const fullPath = parentPath ? `${parentPath}/${name}` : name;

      await axios.post('/api/fs/create', {
        root: workspaceRoot,
        path: fullPath,
        isDirectory: isDir
      });
      const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
      setFileTree(res.data);
    } catch (err) {
      console.error("Error creating:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${node.name}" ni o'chirishga ishonchingiz komilmi?`)) return;
    try {
      await axios.delete(`/api/fs/delete?root=${encodeURIComponent(workspaceRoot)}&path=${encodeURIComponent(node.path)}`);
      const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
      setFileTree(res.data);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleRename = async () => {
    if (!renameValue || renameValue === node.name) { 
      setRenameMode(false); 
      return; 
    }
    try {
      const newPath = node.path.substring(0, node.path.lastIndexOf('/') + 1) + renameValue;
      await axios.post('/api/fs/rename', {
        root: workspaceRoot,
        oldPath: node.path,
        newPath: newPath
      });
      const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
      setFileTree(res.data);
    } catch (err) {
      console.error("Error renaming:", err);
    }
    setRenameMode(false);
  };

  const isActive = activeFilePath === node.path;

  return (
    <div className="relative select-none text-xs" onContextMenu={(e) => { e.preventDefault(); setShowContextMenu(true); }}>
      {renameMode ? (
        <div style={{ paddingLeft: paddingLeft + 16 }} className="py-1">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
            className="w-full glass-input rounded-md px-2 py-1 text-xs text-white outline-none"
          />
        </div>
      ) : (
        <div 
          onClick={handleFileClick}
          className={`group flex items-center py-1.5 px-2 cursor-pointer transition-all duration-150 rounded-lg mx-1 ${
            isActive
              ? 'bg-accent-blue/15 text-white font-medium shadow-sm border border-accent-blue/30'
              : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <span className="mr-1 flex items-center w-3.5 flex-shrink-0">
            {node.isDirectory ? (
              isOpen ? <ChevronDown size={12} className="text-text-muted" /> : <ChevronRight size={12} className="text-text-muted" />
            ) : null}
          </span>

          <span className="mr-2 flex-shrink-0">
            {getFileIcon(node.name, node.isDirectory, isOpen)}
          </span>

          <span className="truncate flex-1">
            {node.name}
          </span>

          {/* Quick inline action triggers on hover */}
          <div className="hidden group-hover:flex items-center gap-0.5 opacity-80">
            {node.isDirectory && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCreate(false); }} 
                  className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-white" 
                  title="Yangi fayl"
                >
                  <FilePlus size={12} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCreate(true); }} 
                  className="p-1 rounded hover:bg-white/10 text-text-muted hover:text-white" 
                  title="Yangi papka"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Glassmorphic Context Menu */}
      {showContextMenu && (
        <div 
          className="absolute z-50 top-6 left-4 glass-modal rounded-xl overflow-hidden min-w-[170px] py-1 shadow-2xl animate-fadeIn" 
          ref={contextRef}
        >
          {node.isDirectory && (
            <>
              <button 
                onClick={() => { handleCreate(false); setShowContextMenu(false); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-white/10 transition-colors"
              >
                <FilePlus size={13} className="text-accent-blue" /> Yangi fayl
              </button>
              <button 
                onClick={() => { handleCreate(true); setShowContextMenu(false); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-white/10 transition-colors"
              >
                <FolderPlus size={13} className="text-accent-yellow" /> Yangi papka
              </button>
              <div className="border-t border-white/10 my-1" />
            </>
          )}
          <button 
            onClick={() => { setRenameMode(true); setRenameValue(node.name); setShowContextMenu(false); }} 
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-white/10 transition-colors"
          >
            <Edit2 size={13} className="text-text-secondary" /> Nomini o'zgartirish
          </button>
          <button 
            onClick={() => { handleDelete(); setShowContextMenu(false); }} 
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/15 transition-colors"
          >
            <Trash2 size={13} /> O'chirish
          </button>
        </div>
      )}

      {/* Sub-tree */}
      {node.isDirectory && isOpen && node.children && (
        <div className="relative pl-1 before:absolute before:left-3 before:top-0 before:bottom-2 before:w-[1px] before:bg-white/5">
          {node.children.map((child: any) => (
            <FileTreeNode key={child.path} node={child} paddingLeft={paddingLeft + 14} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC = () => {
  const { fileTree, setFileTree, workspaceRoot, connected } = useEditorStore();

  const refreshTree = async () => {
    if (!workspaceRoot || !connected) return;
    try {
      const res = await axios.get(`/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
      setFileTree(res.data);
    } catch (error) {
      console.error("Error fetching file tree:", error);
    }
  };

  useEffect(() => {
    refreshTree();
  }, [workspaceRoot, connected]);

  const handleCreateRoot = async (isDir: boolean) => {
    if (!workspaceRoot) return;
    const name = prompt(isDir ? 'Yangi papka nomi:' : 'Yangi fayl nomi:');
    if (!name) return;
    try {
      await axios.post('/api/fs/create', {
        root: workspaceRoot,
        path: name,
        isDirectory: isDir
      });
      refreshTree();
    } catch (err) {
      console.error("Error creating root item:", err);
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel-subtle text-text-primary select-none overflow-hidden">
      {/* Explorer Header */}
      <div className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted border-b border-white/5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-white/90">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleCreateRoot(false)} 
            className="p-1 rounded-md glass-button text-text-muted hover:text-white" 
            title="Yangi fayl yaratish"
          >
            <FilePlus size={12} />
          </button>
          <button 
            onClick={() => handleCreateRoot(true)} 
            className="p-1 rounded-md glass-button text-text-muted hover:text-white" 
            title="Yangi papka yaratish"
          >
            <FolderPlus size={12} />
          </button>
          <button 
            onClick={refreshTree} 
            className="p-1 rounded-md glass-button text-text-muted hover:text-white" 
            title="Yangilash"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {fileTree.length > 0 ? (
          fileTree.map((node) => (
            <FileTreeNode key={node.path} node={node} />
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-text-muted leading-relaxed">
              {connected ? "Papka bo'sh. Yuqoridagi tugma orqali fayl yarating." : "Papka tanlanmagan."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;
