const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store room information
const rooms = new Map();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints for room management
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle creating a new room
    socket.on('create-room', (data) => {
        const { roomId, password } = data;
        
        if (rooms.has(roomId)) {
            socket.emit('room-error', { message: 'Room already exists' });
            return;
        }

        // Create new room
        rooms.set(roomId, {
            id: roomId,
            password: password || null,
            users: new Set(),
            messages: []
        });

        socket.join(roomId);
        rooms.get(roomId).users.add(socket.id);
        
        socket.emit('room-created', { roomId, success: true });
        io.to(roomId).emit('user-count-update', {
            count: rooms.get(roomId).users.size
        });
    });

    // Handle joining a room
    socket.on('join-room', (data) => {
        const { roomId, password } = data;
        
        if (!rooms.has(roomId)) {
            socket.emit('room-error', { message: 'Room does not exist' });
            return;
        }

        const room = rooms.get(roomId);
        
        // Check password if set
        if (room.password && room.password !== password) {
            socket.emit('room-error', { message: 'Incorrect password' });
            return;
        }

        socket.join(roomId);
        room.users.add(socket.id);
        
        // Send chat history
        socket.emit('chat-history', room.messages);
        
        // Notify others in room
        socket.to(roomId).emit('user-joined', {
            userId: socket.id,
            count: room.users.size
        });
        
        socket.emit('joined-room', { 
            roomId, 
            success: true,
            userId: socket.id
        });
        
        io.to(roomId).emit('user-count-update', {
            count: room.users.size
        });
    });

    // Handle leaving a room
    socket.on('leave-room', (data) => {
        const { roomId } = data;
        
        if (!rooms.has(roomId)) return;
        
        const room = rooms.get(roomId);
        room.users.delete(socket.id);
        socket.leave(roomId);
        
        // Notify others in room
        socket.to(roomId).emit('user-left', {
            userId: socket.id,
            count: room.users.size
        });
        
        // If room is empty, remove it
        if (room.users.size === 0) {
            rooms.delete(roomId);
        } else {
            io.to(roomId).emit('user-count-update', {
                count: room.users.size
            });
        }
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
        const { roomId, message, userName } = data;
        
        if (!rooms.has(roomId)) return;
        
        const room = rooms.get(roomId);
        const chatMessage = {
            id: Date.now(),
            userId: socket.id,
            userName: userName || 'Anonymous',
            message: message,
            timestamp: new Date().toISOString()
        };
        
        room.messages.push(chatMessage);
        
        // Broadcast to all in room
        io.to(roomId).emit('chat-message', chatMessage);
    });

    // Handle microphone permission requests (simulated)
    socket.on('mic-permission-request', (data) => {
        const { roomId } = data;
        
        if (!rooms.has(roomId)) return;
        
        // In a real app, this would trigger actual browser permission requests
        // For now, we'll just notify the user they can speak
        socket.emit('mic-permission-granted', { 
            roomId, 
            message: 'Microphone access granted. You can now speak.' 
        });
        
        // Notify others that user is speaking
        socket.to(roomId).emit('user-speaking', {
            userId: socket.id,
            userName: data.userName || 'Anonymous'
        });
    });

    // Handle user speaking (audio data would go here in real implementation)
    socket.on('user-speaking', (data) => {
        const { roomId } = data;
        
        if (!rooms.has(roomId)) return;
        
        // Broadcast to others in room that this user is speaking
        socket.to(roomId).emit('user-speaking', {
            userId: socket.id,
            userName: data.userName || 'Anonymous',
            speaking: data.speaking || true
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove user from all rooms
        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                
                // Notify others in room
                socket.to(roomId).emit('user-left', {
                    userId: socket.id,
                    count: room.users.size
                });
                
                // If room is empty, remove it
                if (room.users.size === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('user-count-update', {
                        count: room.users.size
                    });
                }
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});