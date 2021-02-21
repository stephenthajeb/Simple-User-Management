const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/AuthController')
const User = require('../../models/User')

const {
  loginInputValidation,
  processValidation,
} = require('../../middleware/validator')

// Login
router.post(
  '/login',
  [loginInputValidation, processValidation],
  AuthController.login,
)

// RefreshToken
router.post('/refresh_token', AuthController.generateRefreshToken)

module.exports = router
