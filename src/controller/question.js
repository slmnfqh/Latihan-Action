const Questions = require('../models/questions')
const { nanoid } = require('nanoid')
const Answer = require('../models/answer')
const axios = require('axios')
const { SEARCHProdi } = require('../service/apiPddkti')

const saveQuestion = async (req, res) => {
	const { question } = req.body
	const userId = req.userId

	if (!question) {
		return res.status(400).json({ message: 'Question undefined' })
	}

	try {
		const id = nanoid(20)
		await Questions.create({
			id: id,
			id_user: userId,
			question: question,
		})

		const getAnswer = await axios.post(
			'https://endpoint-ml-7qtkfzxmja-et.a.run.app/predict_text',
			{
				text: question,
			}
		)
		const recomendation = getAnswer.data.match(/[^,]+/g).map((item) => item.trim())

		await Promise.all(
			recomendation.map(async (item) => {
				let precentace = Math.floor(Math.random() * 11) + 80

				await Answer.create({
					id_question: id,
					answer: item,
					precentace: precentace,
				})

				precentace -= 10
			})
		)

		res.status(201).json({
			id_question: id,
			message: 'Question created successfully',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Terjadi kesalahan pada server',
		})
	}
}

const getAnswer = async (req, res) => {
	const id = req.params.id

	if (!id) {
		res.status(400).json({ message: 'Id Undefined' })
	}

	try {
		const allAnswer = await Answer.findAll({
			attributes: ['answer', 'precentace'],
			where: {
				id_question: id,
			},
			order: [['precentace', 'DESC']],
		})

		const result = allAnswer.map(async (index) => {
			const response = await SEARCHProdi(index.answer)
			return response.prodi.length
		})

		const university = await Promise.all(result)

		const data = allAnswer.map((item, index) => {
			return {
				prodi: item.answer,
				precentace: item.precentace,
				university: university[index],
			}
		})

		res.json({
			id_question: id,
			data: data,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Terjadi kesalahan pada server',
		})
	}
}

const deleteQuestion = async (req, res) => {
	const id = req.params.id

	try {
		await Questions.destroy({
			where: {
				id: id,
			},
		})
		await Answer.destroy({
			where: {
				id_question: id,
			},
		})

		res.json({
			message: 'Question has deleted',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Terjadi kesalahan pada server',
		})
	}
}
const getAllQuestions = async (req, res) => {
	const userId = req.userId

	try {
		const allQuestion = await Questions.findAll({
			attributes: ['question', 'createdAt'],
			where: {
				id_user: userId,
			},
			order: [['createdAt', 'DESC']],
		})

		res.json({
			id_question: id,
			data: allQuestion.data,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Terjadi kesalahan pada server',
		})
	}
}

module.exports = {
	saveQuestion,
	getAnswer,
	deleteQuestion,
	getAllQuestions,
}
