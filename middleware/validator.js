const { check, validationResult } = require('express-validator')

exports.registerInputValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6 }),
]

exports.loginInputValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required to sign in').exists(),
]

exports.processValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return next()
}
