const express = require('express')
const mongoose = require('mongoose')
const Booking = require('../models/Booking')

const router = express.Router()

router.post('/', async (request, response) => {
  try {
    const booking = await Booking.create(request.body)

    response.status(201).json(booking)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return response.status(400).json({
        message: 'Invalid booking data',
      })
    }

    response.status(500).json({
      message: 'Could not create booking',
    })
  }
})

router.get('/', async (request, response) => {
  try {
    const bookings = await Booking.find().populate('planetId')

    response.json(bookings)
  } catch (error) {
    response.status(500).json({
      message: 'Could not load bookings',
    })
  }
})

router.get('/:id', async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({
      message: 'Invalid booking id',
    })
  }

  try {
    const booking = await Booking.findById(request.params.id).populate('planetId')

    if (!booking) {
      return response.status(404).json({
        message: 'Booking not found',
      })
    }

    response.json(booking)
  } catch (error) {
    response.status(500).json({
      message: 'Could not load booking',
    })
  }
})

router.put('/:id', async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({
      message: 'Invalid booking id',
    })
  }

  try {
    const booking = await Booking.findById(request.params.id)

    if (!booking) {
      return response.status(404).json({
        message: 'Booking not found',
      })
    }

    booking.departureDate = request.body.departureDate
    booking.travellers = request.body.travellers
    booking.travelClass = request.body.travelClass
    booking.extras = request.body.extras
    booking.totalPrice = request.body.totalPrice

    await booking.save()
    await booking.populate('planetId')

    response.json(booking)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return response.status(400).json({
        message: 'Invalid booking data',
      })
    }
    response.status(500).json({
      message: 'Could not update booking',
    })
  }
})

router.delete('/:id', async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({
      message: 'Invalid booking id',
    })
  }

  try {
    const booking = await Booking.findByIdAndDelete(request.params.id)
    if (!booking) {
      return response.status(404).json({
        message: 'Booking not found',
      })
    }
    response.json({
      message: 'Booking deleted',
    })
  } catch (error) {
    response.status(500).json({
      message: 'Could not delete booking',
    })
  }
})

module.exports = router
