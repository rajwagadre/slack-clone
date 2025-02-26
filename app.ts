import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import routes from './app/routes';
import { errorHandler } from './app/middlewares/error';
import { initKafka } from './app/kafka/kafka';
import Logger from './app/utils/logger';

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api', routes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Parkhya Connect API!',
    version: '1.0.0',
    status: 'online'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  Logger.info(`Socket connected: ${socket.id}`);

  // Join user to their personal room for direct messages
  socket.on('join_user', (userId: string) => {
    socket.join(`user:${userId}`);
    Logger.info(`User ${userId} joined their personal room`);
  });

  // Join channel room
  socket.on('join_channel', (channelId: string) => {
    socket.join(`channel:${channelId}`);
    Logger.info(`Socket ${socket.id} joined channel ${channelId}`);
  });

  // Leave channel room
  socket.on('leave_channel', (channelId: string) => {
    socket.leave(`channel:${channelId}`);
    Logger.info(`Socket ${socket.id} left channel ${channelId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data: { channelId: string; userId: string; isTyping: boolean }) => {
    socket.to(`channel:${data.channelId}`).emit('user_typing', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    Logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    status: 404
  });
});

// Initialize Kafka with Socket.io instance
initKafka(io).catch((error) => {
  Logger.error('Failed to initialize Kafka', error);
});

export { app, server };