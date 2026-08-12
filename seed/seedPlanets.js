require('dotenv').config()

const mongoose = require('mongoose')
const connectDatabase = require('../config/database')
const Planet = require('../models/Planet')
const planetData = require('./planetData')

async function seedPlanets() {
  try {
    await connectDatabase()
    await Planet.deleteMany({})
    await Planet.insertMany(planetData)

    console.log(`${planetData.length} planets added to MongoDB`)
  } catch (error) {
    console.error('Seed error:', error.message)
  }

  await mongoose.connection.close()
}

seedPlanets()
