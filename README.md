# 🎉 Eventify - Event Management System

Eventify is a full-stack MERN (MongoDB, Express, React, Node.js) web application for creating, managing, and booking events.

---

## 🚀 Features

- User Registration & Login (JWT Authentication)
- Create, Update & Delete Events
- Event Booking System
- Admin Dashboard
- Secure API with Middleware
- MongoDB Database Integration

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios
- React Router

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB (Mongoose)

**Authentication:**
- JWT (JSON Web Token)
- bcryptjs

---

## 📁 Project Structure


Eventify/
│
├── Backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ ├── server.js
│
├── Frontend/
│ ├── src/
│ └── public/
│
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/saurabhparmarr/Eventify.git
cd Eventify
2. Install Dependencies
Backend
cd Backend
npm install
Frontend
cd Frontend
npm install
3. Run Project
Backend
cd Backend
node server.js

OR

npm start
Frontend
cd Frontend
npm start
🔐 Environment Variables

Create .env file inside Backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
👨‍💻 Author

Saurabh Singh
B.Tech CSE, Invertis University
