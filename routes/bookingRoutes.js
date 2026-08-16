const express = require('express')
const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const Planet = require('../models/Planet')

const router = express.Router()

const allowedTravelClasses = ['Economy', 'Business', 'Luxury']
const allowedExtras = ['Extra luggage', 'Observation seat', 'Space meal']

function getBookingValidationMessage(bookingData) {
  const {
    departureDate,
    travellers,
    travelClass,
    extras,
    totalPrice,
  } = bookingData

  if (!departureDate) {
    return 'Departure date is required'
  }

  const departure = new Date(departureDate)

  if (Number.isNaN(departure.getTime())) {
    return 'Departure date is invalid'
  }

  const today = new Date()
  departure.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  if (departure <= today) {
    return 'Departure date must be in the future'
  }

  if (travellers === undefined || travellers === null) {
    return 'Travellers are required'
  }

  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 8) {
    return 'Travellers must be between 1 and 8'
  }

  if (!allowedTravelClasses.includes(travelClass)) {
    return 'Travel class must be Economy, Business or Luxury'
  }

  if (extras !== undefined) {
    if (!Array.isArray(extras)) {
      return 'Extras must be an array'
    }

    const hasInvalidExtra = extras.some(
      (extra) => !allowedExtras.includes(extra),
    )

    if (hasInvalidExtra) {
      return 'Extras contain an invalid option'
    }
  }

  if (
    typeof totalPrice !== 'number' ||
    !Number.isFinite(totalPrice) ||
    totalPrice <= 0
  ) {
    return 'Total price must be a positive number'
  }

  return null
}

router.post('/', async (request, response) => {
  if (!request.body.planetId) {
    return response.status(400).json({
      message: 'Planet id is required',
    })
  }

  if (!mongoose.Types.ObjectId.isValid(request.body.planetId)) {
    return response.status(400).json({
      message: 'Invalid planet id',
    })
  }

  const validationMessage = getBookingValidationMessage(request.body)

  if (validationMessage) {
    return response.status(400).json({
      message: validationMessage,
    })
  }

  try {
    const planet = await Planet.findById(request.body.planetId)

    if (!planet) {
      return response.status(404).json({
        message: 'Planet not found',
      })
    }

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

  const validationMessage = getBookingValidationMessage(request.body)

  if (validationMessage) {
    return response.status(400).json({
      message: validationMessage,
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
