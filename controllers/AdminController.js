const User = require('../models/User')

exports.showUser = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id).select('-password')
    if (!userData) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] })
    }
    return res.status(200).json(userData)
  } catch (err) {
    return res.status(500).send('Server Error')
  }
}

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
    const { username, email } = req.body
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] })
    } else {
      const isUsernameExist = await User.findOne({ username: username })
      if (user.isAdmin && user._id !== req.params.id) {
        return res.status(400).json({
          errors: [{ msg: 'You are not allowed to update other admin data' }],
        })
      }
      if (user.username !== username && isUsernameExist) {
        return res
          .status(409)
          .json({ errors: [{ msg: 'Update fail, username is taken' }] })
      }

      const isEmailExist = await User.findOne({ email: email })
      if (user.email !== email && isEmailExist) {
        return res.status(409).json({
          errors: [{ msg: 'Update fail, Email is used in another account' }],
        })
      }
      //Update data
      user = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true },
      )
      user.save()
      return res.status(200).json(user)
    }
  } catch (err) {
    console.error(err.message)
    return res.status(500).send('Server Error')
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send('Target Not Found')
    }
    if (user.isAdmin && user._id !== req.params.id) {
      return res.status(400).json({
        errors: [{ msg: 'You are not allowed to update other admin data' }],
      })
    }
    await user.remove()
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send('Server Error')
  }
}

exports.getAll = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (err) {
    console.error(err.message)
    return res.status(500).send('Server Error')
  }
}
