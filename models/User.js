const mongoose = require('mongoose')
const { refreshTokenExpiration, accessTokenExpiration } = require('../constant')
const config = require('config')
const ACCESS_TOKEN = config.get('ACCESS_TOKEN')
const REFRESH_TOKEN = config.get('REFRESH_TOKEN')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

// Todo: username: unique true
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.methods = {
  createToken: async function ({ isRefreshToken }) {
    const tokenSecret = isRefreshToken ? REFRESH_TOKEN : ACCESS_TOKEN
    const expiredDuration = isRefreshToken
      ? refreshTokenExpiration
      : accessTokenExpiration
    try {
      let {
        _id: _id,
        username: username,
        email: email,
        isAdmin: isAdmin,
      } = this
      let token = jwt.sign(
        {
          user: {
            _id: _id,
            username: username,
            email: email,
            isAdmin: isAdmin,
          },
        },
        tokenSecret,
        {
          expiresIn: expiredDuration,
        },
      )
      return token
    } catch (err) {
      return res.status(500).send('Server Error')
    }
  },
}

// hashing password before storing it Schema level
UserSchema.pre('save', async function (next) {
  try {
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    return next()
  } catch (err) {
    return res.status(500).send('Server Error')
  }
})

module.exports = User = mongoose.model('User', UserSchema)
