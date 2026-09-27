import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderPlus, FilePlus, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useEditorStore } from '../store';

const SERVER_PORT = 4001;

const FileTreeNode = ({ node, paddingLeft = 14 }: { node: any; paddingLeft?: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [renameMode, setRenameMode] = useState(false);
    const [renameValue, setRenameValue] = useState(node.name);
    const contextRef = React.useRef<HTMLDivElement>(null);
    const { workspaceRoot, setActiveFile, activeFilePath, setFileTree } = useEditorStore();

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextRef.current &&!contextRef.current.contains(e.target as Node)) {
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
                const res = await axios.get(`http://localhost:${SERVER_PORT}/api/fs/file?root=${encodedRoot}&path=${encodedPath}`);
                
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
            const name = prompt(isDir? 'New folder name:' : 'New file name:');
            if (!name) return;
            const parentPath = node.isDirectory? node.path : node.path.substring(0, node.path.lastIndexOf('/'));
            const fullPath = parentPath? `${parentPath}/${name}` : name;

            await axios.post(`http://localhost:${SERVER_PORT}/api/fs/create`, {
                root: workspaceRoot,
                path: fullPath,
                isDirectory: isDir
            });
            // Refresh tree
            const res = await axios.get(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
            setFileTree(res.data);
        } catch (err) {
            console.error("Error creating:", err);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${node.name}"? This cannot be undone.`)) return;
        try {
            await axios.delete(`http://localhost:${SERVER_PORT}/api/fs/delete?root=${encodeURIComponent(workspaceRoot)}&path=${encodeURIComponent(node.path)}`);
            const res = await axios.get(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
            setFileTree(res.data);
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    const handleRename = async () => {
        if (!renameValue || renameValue === node.name) { setRenameMode(false); return; }
        try {
            const newPath = node.path.substring(0, node.path.lastIndexOf('/') + 1) + renameValue;
            await axios.post(`http://localhost:${SERVER_PORT}/api/fs/rename`, {
                root: workspaceRoot,
                oldPath: node.path,
                newPath: newPath
            });
            const res = await axios.get(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
            setFileTree(res.data);
        } catch (err) {
            console.error("Error renaming:", err);
        }
        setRenameMode(false);
    };

    const isActive = activeFilePath === node.path;

    return (
        <div className="relative" onContextMenu={(e) => { e.preventDefault(); setShowContextMenu(true); }}>
            {renameMode? (
                <div style={{ paddingLeft: paddingLeft + 20 }}>
                    <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        autoFocus
                        className="w-full bg-bg-alt border border-accent-blue rounded px-1.5 py-0.5 text-[13px] text-text-primary outline-none"
                    />
                </div>
            ) : (
                <div 
                    onClick={handleFileClick}
                    className={`group flex items-center py-1.5 cursor-pointer transition-all duration-200 text-[13px] border-l-2 select-none ${
                        isActive
                           ? 'bg-[rgba(79,172,254,0.1)] text-accent-blue border-accent-blue'
                            : 'text-text-secondary border-transparent hover:bg-border-hover hover:text-text-primary'
                    }`}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                >
                    <span className="mr-1 flex items-center w-4 flex-shrink-0">
                        {node.isDirectory? (
                            isOpen? <ChevronDown size={12} className="text-text-muted" /> : <ChevronRight size={12} className="text-text-muted" />
                        ) : (
                            <span className="w-4" />
                        )}
                    </span>

                    <span className={`mr-2 flex-shrink-0 ${node.isDirectory? 'text-accent-yellow' : (isActive? 'text-accent-blue' : 'text-text-secondary')}`}>
                        {node.isDirectory? <Folder size={14} fill={isOpen? "currentColor" : "none"} /> : <File size={14} />}
                    </span>

                    <span className={`truncate flex-1 ${isActive? 'font-medium' : ''}`}>
                        {node.name}
                    </span>

                    {/* Hover actions */}
                    <div className="hidden group-hover:flex items-center gap-1 mr-1">
                        {node.isDirectory && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); handleCreate(false); }} className="p-0.5 rounded hover:bg-border-hover text-text-muted" title="New File">
                                    <FilePlus size={12} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleCreate(true); }} className="p-0.5 rounded hover:bg-border-hover text-text-muted" title="New Folder">
                                    <FolderPlus size={12} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Context Menu */}
            {showContextMenu && (
                <div className="absolute z-50 top-6 left-4 bg-bg-alt border border-border rounded-lg shadow-xl overflow-hidden min-w-[160px]" ref={contextRef}>
                    {node.isDirectory && (
                        <>
                            <button onClick={() => { handleCreate(false); setShowContextMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-primary hover:bg-border-hover transition-colors">
                                <FilePlus size={13} /> New File
                            </button>
                            <button onClick={() => { handleCreate(true); setShowContextMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-primary hover:bg-border-hover transition-colors">
                                <FolderPlus size={13} /> New Folder
                            </button>
                            <div className="border-t border-border" />
                        </>
                    )}
                    <button onClick={() => { setRenameMode(true); setRenameValue(node.name); setShowContextMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-primary hover:bg-border-hover transition-colors">
                        <span className="text-[11px]">Rename</span>
                    </button>
                    <button onClick={() => { handleDelete(); setShowContextMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13} /> Delete
                    </button>
                </div>
            )}

            {/* Children */}
            {node.isDirectory && isOpen && node.children && (
                <div>
                    {node.children.map((child: any) => (
                        <FileTreeNode key={child.path} node={child} paddingLeft={paddingLeft + 16} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree: React.FC = () => {
    const { fileTree, setFileTree, workspaceRoot, connected } = useEditorStore();

    const refreshTree = async () => {
        if (!workspaceRoot ||!connected) return;
        try {
            const res = await axios.get(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodeURIComponent(workspaceRoot)}`);
            setFileTree(res.data);
        } catch (error) {
            console.error("Error fetching file tree:", error);
        }
    };

    useEffect(() => {
        refreshTree();
    }, [workspaceRoot, connected]);

    return (
        <div className="h-full overflow-y-auto bg-bg-alt text-text-primary" onClick={() => document.body.click()}>
            <div className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-accent-green border-b border-border mb-1 flex items-center justify-between">
                <span>Explorer</span>
                <button onClick={refreshTree} className="p-0.5 rounded hover:bg-border-hover text-text-muted" title="Refresh">
                    <RefreshCw size={11} />
                </button>
            </div>
            {fileTree.length > 0? (
                fileTree.map((node) => (
                    <FileTreeNode key={node.path} node={node} />
                ))
            ) : (
                <div className="px-4 py-6 text-center">
                    <p className="text-[12px] text-text-muted">
                        {connected? 'Empty folder' : 'Select a workspace to begin'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FileTree;