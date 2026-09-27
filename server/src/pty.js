const os = require('os');
const pty = require('node-pty');

function setupPty(socket) {
    // Get workspace root from client or use default
    const workspaceRoot = socket.handshake.query.root || process.env.HOME || process.cwd();
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    
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
            ptyProcess.resize(size.cols, size.rows);
        }
    });

    socket.on('disconnect', () => {
        ptyProcess.kill();
    });
}

module.exports = setupPty;