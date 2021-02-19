const express = require('express')
const connectDB = require('./config/db')
const { connect } = require('mongoose')
const path = require('path')

const app = express()

//Connect Database
connectDB()

// Body parser
app.use(express.json({ extended: false }))

// Define Routes
app.use('/api/user', require('./routes/api/user'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Server running')
})
