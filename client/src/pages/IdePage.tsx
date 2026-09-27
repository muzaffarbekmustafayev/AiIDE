import React, { useEffect } from 'react';
import TerminalUI from '../components/TerminalUI';
import CodeEditor from '../components/CodeEditor';
import AiPanel from '../components/AiPanel';
import FileTree from '../components/FileTree';
import WorkspaceSelector from '../components/WorkspaceSelector';
import { useEditorStore } from '../store';

const SERVER_PORT = 4001;

function IdePage() {
    const { workspaceRoot, setFileTree, setActiveFile, setConnected } = useEditorStore();

    // Initial connection / auto-restore on mount
    useEffect(() => {
        const tryConnect = async () => {
            if (!workspaceRoot) {
                setConnected(false);
                return;
            }
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
            }
        };
        tryConnect();
    }, [workspaceRoot, setFileTree, setActiveFile, setConnected]);

    return (
        <div className="h-screen flex flex-col bg-bg text-text-primary font-sans overflow-hidden">

            {/* Top: Workspace Selector Bar */}
            <WorkspaceSelector />

            {/* Top Main Area: Sidebar + Editor + AI Panel */}
            <div className="flex-1 flex flex-row overflow-hidden">

                {/* File Explorer */}
                <div className="w-[260px] border-r border-border bg-bg-alt flex flex-col">
                    <FileTree />
                </div>

                {/* Center: Monaco Editor */}
                <div className="flex-1 relative flex flex-col bg-bg">
                    <CodeEditor />
                </div>

                {/* AI Chat/Agent Panel */}
                <div className="w-[380px] border-l border-border bg-bg-alt flex flex-col">
                    <AiPanel />
                </div>

            </div>

            {/* Bottom Panel for Terminal */}
            <div className="h-[35vh] border-t border-border bg-bg flex flex-col">
                <div className="px-4 py-1.5 text-[11px] uppercase tracking-widest text-accent-green border-b border-border bg-bg-alt flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    Terminal
                </div>
                <div className="flex-1 p-2">
                    <TerminalUI port={SERVER_PORT} />
                </div>
            </div>
        </div>
  );
}

export default IdePage;
