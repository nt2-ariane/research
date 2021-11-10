const express = require('express')

const MediaCtrl = require('../controllers/media-ctrl')

const router = express.Router()

router.post('/media', MediaCtrl.createMedia)
router.patch('/media', MediaCtrl.updateMedia)
router.delete('/media/:id', MediaCtrl.deleteMedia)
router.get('/media/:id', MediaCtrl.getMedia)
router.get('/medias', MediaCtrl.getMedias)

module.exports = router