# EngiConnect Frontend

The frontend of EngiConnect is a modern, responsive React application built with Vite and Tailwind CSS.

## 🚀 Key Features

- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations.
- **Theme Support**: Full dark and light mode integration.
- **Efficient Data Fetching**: Powered by TanStack Query (React Query) for caching and synchronization.
- **State Management**: Redux Toolkit for complex global state.
- **Real-time Updates**: Integrated with Socket.io client for live messaging.
- **Form Validation**: Type-safe forms using Zod and React Hook Form.

## 🛠️ Tech Stack

- **React 18**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Redux Toolkit** (Global State)
- **React Query** (Server State)
- **React Router** (Navigation)
- **Axios** (API Requests)

## 📁 Folder Structure

- `src/api`: API configuration and Axios instances.
- `src/features`: Feature-based modules (Auth, Chat, Posts, Profile, etc.).
- `src/hooks`: Custom React hooks.
- `src/layouts`: Layout components (Sidebar, Header, MainLayout).
- `src/providers`: Context providers (Theme, Socket).
- `src/ui`: Reusable UI components.
- `src/store`: Redux store configuration.

## ⚙️ Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🌐 Environment Variables
Create a `.env` file in the root of the client folder:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:4000
```
