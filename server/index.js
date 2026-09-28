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

// Setup WebSockets
io.on('connection', (socket) => {
    setupPty(socket);
});

const clientRoot = path.resolve(__dirname, '..', 'client');
const clientDist = path.resolve(clientRoot, 'dist');

async function startServer() {
    if (fs.existsSync(path.join(clientDist, 'index.html'))) {
        // Serve pre-built static client
        app.use(express.static(clientDist));
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientDist, 'index.html'));
        });
    } else {
        // Run Vite in middleware mode for hot development
        try {
            const { createServer: createViteServer } = await import('vite');
            const vite = await createViteServer({
                root: clientRoot,
                server: {
                    middlewareMode: true,
                    host: '0.0.0.0',
                    allowedHosts: true,
                },
                appType: 'spa'
            });
            app.use(vite.middlewares);
            app.use('*', async (req, res, next) => {
                const url = req.originalUrl;
                try {
                    let template = fs.readFileSync(path.resolve(clientRoot, 'index.html'), 'utf-8');
                    template = await vite.transformIndexHtml(url, template);
                    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
                } catch (e) {
                    vite.ssrFixStacktrace(e);
                    next(e);
                }
            });
        } catch (err) {
            console.warn('Vite middleware could not be loaded:', err.message);
        }
    }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
}

startServer();
