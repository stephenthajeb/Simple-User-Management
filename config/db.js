const mongoose = require('mongoose')
const config = require('config')

// Connect to mongo docker
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    )
    console.log('Connected to DB')
  } catch (err) {
    console.error(err.message)
  }
}

// Connect to MongoCloud

// const db = config.get('MONGOURI')
// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//     })
//     console.log('Connected to DB')
//   } catch (err) {
//     console.error(err.message)
//   }
// }

module.exports = connectDB
