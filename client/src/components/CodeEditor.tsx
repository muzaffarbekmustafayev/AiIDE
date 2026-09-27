import React, { useRef } from 'react';
import Editor, { type EditorProps } from '@monaco-editor/react';
import { useEditorStore } from '../store';
import axios from 'axios';

const SERVER_PORT = 4001;

const CodeEditor: React.FC = () => {
    const editorRef = useRef<any>(null);
    const { workspaceRoot, activeFilePath, activeFileContent, activeFileLanguage, updateFileContent } = useEditorStore();

    const handleEditorDidMount: EditorProps['onMount'] = (editor, monaco) => {
        editorRef.current = editor;
        
        monaco.editor.defineTheme('vs-dark-custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0f111a'
            }
        });
        monaco.editor.setTheme('vs-dark-custom');
    };

    // Auto-save mechanism triggered on content change
    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            updateFileContent(value);
            if (activeFilePath && workspaceRoot) {
                axios.put(`http://localhost:${SERVER_PORT}/api/fs/file`, {
                    root: workspaceRoot,
                    path: activeFilePath,
                    content: value
                }).catch(err => console.error("Failed to save:", err));
            }
        }
    };

    if (!activeFilePath) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-text-muted gap-3">
                <div className="w-16 h-16 rounded-2xl bg-bg-alt flex items-center justify-center">
                    <FileIcon />
                </div>
                <p className="text-base">Select a file from the Explorer to start editing</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-bg">
            <div className="px-4 py-2 bg-bg-alt border-b border-border text-[13px] text-text-secondary font-mono truncate">
                {activeFilePath}
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={activeFileLanguage}
                    theme="vs-dark-custom"
                    value={activeFileContent}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                        fontSize: 14,
                        fontFamily: 'Consolas, "Courier New", monospace',
                        minimap: { enabled: true },
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
};

function FileIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
        </svg>
    );
}

export default CodeEditor;