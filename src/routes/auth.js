const express = require('express')
const router = express.Router()

const AuthController = require('../controller/auth.js')

router.post('/login', AuthController.login)

router.post('/register', AuthController.register)

router.get('/token', AuthController.getRefreshToken)

router.delete('/logout', AuthController.logout)

module.exports = router