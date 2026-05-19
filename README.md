# Eventify - Event Management System

Eventify is a full-stack MERN application for creating, managing, and booking events. It includes user authentication, admin event management, OTP-based booking verification, and email notifications.

## Features

- User registration and login with JWT authentication
- Account verification with email OTP
- Event creation, update, and deletion
- Event booking with booking OTP verification
- Booking confirmation email notifications
- Admin dashboard
- Protected API routes with middleware
- MongoDB database integration with Mongoose

## Tech Stack

**Frontend**

- React.js
- Axios
- React Router

**Backend**

- Node.js
- Express.js
- Nodemailer
- Brevo SMTP or Brevo Transactional Email API

**Database**

- MongoDB
- Mongoose

**Authentication**

- JWT
- bcryptjs

## Project Structure

```text
Eventify/
|-- Backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- middlewares/
|   |-- utils/
|   `-- server.js
|-- Frontend/
|   |-- src/
|   `-- public/
`-- README.md
```

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/saurabhparmarr/Eventify.git
cd Eventify
```

### 2. Install Dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Backend` folder.

Required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Email variables for OTP and booking confirmation:

```env
EMAIL_FROM=your_verified_brevo_sender_email
EMAIL_FROM_NAME=Eventify
```

Recommended for production on Render, use Brevo API:

```env
BREVO_API_KEY=your_brevo_api_key
```

SMTP fallback:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_key
```

`EMAIL_FROM` must be a verified sender email in Brevo.

### 4. Run Project

Backend:

```bash
cd Backend
npm start
```

Frontend:

```bash
cd Frontend
npm run dev
```

## Deployment Notes

- Add all required backend environment variables in Render.
- Redeploy the backend after changing environment variables.
- Add the frontend production URL to the backend CORS origin list in `Backend/server.js`.
- For Render deployments, Brevo API is recommended because SMTP ports can time out on some hosting plans.

## Author

Saurabh Singh  
B.Tech CSE, Invertis University
