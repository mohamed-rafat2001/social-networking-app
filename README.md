# EngiConnect - Social Networking for Engineers

EngiConnect is a comprehensive social networking platform designed specifically for engineering students. It facilitates collaboration, resource sharing, and real-time communication across various engineering disciplines.

## 🚀 Features

- **Personalized Feed**: Stay updated with posts and resources from your engineering community.
- **Real-time Chat**: Connect instantly with peers and project partners.
- **Major-specific Communities**: Dedicated spaces for Civil, Mechanical, Electrical, Computer Engineering, and more.
- **Resource Hub**: Upload and download study materials, lab reports, and lecture notes.
- **Dark & Light Mode**: Seamless theme switching for comfortable viewing day or night.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Secure Authentication**: Verified access for university students.

## 🛠️ Tech Stack

### Client
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & React Query
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form & Zod

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Storage**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)

### Real-time
- **Socket Server**: Socket.io for instant messaging and notifications.

## 📂 Project Structure

```
social-app/
├── client-vite/ # Frontend React application
├── server/     # Backend Express API
├── socket/     # Real-time communication server
```

## ⚙️ Installation & Setup

To get the project running locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/mohamed-rafat2001/social-networking-app.git
cd social-networking-app
```

### 2. Setup the Server
```bash
cd server
npm install
# Create a .env file based on the environment variables needed (see server/README.md)
npm start
```

### 3. Setup the Client
```bash
cd ../client
npm install
npm run dev
```

### 4. Setup the Socket Server
```bash
cd ../socket
npm install
nodemon index.js
```

## 📄 License
This project is licensed under the ISC License.

## 👥 Authors
- Mohamed Rafat - *Initial work*
