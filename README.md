# EngiConnect - Social Networking for Engineers

EngiConnect is a comprehensive social networking platform designed specifically for engineering students and professionals. It facilitates collaboration, resource sharing, and real-time communication across various engineering disciplines.

## 🚀 Key Features

- **Personalized Feed**: Stay updated with posts and resources from your engineering community.
- **Real-time Chat**: Connect instantly with peers and project partners using socket-based messaging.
- **Major-specific Communities**: Dedicated spaces for Civil, Mechanical, Electrical, Computer Engineering, and more.
- **Resource Hub**: Integration with educational resources (YouTube) and file sharing capabilities.
- **Modern UI/UX**: Seamless dark/light mode switching and a fully responsive design for all devices.
- **Secure Authentication**: Robust user management with JWT and profile customization.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [TanStack Query](https://tanstack.com/query/latest).
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/).
- **Real-time**: [Socket.io](https://socket.io/) for instant updates and messaging.
- **Media**: [Cloudinary](https://cloudinary.com/) for optimized image and file storage.

## 📁 Project Structure

The repository is organized into two main directories:

| Directory                       | Description                                               |
| :------------------------------ | :-------------------------------------------------------- |
| [`client-vite/`](./client-vite) | The React frontend application powered by Vite.           |
| [`server/`](./server)           | The Express.js REST API and Socket.io server.             |

## ⚙️ Quick Start

To run the entire application locally, you will need to start two separate processes:

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- Cloudinary Account (for uploads)

### 2. Setup & Installation

#### Backend (API & Socket Server)

```bash
cd server
npm install
# Configure .env file (see server/README.md)
npm start
```

#### Frontend (Vite Client)

```bash
cd client-vite
npm install
npm run dev
```

## 🌐 Environment Configuration

Each directory requires its own `.env` configuration. Please refer to the individual README files in each folder for specific environment variable requirements:

- [Server Environment Variables](./server/README.md#🌐-environment-variables)
- [Client Environment Variables](./client-vite/README.md#🌐-configuration--environment)

---

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Mohamed Rafat** - _Initial Work & Development_

Developed for **EngiConnect** - Connecting Engineers of Tomorrow.
