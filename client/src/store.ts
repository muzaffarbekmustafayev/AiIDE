import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
}

export interface OpenTab {
    path: string;
    name: string;
    language: string;
    content: string;
    isDirty: boolean;
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

    // Multi-tab State
    openTabs: OpenTab[];
    activeTabPath: string | null;

    // Tab Actions
    openFile: (path: string, content: string, language: string) => void;
    closeTab: (path: string) => void;
    setActiveTab: (path: string) => void;
    updateTabContent: (path: string, content: string) => void;
    markTabSaved: (path: string) => void;

    // Compatibility shims (old single-file API)
    activeFilePath: string | null;
    activeFileContent: string;
    activeFileLanguage: string;
    setActiveFile: (path: string | null, content: string, language: string) => void;
    updateFileContent: (content: string) => void;
}

export const EXT_LANG_MAP: Record<string, string> = {
    js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', rb: 'ruby', go: 'go',
    rs: 'rust', java: 'java', cpp: 'cpp',
    c: 'c', cs: 'csharp', php: 'php',
    html: 'html', css: 'css', scss: 'scss',
    json: 'json', yaml: 'yaml', yml: 'yaml',
    md: 'markdown', sh: 'shell', bash: 'shell',
    sql: 'sql', xml: 'xml', toml: 'toml',
};

export function detectLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return EXT_LANG_MAP[ext] || 'plaintext';
}

const getInitialWorkspace = (): string => {
    try { return localStorage.getItem('aiide_workspace') || ''; } catch { return ''; }
};

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            workspaceRoot: getInitialWorkspace(),
            setWorkspaceRoot: (root) => {
                try { localStorage.setItem('aiide_workspace', root); } catch {}
                set({ workspaceRoot: root });
            },
            connected: false,
            setConnected: (connected) => set({ connected }),

            fileTree: [],
            setFileTree: (tree) => set({ fileTree: tree }),

            openTabs: [],
            activeTabPath: null,

            openFile: (path, content, language) => {
                const { openTabs } = get();
                const name = path.split('/').pop() || path;
                const existing = openTabs.find(t => t.path === path);
                if (existing) {
                    set({
                        activeTabPath: path,
                        activeFilePath: path,
                        openTabs: openTabs.map(t =>
                            t.path === path ? { ...t, content, isDirty: false } : t
                        ),
                    });
                } else {
                    set({
                        openTabs: [...openTabs, { path, name, language, content, isDirty: false }],
                        activeTabPath: path,
                        activeFilePath: path,
                    });
                }
            },

            closeTab: (path) => {
                const { openTabs, activeTabPath } = get();
                const idx = openTabs.findIndex(t => t.path === path);
                const remaining = openTabs.filter(t => t.path !== path);
                let nextActive: string | null = activeTabPath;
                if (activeTabPath === path) {
                    nextActive = remaining.length > 0 ? remaining[Math.max(0, idx - 1)].path : null;
                }
                set({ openTabs: remaining, activeTabPath: nextActive, activeFilePath: nextActive });
            },

            setActiveTab: (path) => set({ activeTabPath: path, activeFilePath: path }),

            updateTabContent: (path, content) => {
                set({
                    openTabs: get().openTabs.map(t =>
                        t.path === path ? { ...t, content, isDirty: true } : t
                    ),
                });
            },

            markTabSaved: (path) => {
                set({
                    openTabs: get().openTabs.map(t =>
                        t.path === path ? { ...t, isDirty: false } : t
                    ),
                });
            },

            // Compatibility shims — plain values derived at call time
            activeFilePath: null,
            activeFileContent: '',
            activeFileLanguage: 'plaintext',

            setActiveFile: (path, content, language) => {
                if (!path) { set({ activeTabPath: null, activeFilePath: null }); return; }
                get().openFile(path, content, language);
            },
            updateFileContent: (content) => {
                const { activeTabPath } = get();
                if (activeTabPath) get().updateTabContent(activeTabPath, content);
            },
        }),
        {
            name: 'aiide-state',
            partialize: (state) => ({ workspaceRoot: state.workspaceRoot }),
        }
    )
);

