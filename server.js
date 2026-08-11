const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

app.get('/api', (request, response) => {
  response.json({ message: 'NextPlanet API is running' })
})

app.listen(port, () => {
  console.log(`NextPlanet API listening on http://localhost:${port}`)
})
