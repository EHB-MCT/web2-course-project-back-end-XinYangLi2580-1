require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api', (request, response) => {
  response.json({ message: 'NextPlanet API is running' })
})

app.listen(port, () => {
  console.log(`NextPlanet API listening on http://localhost:${port}`)
})
