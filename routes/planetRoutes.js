const express = require('express')
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

module.exports = router
