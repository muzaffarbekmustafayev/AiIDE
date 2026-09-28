const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const setupPty = require('./src/pty');
const fsRoutes = require('./src/routes/fs');
const gitRoutes = require('./src/routes/git');
const aiRoutes = require('./src/routes/ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Setup Routes
app.use('/api/fs', fsRoutes);
app.use('/api/git', gitRoutes);
app.use('/api/ai', aiRoutes);

// Setup WebSockets
io.on('connection', (socket) => {
    setupPty(socket);
});

const clientRoot = path.resolve(__dirname, '..', 'client');
const clientDist = path.resolve(clientRoot, 'dist');

async function startServer() {
    if (fs.existsSync(path.join(clientDist, 'index.html'))) {
        app.use(express.static(clientDist));
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientDist, 'index.html'));
        });
    } else {
        console.log('Ishchi moddalar qurilishi topilmadi (client/dist).');
        console.log('API + Socket.IO jarayonlari baribir ishlaydi.');
        console.log('Frontend uchun: "npm run dev" (root katalog) — Vite 5173 portida ishlaydi.');
    }

    const BASE_PORT = parseInt(process.env.PORT || '4001', 10);

    function tryListen(port) {
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.warn(`⚠️  Port ${port} band, ${port + 1} sinab ko'rilmoqda...`);
                server.close();
                tryListen(port + 1);
            } else {
                console.error('Server xatosi:', err);
                process.exit(1);
            }
        });
        server.listen(port, '0.0.0.0', () => {
            console.log(`✅ Server listening on http://0.0.0.0:${port}`);
        });
    }

    tryListen(BASE_PORT);
}

startServer();
