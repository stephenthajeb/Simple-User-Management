const User = require('../models/User')
const bcrypt = require('bcryptjs')
const config = require('config')
const ACCESS_TOKEN_SECRET = config.get('ACCESS_TOKEN')
const REFRESH_TOKEN_SECRET = config.get('REFRESH_TOKEN')
const { accessTokenExpiration } = require('../constant')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
    }

    // Create token & refreshToken
    let accessToken = await user.createToken({ isRefreshToken: false })
    let refreshToken = await user.createToken({ isRefreshToken: true })
    return res
      .status(201)
      .json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (err) {
    return res.status(500).send('Server Error')
  }
}

exports.generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res
        .status(403)
        .json({ errors: [{ msg: 'Access denied,token missing!' }] })
    } else {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
      const accessToken = jwt.sign(
        { user: { ...decoded.user } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: accessTokenExpiration,
        },
      )
      return res.status(200).json({ accessToken })
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Session timed out,please login again' }] })
    } else if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Invalid token,please login again!' }] })
    } else {
      return res.status(500).send('Server Error')
    }
  }
}
