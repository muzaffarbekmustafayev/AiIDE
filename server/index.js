const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
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
    console.log(`Client connected: ${socket.id}`);
    
    // Initialize PTY for the client
    setupPty(socket);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4001; // Port o'zgartirildi
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

