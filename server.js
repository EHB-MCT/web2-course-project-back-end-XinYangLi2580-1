require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDatabase = require('./config/database')
const planetRoutes = require('./routes/planetRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api/planets', planetRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api', (request, response) => {
  response.json({ message: 'NextPlanet API is running' })
})

app.get('/api/secret', (request, response) => {
  response.json({
    message: 'Houston, we have a website.',
  })
})

connectDatabase()

app.listen(port, () => {
  console.log(`NextPlanet API listening on http://localhost:${port}`)
})
