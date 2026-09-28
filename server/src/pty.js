const os = require('os');
const { spawn } = require('child_process');

function setupPty(socket) {
    const workspaceRoot = socket.handshake.query.root || process.env.WORKSPACE_ROOT || process.cwd();
    const shell = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');

    // Attempt to use native node-pty if available
    try {
        const pty = require('node-pty');
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: workspaceRoot,
            env: process.env
        });

        ptyProcess.onData((data) => {
            socket.emit('pty:data', data);
        });

        socket.on('pty:input', (data) => {
            ptyProcess.write(data);
        });

        socket.on('pty:resize', (size) => {
            if (size && size.cols && size.rows) {
                try { ptyProcess.resize(size.cols, size.rows); } catch (e) {}
            }
        });

        socket.on('disconnect', () => {
            try { ptyProcess.kill(); } catch (e) {}
        });
        return;
    } catch (e) {
        // Fall back to pure Node child_process
    }

    try {
        const proc = spawn(shell, ['-i'], {
            cwd: workspaceRoot,
            env: { ...process.env, TERM: 'xterm-color' },
            stdio: ['pipe', 'pipe', 'pipe']
        });

        proc.stdout.on('data', (data) => {
            socket.emit('pty:data', data.toString());
        });

        proc.stderr.on('data', (data) => {
            socket.emit('pty:data', data.toString());
        });

        socket.on('pty:input', (data) => {
            if (proc.stdin && proc.stdin.writable) {
                proc.stdin.write(data);
            }
        });

        socket.on('pty:resize', () => {});

        proc.on('close', () => {
            socket.emit('pty:data', '\r\n[Process completed]\r\n');
        });

        socket.on('disconnect', () => {
            try { proc.kill(); } catch (e) {}
        });
    } catch (err) {
        socket.emit('pty:data', `\r\nError launching terminal: ${err.message}\r\n`);
    }
}

module.exports = setupPty;
