import express from 'express'
import Booking from '../models/booking.js'
import { requireAuth } from '../middleware/authtoken.js'

const router = express.Router()

// ✅ GET /api/bookings/me  (what your frontend expects)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json({ ok: true, bookings })
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Could not load bookings' })
  }
})

// ✅ Keep old behavior: GET /api/bookings
router.get('/', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    // keep old response shape (array) so nothing else breaks
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Could not load bookings' })
  }
})

// ✅ POST /api/bookings
router.post('/', requireAuth, async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Booking failed' })
  }
})

export default router
