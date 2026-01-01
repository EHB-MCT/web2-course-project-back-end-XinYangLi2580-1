import dotenv from "dotenv";
dotenv.config();

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import planetsRoutes from './routes/planets.js'

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing. Check your backend .env (same folder as server.js/package.json).");
}

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/planets', planetsRoutes)

const PORT = process.env.PORT || 3000
const MONGO = process.env.MONGODB_URI

if (!MONGO) {
  console.warn('⚠️ MONGODB_URI missing')
} else {
  mongoose
    .connect(MONGO)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB error:', err))
}

app.get('/health', (_, res) => {
  res.json({ ok: true, message: 'NextPlanet backend running' })
})

app.listen(PORT, () =>
  console.log(`🚀 API listening on http://localhost:${PORT}`)
)
