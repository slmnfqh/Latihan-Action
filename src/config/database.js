const { Sequelize } = require('sequelize')
require('dotenv').config()

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOSTNAME,
	dialect: 'mysql',
	logging: false,
})

module.exports = db
