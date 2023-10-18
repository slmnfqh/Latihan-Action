const express = require('express')
const router = express.Router()

const QuestionController = require('../controller/question.js')

router.post('/question', QuestionController.saveQuestion)
router.get('/answer/:id', QuestionController.getAnswer)
router.get('/question', QuestionController.getAllQuestions)
router.delete('/question/:id', QuestionController.deleteQuestion)

module.exports = router
