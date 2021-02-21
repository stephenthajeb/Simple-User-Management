const mongoose = require('mongoose')
const config = require('config')
const db = config.get('MONGOURI')

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log('Connected to DB')
  } catch (err) {
    console.error(err.message)
  }
}

module.exports = connectDB
