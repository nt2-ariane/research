const express = require('express')

const FicheCtrl = require('../controllers/fiche-ctrl')

const router = express.Router()

router.post('/fiche', FicheCtrl.createFiche)
router.put('/fiche/:id', FicheCtrl.updateFiche)
router.delete('/fiche/:id', FicheCtrl.deleteFiche)
router.get('/fiche/:id', FicheCtrl.getFicheById)
router.get('/fiches', FicheCtrl.getFiches)
router.get('/fiches/keyword/:keyword', FicheCtrl.getFichesByKeywords)

module.exports = router