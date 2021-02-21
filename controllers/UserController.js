const User = require('../models/User')

exports.register = async (req, res) => {
  const { email } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }
    user = await new User(req.body).save()
    let accessToken = await user.createToken({ isRefreshToken: false })
    let refreshToken = await user.createToken({ isRefreshToken: true })
    return res.status(201).json({ accessToken, refreshToken })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Server Error')
  }
}

exports.index = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id).select('-password')
    const { name, username, email, isAdmin } = userData
    return res
      .status(200)
      .json({ name: name, username: username, email: email, isAdmin: isAdmin })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send('Server Error')
  }
}
