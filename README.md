# 🌌 NextPlanet – Backend API

Backend service for NextPlanet, a fictional interplanetary booking platform.

This API stores planet data and bookings using Node.js, Express, MongoDB Atlas
and Mongoose.

The backend is designed as a REST API used by the Vite frontend. It does not
use authentication.

🔗 API: https://web2-course-project-back-end-n9yg.onrender.com/api

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- dotenv
- nodemon
- Render

---

## 🚀 Up & Running 🏃‍➡️

```bash
npm install
npm run dev
```

The API runs locally at:

```text
http://localhost:3000/api
```

---

## 🚀 .env

Create a `.env` file in the backend folder:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/nextplanet?retryWrites=true&w=majority
```

Replace the placeholders with your own MongoDB Atlas information.

Never upload `.env` or place real passwords inside the README.

---

## 🪐 Core API Routes

Planets:

- `GET /api/planets`
- `GET /api/planets/:id`

Bookings:

- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

Other:

- `GET /api`
- `GET /api/secret`

---

## 🌱 Planet Data

The project contains a curated dataset of 24 planets.

Add the planets to MongoDB with:

```bash
npm run seed
```

The seed script first deletes the current planets and then inserts the 24 new
planets.

---

## 🗄️ Database Structure

Planet:

```text
name, system, type, category, description, distance, temperature,
travelDays, price, image, featured
```

Booking:

```text
planetId, departureDate, travellers, travelClass, extras,
totalPrice, createdAt
```

---

## ✅ Booking Validation

- Departure date must be in the future
- Travellers must be between 1 and 8
- Travel class must be Economy, Business or Luxury
- Only the three available extras are accepted
- Total price must be positive

---

## 🗃️ Sources

Development sources:

- **Express — Routing**  
  https://expressjs.com/en/5x/guide/routing/  
  Used for the Planet and Booking API routes.

- **Mongoose — Models**  
  https://mongoosejs.com/docs/models.html  
  Used for creating and querying the Planet and Booking models.

- **Mongoose — Schemas**  
  https://mongoosejs.com/docs/guide.html  
  Used for defining the fields stored in MongoDB.

Complex database sources:

- **Mongoose — Populate**  
  https://mongoosejs.com/docs/populate.html  
  Used to include planet information when bookings are requested.

- **Mongoose — Queries**  
  https://mongoosejs.com/docs/queries.html  
  Used as a reference for `find()`, `findById()` and booking CRUD operations.

- **MongoDB Atlas — Connect an application**  
  https://www.mongodb.com/docs/atlas/connect-your-application/  
  Used for connecting Mongoose with `MONGODB_URI`.

- **MongoDB Atlas — IP access list**  
  https://www.mongodb.com/docs/atlas/security/ip-access-list/  
  Used to allow the hosted Render backend to reach MongoDB Atlas.

- **Render — Environment variables**  
  https://render.com/docs/configure-environment-variables  
  Used for storing the MongoDB connection string outside the code.

- **ChatGPT** 
  https://chatgpt.com/share/6a825cbb-8e48-83eb-97c8-4b7e694266db
  Used for help in menial tasks or difficulties in some parts.
  
---

# ✨ Author

Made by Yanis Li,
Course: Web 2,
Academic year: 2025–2026
