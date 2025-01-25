import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: Server;
let heartbeatIntervals: { [key: string]: NodeJS.Timeout } = {};

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true
    },
    path: '/socket.io',
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    allowEIO3: true
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    heartbeatIntervals[socket.id] = setInterval(() => {
      socket.emit('ping');
    }, 25000);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (heartbeatIntervals[socket.id]) {
        clearInterval(heartbeatIntervals[socket.id]);
        delete heartbeatIntervals[socket.id];
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
