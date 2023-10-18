const { Sequelize } = require('sequelize')
const db = require('../config/database.js')

const { DataTypes } = Sequelize

const Questions = db.define(
	'questions',
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		id_user: {
			type: DataTypes.STRING,
		},
		question: {
			type: DataTypes.TEXT,
		},
	},
	{
		freezeTableName: true,
	}
)

module.exports = Questions
