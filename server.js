require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDatabase = require('./config/database')
const planetRoutes = require('./routes/planetRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api/planets', planetRoutes)

app.get('/api', (request, response) => {
  response.json({ message: 'NextPlanet API is running' })
})

connectDatabase()

app.listen(port, () => {
  console.log(`NextPlanet API listening on http://localhost:${port}`)
})
