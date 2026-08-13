const express = require('express')
const mongoose = require('mongoose')
const Planet = require('../models/Planet')

const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const planets = await Planet.find()

    response.json(planets)
  } catch (error) {
    response.status(500).json({
      message: 'Could not load planets',
    })
  }
})

router.get('/:id', async (request, response) => {
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({
      message: 'Invalid planet id',
    })
  }

  try {
    const planet = await Planet.findById(request.params.id)

    if (!planet) {
      return response.status(404).json({
        message: 'Planet not found',
      })
    }

    response.json(planet)
  } catch (error) {
    response.status(500).json({
      message: 'Could not load planet',
    })
  }
})

module.exports = router
