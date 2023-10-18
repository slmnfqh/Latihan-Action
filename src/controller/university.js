const {
	SEARCHUniversity,
	SEARCHProdi,
	GETDataUniversity,
	GETDetailUniversity,
	GETProdiAtUniversity,
	GETDetailProdiByIdSms,
} = require('../service/apiPddkti')

const searchUniversity = async (req, res) => {
	const query = req.query.univ

	if (!query) {
		res.status(400).json({ message: 'University Undefined' })
	}
	try {
		const response = await SEARCHUniversity(query)

		const result = response.pt.map((index) => {
			const data = index.text.split(', ')

			const university = data[0].split(': ')
			const npsn = data[1].split(':       ')
			const singkatan = data[2].split(': ')
			const alamat = data[3].split(': ')
			const id = index['website-link'].substring(index['website-link'].lastIndexOf('/') + 1)

			return {
				id_sp: id,
				university: university[1],
				npsn: npsn[1],
				singkatan: singkatan[1],
				alamat: alamat[1],
			}
		})

		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const searchProdi = async (req, res) => {
	const query = req.query.prodi

	if (!query) {
		res.status(400).json({ error: 'Prodi Undefined' })
	}
	try {
		const response = await SEARCHProdi(query)
		const result = response.prodi.map((index) => {
			const data = index.text.split(', ')

			const prodi = data[0].split(': ')
			const jenjang = data[1].split(': ')
			const universitas = data[2].split(': ')
			const id = index['website-link'].substring(index['website-link'].lastIndexOf('/') + 1)
			return {
				id_sms: id,
				prodi: prodi[1],
				jenjang: jenjang[1],
				universitas: universitas[1],
			}
		})

		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}
const universityDetail = async (req, res) => {
	const id_sp = req.params.id_sp

	if (!id_sp) {
		res.status(400).json({ message: 'Id Sp Undefined' })
	}

	try {
		const response = await GETDataUniversity(id_sp)
		const response2 = await GETDetailUniversity(id_sp)
		const result = {
			id_sp: response2.id_sp,
			universitas: response2.nm_lembaga,
			tanggal_berdiri: response2.tgl_berdiri,
			jalan: response2.jln,
			wilayah: response2.nama_wil,
			telephone: response2.no_tel,
			fax: response2.no_fax,
			email: response2.email,
			website: response2.website,
			kode_pos: response2.kode_pos,
			rektor: response2.nama_rektor,
			npsn: response2.npsn,
			status: response2.stat_sp,
			jumlahFakultas: response.jumlalah_fakultas,
			jumlahProdi: response.jumlah_prodi,
			jumlahProdiAkreditasi: response.jumlah_prodi_akreditasi,
		}

		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const prodiAtUniversity = async (req, res) => {
	const id_sp = req.params.id_sp

	if (!id_sp) {
		res.status(400).json({ message: 'Id Sp Undefined' })
	}
	try {
		const response = await GETProdiAtUniversity(id_sp)

		const result = response.map((index) => {
			return {
				id_sms: index.id_sms,
				prodi: index.kode_prodi,
				kode_prodi: index.nm_lemb,
				status: index.stat_prodi,
				jenjang: index.jenjang,
				akreditas: index.akreditas,
			}
		})
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}
const prodiDetail = async (req, res) => {
	const id_sms = req.params.id_sms

	if (!id_sms) {
		res.status(400).json({ message: 'Id Sms Undefined' })
	}
	try {
		const response = await GETDetailProdiByIdSms(id_sms)
		const id_sp = response.detailumum.linkpt.split('/')[2]
		const data = response.detailumum
		const result = {
			npsn: data.npsn,
			status: data.stat_prodi,
			universitas: data.namapt,
			kode_prodi: data.kode_prodi,
			id_sp: id_sp,
			prodi: data.nm_lemb,
			jenjang: data.namajenjang,
			tanggal_berdiri: data.tgl_berdiri,
			sk_selenggara: data.sk_selenggara,
			jalan: data.jln,
			kode_pos: data.kode_pos,
			telephone: data.no_tel,
			fax: data.no_fax,
			email: data.email,
			website: data.website,
			deskripsi: data.deskripsi,
			visi: data.visi,
			misi: data.misi,
			kompetensi: data.kompetensi,
			capaian: data.capaian,
			akreditas: data.akreditas,
			id_sms: data.id_sms,
		}
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

module.exports = { searchUniversity, searchProdi, universityDetail, prodiAtUniversity, prodiDetail }
