import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';
import { useEditorStore } from '../store';

interface TerminalUIProps {
    port?: number;
}

const TerminalUI: React.FC<TerminalUIProps> = ({ port = 4001 }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const { workspaceRoot } = useEditorStore();

    useEffect(() => {
        if (!terminalRef.current) return;

        // 1. Initialize xterm.js
        const term = new Terminal({
            theme: {
                background: '#0f111a',
                foreground: '#e2e8f0',
                cursor: '#4facfe',
            },
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: 14,
            cursorBlink: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // 2. Connect to Backend via Socket.io with workspace root
        const socketOptions: any = {};
        if (workspaceRoot) {
            socketOptions.query = { root: workspaceRoot };
        }
        const socket = io(`http://localhost:${port}`, socketOptions);
        socketRef.current = socket;

        // Listen for data from server and write to terminal
        socket.on('pty:data', (data: string) => {
            term.write(data);
        });

        // Listen for user typing in terminal and send to server
        term.onData((data) => {
            socket.emit('pty:input', data);
        });

        // 3. Handle Resizing
        const handleResize = () => {
            if (fitAddonRef.current && xtermRef.current) {
                fitAddonRef.current.fit();
                const dims = fitAddonRef.current.proposeDimensions();
                if (dims) {
                    socket.emit('pty:resize', { cols: dims.cols, rows: dims.rows });
                }
            }
        };

        // Initial resize for backend PTY
        handleResize();
        
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, [port, workspaceRoot]);

    return (
        <div className="h-full w-full bg-bg overflow-hidden rounded-lg">
            <div ref={terminalRef} className="h-full w-full p-2" />
        </div>
    );
};

export default TerminalUI;
