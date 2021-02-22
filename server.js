const express = require('express')
const connectDB = require('./config/db')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Body parser
app.use(express.json({ extended: false }))

// Define Routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/user', require('./routes/api/user'))

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  //Connect Database
  console.log('Server running')
  await connectDB()
})
