# 🌌 NextPlanet – Backend API

Backend service for **NextPlanet**, a fictional interplanetary booking platform.  
This API handles authentication, user sessions, planet data, and booking persistence using **Node.js, Express, MongoDB, and JWT**.

The backend is designed as a REST API consumed by a Vite-based frontend.

---

## 🔧 Tech stack

- **Node.js** – Runtime environment  
- **Express.js** – REST API framework  
- **MongoDB Atlas** – Database  
- **Mongoose** – ODM for MongoDB  
- **JWT (JSON Web Tokens)** – Authentication  
- **bcrypt** – Password hashing  
- **dotenv** – Environment variables  
- **Render** – Backend hosting  

---

## 🚀 Up & running 🏃‍➡️

npm install
npm run dev

---

# 🚀 .env

PORT=3000

MONGODB_URI=mongodb+srv://user1:E91v9eRgrMLZyIzz@cluster0.enp6v.mongodb.net/nextplanet?retryWrites=true&w=majority

SOLAR_API_TOKEN=204a7a4b-3648-4b79-a736-68fe96cdd8ce

EXO_API_BASE=https://exoplanetarchive.ipac.caltech.edu/TAP/sync

JWT_SECRET=thisislong

---

# 🔐 Authentication

Authentication is handled using JWT stored client-side.

Available auth routes:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Protected routes require a valid Authorization: Bearer <token> header.

---

# 🪐 Core API routes
Planets

- GET /api/planets
- GET /api/planets/recommended
- GET /api/planets/:planetKey

Bookings (authenticated)
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/me

---

# 🗄️ Database structure (MongoDB)
User
```bash

{
  email: String,
  passwordHash: String
}
```

Booking
```bash
{
  userId: ObjectId,
  planetKey: String,
  planetName: String,
  travelDate: String,
  seatType: String,
  extras: [String],
  totalPriceEUR: Number,
  createdAt: Date
}
```

---

#  🗃️ Sources
Core documentation

Express.js documentation
https://expressjs.com
(used in routing and middleware setup – /routes/*, server.js)

MongoDB Atlas & Mongoose
https://mongoosejs.com
(used in /models/* and database connection logic)

JSON Web Tokens
https://jwt.io
(used for auth middleware and token handling)

bcrypt
https://www.npmjs.com/package/bcrypt
(used for password hashing in auth routes)


Tutorials / references

Web Dev Simplified – JWT Authentication
https://www.youtube.com/watch?v=mbsmsi7l3r4
(used as conceptual reference for JWT flow, not copied line-for-line)

MongoDB Atlas Setup Guide
https://www.mongodb.com/docs/atlas/getting-started/
(sed for database configuration)

# ✨ Author

Made by Yanis Li
Course: Web 2
Academic year: 2025–2026