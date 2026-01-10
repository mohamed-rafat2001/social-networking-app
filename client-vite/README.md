# EngiConnect Frontend

The frontend of EngiConnect is a modern, responsive React application built with **Vite** and **Tailwind CSS**. It serves as a professional social networking platform for engineering students and professionals.

## 🚀 Key Features

- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations and transitions.
- **Theme Support**: Integrated dark and light mode system using Tailwind's class strategy.
- **Efficient Data Fetching**: Utilizes TanStack Query (React Query) for robust server-state management, caching, and background updates.
- **State Management**: Redux Toolkit handles complex global client-side state.
- **Real-time Updates**: Socket.io integration for instant messaging and live notifications.
- **Form Validation**: Type-safe forms implemented with React Hook Form and Zod schemas.
- **Responsive Design**: Mobile-first approach ensuring a seamless experience across all devices.

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## 📁 Project Structure

The project follows a feature-based architecture for better scalability and maintainability.

```text
src/
├── assets/          # Static assets like images, icons, and global styles
├── features/        # Feature-based modules (Encapsulated logic)
│   ├── auth/        # Authentication, login, signup, protected routes
│   ├── chat/        # Real-time messaging, chat list, message list
│   ├── landing/     # Public landing page components
│   ├── notifications/# User notifications and alerts
│   ├── posts/       # Feed, post creation, comments, likes
│   └── profile/     # User profile, bio, follows, image uploads
├── pages/           # Route-level components (Page views)
├── providers/       # Context providers (Theme, Socket, QueryClient)
├── routing/         # React Router configuration
├── shared/          # Reusable shared resources
│   ├── api/         # Axios instance and base API configuration
│   ├── components/  # Reusable UI and Layout components
│   ├── hooks/       # Global custom React hooks
│   └── utils/       # Helper functions and constants
├── store/           # Redux store and slices
└── styles/          # Global CSS and Tailwind directives
```

## ⚙️ Development Guide

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
```bash
# Navigate to client-vite directory
cd client-vite

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server (defaults to port 3000)
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Configuration & Environment

The application expects the following environment variables. Create a `.env` file in the `client-vite` root:

```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:5000
```

- **VITE_API_URL**: The base URL for the backend Express API.
- **VITE_SOCKET_URL**: The base URL for the Socket.io server.

## 📦 Key Dependencies

| Package | Purpose |
| :--- | :--- |
| `@tanstack/react-query` | Server state management and caching |
| `@reduxjs/toolkit` | Global client state management |
| `framer-motion` | Smooth UI animations |
| `react-hook-form` | Performance-focused form management |
| `zod` | TypeScript-first schema validation |
| `socket.io-client` | Real-time communication |
| `axios` | HTTP request handling |
| `react-hot-toast` | Beautiful notification popups |

---

Developed for **EngiConnect** - Connecting Engineers of Tomorrow.
