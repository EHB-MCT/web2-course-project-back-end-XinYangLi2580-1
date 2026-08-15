const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  planetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Planet',
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  travellers: {
    type: Number,
    required: true,
  },
  travelClass: {
    type: String,
    required: true,
  },
  extras: {
    type: [String],
    default: [],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking
