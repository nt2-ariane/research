const express = require('express')

const CreditCtrl = require('../controllers/credit-ctrl')

const router = express.Router()

router.post('/credit', CreditCtrl.createCredit)
router.put('/credit/:id', CreditCtrl.updateCredit)
router.delete('/credit/:id', CreditCtrl.deleteCredit)
router.get('/credit/:id', CreditCtrl.getCreditById)
router.get('/credits', CreditCtrl.getCredits)
router.get('/credits/artists', CreditCtrl.getArtists)
router.get('/credits/members', CreditCtrl.getMembers)
router.get('/credits/partners', CreditCtrl.getPartners)
router.post('/credits', CreditCtrl.getCreditsByArrayId)

module.exports = router