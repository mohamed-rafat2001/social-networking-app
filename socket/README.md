# EngiConnect Real-time Socket Server

The real-time server for EngiConnect enables instant messaging, live notifications, and online status tracking across the platform using **Socket.io**.

## 🚀 Key Features

- **Real-time Messaging**: Low-latency message delivery between users.
- **Online Presence**: Real-time tracking of active users and their online status.
- **Instant Notifications**: Live alerts for social interactions (likes, comments, follows).
- **Socket-based Architecture**: Efficient event-driven communication.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Library**: [Socket.io 4.x](https://socket.io/)
- **Dev Tool**: [Nodemon](https://nodemon.io/)

## 📡 Socket Events

The following events are used for communication between the client and server:

### Client to Server (Emit)

| Event              | Payload                         | Description                                          |
| :----------------- | :------------------------------ | :--------------------------------------------------- |
| `addUser`          | `userId`                        | Registers a user as online and maps their socket ID. |
| `sendMessage`      | `{ newMessage, userId }`        | Sends a message to a specific user.                  |
| `sendNotification` | `{ recipientId, notification }` | Sends a social notification (like, comment, etc.).   |
| `disconnect`       | -                               | Automatically triggered when a user closes the app.  |

### Server to Client (Listen)

| Event             | Payload              | Description                                    |
| :---------------- | :------------------- | :--------------------------------------------- |
| `getUsersOnLine`  | `onLineUsers[]`      | Receives a list of all currently active users. |
| `getMessage`      | `newMessage`         | Receives a new private message.                |
| `notification`    | `notificationObject` | Receives a chat-related notification.          |
| `getNotification` | `notificationObject` | Receives a social interaction notification.    |

## ⚙️ Development Guide

### Installation

```bash
cd socket
npm install
```

### Running Locally

```bash
# Start with nodemon (development)
npm start
```

The server runs on port **5000** by default.

## 🌐 Configuration

### CORS Settings

Ensure the CORS origin in `index.js` matches your client's development URL:

```javascript
const io = new Server({
	cors: "http://localhost:3000", // Update this if your client port changes
});
```

---

Developed for **EngiConnect** - Connecting Engineers of Tomorrow.
