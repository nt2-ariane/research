const express = require('express')

const KeywordCtrl = require('../controllers/keyword-ctrl')

const router = express.Router()

router.post('/keyword', KeywordCtrl.createKeyword)
router.patch('/keyword/:id', KeywordCtrl.updateKeyword)
router.delete('/keyword/:id', KeywordCtrl.deleteKeyword)

router.get('/keyword/:id', KeywordCtrl.getKeywordById)
router.get('/keyword/title/:title/field/:field', KeywordCtrl.getKeywordByTitle);

router.get('/keywords', KeywordCtrl.getKeywords)
router.get('/keywords/:withKey', KeywordCtrl.getKeywords)

module.exports = router