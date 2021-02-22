const express = require('express')
const {
  registerInputValidation,
  processValidation,
} = require('../../middleware/validator')
const { isAdmin, isAuth } = require('../../middleware/auth')
const UserController = require('../../controllers/UserController')
const AdminController = require('../../controllers/AdminController')

const router = express.Router()

// CREATE
router.post(
  '/register',
  [registerInputValidation, processValidation],
  UserController.register,
)

// READ Current User
router.get('/', [isAuth], UserController.index)

router.get('/getAll', [isAuth], AdminController.getAll)

// // READ User with ID
router.get('/:id', [isAuth, isAdmin], AdminController.showUser)

// // UPDATE
router.put(
  '/:id',
  [isAuth, isAdmin, registerInputValidation, processValidation],
  AdminController.updateUser,
)

// // Delete
router.delete('/:id', [isAuth, isAdmin], AdminController.deleteUser)

module.exports = router
