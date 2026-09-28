import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
}

export interface EditorState {
    // Workspace State
    workspaceRoot: string;
    setWorkspaceRoot: (root: string) => void;
    connected: boolean;
    setConnected: (connected: boolean) => void;
    
    // File Tree State
    fileTree: FileNode[];
    setFileTree: (tree: FileNode[]) => void;
    
    // Active File State
    activeFilePath: string | null;
    activeFileContent: string;
    activeFileLanguage: string;
    
    // Actions
    setActiveFile: (path: string | null, content: string, language: string) => void;
    updateFileContent: (content: string) => void;
}

// Get workspace from localStorage
const getInitialWorkspace = (): string => {
    try {
        return localStorage.getItem('aiide_workspace') || '';
    } catch {
        return '';
    }
};

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            workspaceRoot: getInitialWorkspace(),
            setWorkspaceRoot: (root) => {
                try { localStorage.setItem('aiide_workspace', root); } catch {}
                set({ workspaceRoot: root });
            },
            connected: false,
            setConnected: (connected) => set({ connected }),
            
            fileTree: [],
            setFileTree: (tree) => set({ fileTree: tree }),
            
            activeFilePath: null,
            activeFileContent: '// Select a file to start editing...',
            activeFileLanguage: 'plaintext',
            
            setActiveFile: (path, content, language) => set({ 
                activeFilePath: path, 
                activeFileContent: content,
                activeFileLanguage: language
            }),
            
            updateFileContent: (content) => set({ activeFileContent: content }),
        }),
        {
            name: 'aiide-state',
            partialize: (state) => ({ workspaceRoot: state.workspaceRoot }),
        }
    )
);
