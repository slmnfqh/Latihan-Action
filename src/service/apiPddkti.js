const axios = require('axios')

const URL_BACKEND = 'https://api-frontend.kemdikbud.go.id/'

const GET = (path, data) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${URL_BACKEND}${path}`, data)
			.then((result) => resolve(result.data))
			.catch((err) => reject(err))
	})
}

const SEARCHUniversity = (data) => GET(`hit/${data}`)
const SEARCHProdi = (data) => GET(`hit/${data}`)
const GETDetailUniversity = (data) => GET(`v2/detail_pt/${data}`)
const GETDataUniversity = (data) => GET(`v2/detail_pt_jumlah/${data}`)
const GETProdiAtUniversity = (data) => GET(`v2/detail_pt_prodi/${data}`)
const GETDetailProdiByIdSms = (data) => GET(`detail_prodi/${data}`)

module.exports = {
	SEARCHUniversity,
	SEARCHProdi,
	GETDetailUniversity,
	GETDataUniversity,
	GETProdiAtUniversity,
	GETDetailProdiByIdSms,
}
