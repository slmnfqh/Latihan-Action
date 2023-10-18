const Users = require('../models/users')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { nanoid } = require('nanoid')

const getUser = async (req, res) => {
	const id = req.userId
	try {
		const users = await Users.findIOne({
			attributes: ['id', 'username', 'email'],
			where: {
				id: id,
			},
		})
		res.json(users)
	} catch (error) {
		console.log(error)
	}
}
const login = async (req, res) => {
	const { email, password } = req.body

	let errors = {}

	if (!validator.isEmail(email)) {
		errors.email = 'Email harus berformat email !'
	}

	if (password.length < 8) {
		errors.password = 'Password minimal 8 karakter !'
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json({
			message: 'Login failed !',
			errors,
		})
	}

	try {
		const user = await Users.findOne({
			where: {
				email: req.body.email,
			},
		})
		const match = await bcrypt.compare(req.body.password, user.password)
		if (!match)
			return res.status(400).json({
				message: 'Login failed !',
				errors: {
					password: 'Password salah !',
				},
			})

		const userId = user.id
		const username = user.username
		const email = user.email

		const accessToken = jwt.sign({ userId, username, email }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '20s',
		})
		const refreshToken = jwt.sign(
			{ userId, username, email },
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: '1d',
			}
		)

		await Users.update(
			{ refresh_token: refreshToken },
			{
				where: {
					id: userId,
				},
			}
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secure: true,
			sameSite: 'None',
		})

		res.json({
			message: 'Login sucessful !',
			accessToken,
		})
	} catch (error) {
		res.status(400).json({
			message: 'Login failed !',
			errors: {
				email: 'Email tidak ditemukan !',
			},
		})
		console.log(error)
	}
}

const register = async (req, res) => {
	const { username, email, password, confPassword } = req.body

	const errors = {}

	if (!validator.isAlpha(username)) {
		errors.username = 'Username hanya boleh mengandung alphabet !'
	}

	if (!validator.isEmail(email)) {
		errors.email = 'Email harus berformat email !'
	}

	if (password !== confPassword) {
		errors.confPassword = 'Confirm password tidak sama !'
	}

	if (password.length < 8) {
		errors.password = 'Password minimal 8 karakter !'
	}

	const checkEmail = await Users.findOne({
		where: {
			email: email,
		},
	})

	if (checkEmail) {
		errors.email = 'Email sudah terdaftar !'
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json({
			message: 'Register failed !',
			errors,
		})
	}

	const id = nanoid(16)
	const salt = await bcrypt.genSalt()
	const hashPassword = await bcrypt.hash(password, salt)

	try {
		await Users.create({
			id: id,
			username: username,
			email: email,
			password: hashPassword,
		})
		res.status(200).json({ message: 'Register sucessful !' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Terjadi kesalahan pada server !' })
	}
}

const getRefreshToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken
	try {
		if (!refreshToken) return res.sendStatus(401)
		const user = await Users.findOne({
			where: {
				refresh_token: refreshToken,
			},
		})
		if (!user) return res.sendStatus(403)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err) return res.sendStatus(403)
			const userId = user.id
			const username = user.username
			const email = user.email

			const accessToken = jwt.sign(
				{ userId, username, email },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '10s',
				}
			)
			res.json({ accessToken })
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Terjadi kesalahan pada server' })
	}
}
const logout = async (req, res) => {
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.sendStatus(204)
	const user = await Users.findOne({
		where: {
			refresh_token: refreshToken,
		},
	})
	if (!user) return res.sendStatus(204)
	const userId = user.id
	await Users.update(
		{ refresh_token: null },
		{
			where: {
				id: userId,
			},
		}
	)
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'None',
	})

	return res.sendStatus(200)
}

module.exports = {
	login,
	register,
	logout,
	getRefreshToken,
	getUser,
}
