const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
  },
  travelDays: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

const Planet = mongoose.model('Planet', planetSchema)

module.exports = Planet
