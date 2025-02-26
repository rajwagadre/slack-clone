# ParkhyaConnect API

**Parkhya Connect** is a communication and project management platform for organizations. It enables direct messaging, group chats, project collaboration, and task management in one place.

## Features

- **User Authentication**: Register, login, and profile management
- **Workspaces**: Create and manage workspaces for teams
- **Channels**: Public and private channels within workspaces
- **Direct Messaging**: One-on-one communication between users
- **Real-time Communication**: Instant messaging using Kafka and Socket.io
- **Reactions**: Add emoji reactions to messages

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: Kafka, Socket.io
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Kafka

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/parkhyaconnect-api.git
   cd parkhyaconnect-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Update the `.env` file with your database and Kafka configuration.

4. Generate Prisma client:
   ```
   npx prisma generate
   ```

5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

6. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Workspaces

- `POST /api/workspaces` - Create a workspace
- `GET /api/workspaces` - Get all workspaces for current user
- `GET /api/workspaces/:id` - Get workspace by ID
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace
- `POST /api/workspaces/members` - Add member to workspace
- `DELETE /api/workspaces/:workspaceId/members/:userId` - Remove member from workspace

### Channels

- `POST /api/channels` - Create a channel
- `GET /api/channels/workspace/:workspaceId` - Get channels in workspace
- `GET /api/channels/:id` - Get channel by ID
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel
- `POST /api/channels/members` - Add member to channel
- `DELETE /api/channels/:channelId/members/:userId` - Remove member from channel

### Messages

- `POST /api/messages` - Send a message to a channel
- `GET /api/messages/channel/:channelId` - Get messages in a channel
- `POST /api/messages/direct` - Send a direct message
- `GET /api/messages/direct/:userId` - Get direct messages with a user
- `POST /api/messages/reaction` - Add a reaction to a message
- `DELETE /api/messages/reaction/:messageId/:emoji` - Remove a reaction

## Socket.io Events

### Client to Server

- `join_user` - Join user's personal room
- `join_channel` - Join a channel room
- `leave_channel` - Leave a channel room
- `typing` - Indicate user is typing

### Server to Client

- `new_message` - New message in a channel
- `new_direct_message` - New direct message
- `user_typing` - User is typing indicator

## Project Structure

```
/parkhyaconnect-api
│── /app                 # Main application directory
│   │── /config          # Configuration files
│   │── /controllers     # Business logic handlers
│   │── /middlewares     # Custom middleware
│   │── /models          # Database models
│   │── /routes          # API route definitions
│   │── /services        # Service layer
│   │── /utils           # Utility functions
│   │── /validators      # Input validation
│   │── /kafka           # Kafka setup
│   │── app.ts           # Express app setup
│   │── server.ts        # Server entry point
│── /prisma              # Prisma-related files
│   ├── schema.prisma    # Prisma schema
│── /tests               # Unit and integration tests
│── tsconfig.json        # TypeScript configuration
│── .env                 # Environment variables
│── package.json         # Node.js dependencies
```

## License

This project is licensed under the MIT License.