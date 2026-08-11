const mongoose = require('mongoose')

async function connectDatabase() {
  const databaseUrl = process.env.MONGODB_URI

  if (!databaseUrl || databaseUrl === 'test') {
    console.error('MongoDB connection error')
    return
  }

  try {
    await mongoose.connect(databaseUrl)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
  }
}

module.exports = connectDatabase
