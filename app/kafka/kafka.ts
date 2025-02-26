import { Kafka } from 'kafkajs';
import { Server } from 'socket.io';
import Logger from '../utils/logger';

const kafka = new Kafka({
  clientId: 'parkhyaconnect',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'parkhyaconnect-group' });

export const initKafka = async (io: Server) => {
  try {
    await producer.connect();
    await consumer.connect();

    // Subscribe to topics
    await consumer.subscribe({ topics: ['messages', 'direct-messages'], fromBeginning: false });

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value?.toString() || '{}');
          Logger.info(`Received message from Kafka: ${topic}`);

          if (topic === 'messages') {
            // Emit to all clients in the channel
            io.to(`channel:${payload.payload.channelId}`).emit('new_message', payload);
          } else if (topic === 'direct-messages') {
            // Emit to both sender and receiver
            io.to(`user:${payload.payload.senderId}`).emit('new_direct_message', payload);
            io.to(`user:${payload.payload.receiverId}`).emit('new_direct_message', payload);
          }
        } catch (error) {
          Logger.error('Error processing Kafka message', error);
        }
      },
    });

    Logger.info('Kafka producer and consumer initialized successfully');
  } catch (error) {
    Logger.error('Failed to initialize Kafka', error);
    throw error;
  }
};