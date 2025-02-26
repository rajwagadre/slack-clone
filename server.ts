import { server } from './app';
import dotenv from 'dotenv';
import Logger from './app/utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  Logger.info(`🚀 Server running on port ${PORT}`);
  Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  Logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});