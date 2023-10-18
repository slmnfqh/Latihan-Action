const express = require('express')
const router = express.Router()

const AuthController = require('../controller/auth.js')

router.get('/me', AuthController.getUser)

module.exports = router
