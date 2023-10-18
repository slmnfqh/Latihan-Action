const express = require('express')
const router = express.Router()

const UnivController = require('../controller/university.js')

router.get('/search/prodi', UnivController.searchProdi)
router.get('/search/university', UnivController.searchUniversity)
router.get('/get/:id_sp', UnivController.universityDetail)
router.get('/get/prodi/:id_sp', UnivController.prodiAtUniversity)
router.get('/get/prodi/detail/:id_sms', UnivController.prodiDetail)

module.exports = router
