import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io, Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';
import { useEditorStore } from '../store';

interface TerminalUIProps {
  onClear?: () => void;
}

const TerminalUI: React.FC<TerminalUIProps> = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { workspaceRoot } = useEditorStore();

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#0a0d16',
        foreground: '#e2e8f0',
        cursor: '#00f2fe',
        cursorAccent: '#0a0d16',
        selectionBackground: 'rgba(79, 172, 254, 0.3)',
        black: '#1e2130',
        red: '#ff5370',
        green: '#64ffda',
        yellow: '#ffcb6b',
        blue: '#82aaff',
        magenta: '#c792ea',
        cyan: '#89ddff',
        white: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 1.3,
      cursorBlink: true,
      cursorStyle: 'bar',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    
    // Fit immediately after render
    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (e) {}
    }, 100);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Connect to Backend via Socket.io
    const socketOptions: any = {};
    if (workspaceRoot) {
      socketOptions.query = { root: workspaceRoot };
    }
    const socket = io(socketOptions);
    socketRef.current = socket;

    socket.on('pty:data', (data: string) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit('pty:input', data);
    });

    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        try {
          fitAddonRef.current.fit();
          const dims = fitAddonRef.current.proposeDimensions();
          if (dims && dims.cols && dims.rows) {
            socket.emit('pty:resize', { cols: dims.cols, rows: dims.rows });
          }
        } catch (e) {}
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      socket.disconnect();
      term.dispose();
    };
  }, [workspaceRoot]);

  return (
    <div className="h-full w-full bg-[#0a0d16] overflow-hidden rounded-xl border border-white/5 relative">
      <div ref={terminalRef} className="h-full w-full p-2.5" />
    </div>
  );
};

export default TerminalUI;
