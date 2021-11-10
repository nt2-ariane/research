const express = require('express')

const TextCtrl = require('../controllers/text-ctrl')

const router = express.Router()

router.patch('/texts', TextCtrl.updateText)
router.get('/textbyid/:id', TextCtrl.getTextById)
router.get('/text/:name', TextCtrl.getText)
router.get('/texts', TextCtrl.getAllTexts)
router.post('/texts', TextCtrl.createText)

module.exports = router