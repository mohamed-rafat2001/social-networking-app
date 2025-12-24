# EngiConnect Real-time Server

The real-time server for EngiConnect enables instant messaging and live notifications across the platform.

## 🚀 Key Features

- **Real-time Messaging**: Instant delivery of messages between users.
- **Online Status**: Tracking of active users.
- **Live Notifications**: Immediate updates for likes, comments, and new followers.
- **Room Management**: Socket rooms for private chats.

## 🛠️ Tech Stack

- **Node.js**
- **Socket.io**
- **Nodemon** (Development)

## ⚙️ Getting Started

### Installation
```bash
npm install
```

### Running the server
```bash
# Using nodemon
npm start 
# OR directly
node index.js
```

## 🌐 Configuration
The server defaults to port `4000` or the port specified in your environment variables. Ensure the `CORS` settings in `index.js` match your client's URL.
