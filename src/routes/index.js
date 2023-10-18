const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const authRoutes = require('../routes/auth')
const usersRoutes = require('../routes/users')
const universityRoutes = require('../routes/university')
const recomendationRoutes = require('../routes/recomendation')

const app = express()

app.use('/auth', authRoutes)
app.use('/users', verifyToken, usersRoutes)
app.use('/recomendation', recomendationRoutes)
app.use('/university', universityRoutes)

module.exports = app
