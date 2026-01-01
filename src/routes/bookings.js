import express from 'express'
import Booking from '../models/booking.js'
import { requireAuth } from '../middleware/authtoken.js'

const router = express.Router()

// list my bookings
router.get('/', requireAuth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.userId }).sort({ createdAt: -1 })
  res.json(bookings)
})

// create booking
router.post('/', requireAuth, async (req, res) => {
  const { planetKey, planetName, travelDate, seatType, extras = [], totalPriceEUR } = req.body
  if (!planetKey || !planetName || !travelDate || !seatType || typeof totalPriceEUR !== 'number') {
    return res.status(400).json({ ok: false, message: 'Missing fields' })
  }

  const created = await Booking.create({
    userId: req.user.userId,
    planetKey,
    planetName,
    travelDate,
    seatType,
    extras,
    totalPriceEUR,
  })

  res.json({ ok: true, booking: created })
})

export default router
