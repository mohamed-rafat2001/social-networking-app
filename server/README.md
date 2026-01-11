# EngiConnect Backend API

The backend for EngiConnect is a robust Node.js/Express.js API that manages user data, social interactions, real-time communication, and engineering resources.

## 🚀 Key Features

- **RESTful API**: Clean and structured endpoints for all platform features.
- **Authentication**: Secure user authentication and authorization using JWT (JSON Web Tokens).
- **File Management**: Image and file uploads handled via Multer and Cloudinary.
- **Real-time Communication**: Integrated with Socket.io for instant messaging and notifications.
- **Data Modeling**: Comprehensive schemas for users, posts, comments, chats, and messages using Mongoose.
- **Validation**: Strict input validation using `express-validator`.
- **Error Handling**: Centralized error management system with custom error classes.
- **Email Service**: Automated emails for password resets and notifications using Nodemailer.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: [JWT](https://jwt.io/) & [BcryptJS](https://github.com/dcodeIO/bcrypt.js)
- **Real-time**: [Socket.io](https://socket.io/)
- **Validation**: [Express Validator](https://express-validator.github.io/docs/)
- **Email**: [Nodemailer](https://nodemailer.com/)

## 📁 Project Structure

The server follows a feature-based architecture for modularity and scalability.

```text
server/
├── src/
│   ├── features/       # Feature-based modules
│   │   ├── auth/       # User authentication, profiles, and management
│   │   ├── posts/      # Posts, comments, replies, and shares
│   │   ├── chat/       # Chat rooms and real-time messages
│   │   ├── follow/     # User follow/unfollow system
│   │   ├── block/      # User blocking system
│   │   ├── admin/      # Administrative controls and user management
│   │   ├── notifications/ # User activity notifications
│   │   └── youtube/    # Engineering resource integration (YouTube)
│   ├── shared/         # Shared resources across features
│   │   ├── db/         # Database connection configuration
│   │   ├── middlewares/# Auth, error handling, and validation middlewares
│   │   ├── utils/      # API features, Cloudinary, Multer, Email, etc.
│   │   └── validations/# Global validation schemas
├── app.js              # Express application configuration
├── server.js           # Server entry point and Socket.io initialization
└── vercel.json         # Deployment configuration
```

## 🔌 API Endpoints

### 🔐 Authentication & User (`/user`)

| Method | Endpoint          | Description                     | Auth    |
| :----- | :---------------- | :------------------------------ | :------ |
| POST   | `/signup`         | Create a new user account       | Public  |
| POST   | `/login`          | Authenticate user and get token | Public  |
| GET    | `/logout`         | Clear authentication cookies    | Public  |
| POST   | `/forgotPassword` | Send password reset email       | Public  |
| PATCH  | `/resetPassword`  | Reset password using token      | Public  |
| GET    | `/profile`        | Get current user profile        | Private |
| PATCH  | `/profile`        | Update user profile data        | Private |
| POST   | `/profileImg`     | Upload/Update profile image     | Private |
| GET    | `/search`         | Search for users                | Private |
| GET    | `/:userId`        | Get specific user by ID         | Private |

### 📝 Posts (`/posts`)

| Method | Endpoint      | Description                    | Auth    |
| :----- | :------------ | :----------------------------- | :------ |
| GET    | `/`           | Get all posts (Feed)           | Private |
| POST   | `/`           | Create a new post (with files) | Private |
| GET    | `/user`       | Get posts for a specific user  | Private |
| GET    | `/:id`        | Get single post details        | Private |
| PATCH  | `/:id`        | Update a post                  | Private |
| DELETE | `/:id`        | Delete a post                  | Private |
| POST   | `/:id/like`   | Like a post                    | Private |
| POST   | `/:id/unlike` | Unlike a post                  | Private |

### 💬 Chat & Messages (`/chats`, `/messages`)

| Method | Endpoint        | Description                      | Auth    |
| :----- | :-------------- | :------------------------------- | :------ |
| POST   | `/chats`        | Create a new chat room           | Private |
| GET    | `/chats`        | Get all chats for current user   | Private |
| GET    | `/messages/:id` | Get messages for a specific chat | Private |
| POST   | `/messages/:id` | Send a message (with files)      | Private |

### 👥 Social (`/follows`, `/blocks`)

| Method | Endpoint                      | Description        | Auth    |
| :----- | :---------------------------- | :----------------- | :------ |
| POST   | `/follows/follow/:userId`     | Follow a user      | Private |
| POST   | `/follows/unfollow/:userId`   | Unfollow a user    | Private |
| GET    | `/follows/followers/:userId?` | Get user followers | Private |
| GET    | `/blocks/block/:userId`       | Block a user       | Private |

### 🔔 Notifications (`/notifications`)

| Method | Endpoint         | Description            | Auth    |
| :----- | :--------------- | :--------------------- | :------ |
| GET    | `/`              | Get user notifications | Private |
| PATCH  | `/mark-all-read` | Mark all as read       | Private |
| PATCH  | `/:id/read`      | Mark single as read    | Private |

## ⚙️ Development Guide

### Prerequisites

- Node.js (Latest LTS)
- MongoDB (Local or Atlas)
- Cloudinary Account (for media)

### Installation

```bash
cd server
npm install
```

### Running Locally

```bash
# Start with nodemon (development)
npm start
```

### Environment Variables

Create a `.env` file in the `server` root:

```env
PORT=4000
NODE_ENV=development
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=90d
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

---

Developed for **EngiConnect** - Connecting Engineers of Tomorrow.
