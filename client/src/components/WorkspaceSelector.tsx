import React, { useState } from 'react';
import { FolderOpen, RefreshCw, Check, X, Server, Folder } from 'lucide-react';
import { useEditorStore } from '../store';

const SERVER_PORT = 4001;

const WorkspaceSelector: React.FC = () => {
    const { workspaceRoot, setWorkspaceRoot, connected, setConnected, setFileTree, setActiveFile } = useEditorStore();
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState(workspaceRoot);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a valid workspace path');
            return;
        }
        
        setConnecting(true);
        setError('');
        
        try {
            // Test connection by fetching the tree
            const encodedRoot = encodeURIComponent(inputValue.trim());
            const res = await fetch(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodedRoot}`);
            
            if (!res.ok) throw new Error('Server returned an error');
            
            const tree = await res.json();
            
            // Success! Update store
            setWorkspaceRoot(inputValue.trim());
            setFileTree(tree);
            setActiveFile(null, '', 'plaintext');
            setConnected(true);
            setShowModal(false);
            
        } catch (err: any) {
            setError('Could not connect to workspace. Is the path valid and server running?');
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
            const res = await fetch(`http://localhost:${SERVER_PORT}/api/fs/tree?root=${encodedRoot}`);
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

    return (
        <>
            {/* Top Bar */}
            <div className="h-11 flex items-center px-3 bg-bg-alt border-b border-border gap-2">
                {/* Connection Status */}
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${connected ? 'text-accent-green' : 'text-red-400'}`}>
                    <Server size={12} />
                    <span>{connected ? 'Connected' : 'Disconnected'}</span>
                </div>

                <div className="w-px h-5 bg-border" />

                {/* Current Workspace */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Folder size={14} className={connected ? 'text-accent-blue' : 'text-text-muted'} />
                    <span className={`text-[13px] truncate ${connected ? 'text-text-primary' : 'text-text-muted'}`}>
                        {workspaceRoot || 'No workspace selected'}
                    </span>
                </div>

                {/* Actions */}
                <button
                    onClick={handleRefresh}
                    disabled={!connected || connecting}
                    className="p-1.5 rounded-md hover:bg-border-hover text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Refresh file tree"
                >
                    <RefreshCw size={14} className={connecting ? 'animate-spin' : ''} />
                </button>

                <button
                    onClick={() => { setShowModal(true); setInputValue(workspaceRoot); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-border-hover hover:bg-accent-blue hover:text-white text-text-primary transition-colors"
                >
                    <FolderOpen size={13} />
                    Open Folder
                </button>
            </div>

            {/* Workspace Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div 
                        className="bg-bg-alt border border-border rounded-xl p-6 w-[480px] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary">Open Workspace</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-border-hover">
                                <X size={18} className="text-text-secondary" />
                            </button>
                        </div>

                        <p className="text-[13px] text-text-secondary mb-4">
                            Enter the full absolute path to the project folder you want to work in.
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                                placeholder="C:\Users\you\project\..."
                                className="flex-1 bg-bg border border-border rounded-lg px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue transition-colors font-mono"
                                autoFocus
                            />
                            <button
                                onClick={handleConnect}
                                disabled={connecting}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-gradient-to-r from-accent-blue to-accent-cyan text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {connecting ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <Check size={14} />
                                )}
                                Connect
                            </button>
                        </div>

                        {error && (
                            <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[12px]">
                                {error}
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-[11px] text-text-muted">
                                Examples: <code className="text-accent-blue">C:\Users\you\myapp</code>,{' '}
                                <code className="text-accent-blue">/home/user/project</code>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WorkspaceSelector;