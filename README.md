# 📦 Subscription Tracker API

A robust and secure RESTful API built with **Node.js**, **Express.js**, and **MongoDB**, designed to help users track and manage their online subscriptions. It features **user authentication using JWT tokens**, full **CRUD operations** on subscriptions, and secure **sign-in / sign-up / sign-out flows**.

---

## 🚀 Features

- ✅ User Authentication (JWT-based access and refresh tokens)
- ✅ Sign Up / Sign In / Sign Out
- ✅ Refresh Token with secure cookie storage
- ✅ Subscription CRUD:
  - Create a subscription
  - Fetch all subscriptions or by ID
  - Update or cancel subscription
  - Get user-specific subscriptions
  - View upcoming renewals
- ✅ Secure password hashing using bcrypt
- ✅ RESTful design
- ✅ Mongoose schema validations
- ✅ Middleware-based error handling

---

## 🧰 Tech Stack

| Technology      | Description                          |
|-----------------|--------------------------------------|
| **Node.js**     | JavaScript runtime                   |
| **Express.js**  | Web framework                        |
| **MongoDB**     | NoSQL database                       |
| **Mongoose**    | ODM for MongoDB                      |
| **JWT**         | Token-based authentication           |
| **Bcrypt.js**   | Password hashing                     |
| **Nodemon**     | Development auto-restart             |
| **dotenv**      | Environment variable management      |

---

## 📁 Folder Structure

├── controllers/
│ ├── auth.controller.js
│ └── subscription.controller.js
├── middlewares/
│ └── auth.middleware.js
├── models/
│ ├── user.model.js
│ └── subscription.model.js
├── routes/
│ ├── auth.routes.js
│ └── subscription.routes.js
├── config/
│ └── env.js
├── app.js
└── server.js

---

## 🔐 Authentication Flow

1. **Sign Up** → Creates a new user with hashed password
2. **Sign In** → Returns access and refresh tokens
3. **Refresh Token** → Returns a new access token using secure cookie
4. **Sign Out** → Clears the refresh token cookie and invalidates token in DB

JWTs are securely handled using `httpOnly`, `sameSite`, and `secure` flags.

---

## 📦 API Endpoints

### 🔐 Auth

| Method | Route         | Description         |
|--------|---------------|---------------------|
| POST   | `/api/auth/signup`   | Register new user      |
| POST   | `/api/auth/signin`   | Login user             |
| POST   | `/api/auth/signout`  | Logout user            |

---

### 📋 Subscriptions

| Method | Route                          | Description                     |
|--------|--------------------------------|---------------------------------|
| GET    | `/api/subscriptions`          | Get all subscriptions           |
| GET    | `/api/subscriptions/:id`      | Get subscription by ID          |
| POST   | `/api/subscriptions/`         | Create a new subscription       |
| PUT    | `/api/subscriptions/:id`      | Update a subscription           |
| DELETE | `/api/subscriptions/:id`      | Delete a subscription           |
| PUT    | `/api/subscriptions/:id/cancel` | Cancel a subscription         |
| GET    | `/api/subscriptions/user/:id` | Get all subscriptions for user  |
| GET    | `/api/subscriptions/upcoming-renewals` | Get upcoming renewals  |

---

🙌 Acknowledgements
Express.js
MongoDB
Mongoose
JWT
Bcrypt.js

🧑‍💻 Author
Aswini Sandil Medisetti

Passionate about backend development, REST APIs, and building scalable services.
