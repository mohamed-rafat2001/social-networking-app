# EngiConnect Backend API

The backend for EngiConnect is a robust Express.js API that manages user data, posts, chats, and engineering resources.

## 🚀 Key Features

- **RESTful API**: Clean and structured endpoints for all platform features.
- **Authentication**: Secure user authentication and authorization using JWT.
- **File Management**: Image uploads handled via Multer and Cloudinary.
- **Data Modeling**: Comprehensive schemas for users, posts, comments, and messages using Mongoose.
- **Validation**: Strict input validation using `express-validator`.
- **Error Handling**: Centralized error management system.

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** (Media storage)
- **JWT** (Authentication)
- **Nodemailer** (Email notifications)

## 📁 Folder Structure

- `src/controller`: Logic for handling requests.
- `src/models`: Mongoose schemas and models.
- `src/routes`: API route definitions.
- `src/middelwares`: Authentication and error handling middlewares.
- `src/utils`: Helper functions (Cloudinary config, Email service, etc.).
- `src/validations`: Input validation schemas.

## ⚙️ Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

## 🌐 Environment Variables
Create a `.env` file in the root of the server folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
