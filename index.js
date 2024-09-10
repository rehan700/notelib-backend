require('dotenv').config()

const mongoConnection = require('./db')
mongoConnection()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
// Your routes and other logic here
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/test', require('./routes/test'))
app.listen(process.env.PORT, () => {
    console.log(`App running on http://localhost:${port}`)
});