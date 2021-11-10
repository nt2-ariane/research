const Fiche = require('../models/fiche')

createFiche = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a fiche',
        })
    }

    const fiche = new Fiche(body)

    if (!fiche) {
        return res.status(401).json({ success: false, error: err })
    }

    fiche
        .save()
        .then(() => {
            return res.status(401).json({
                success: true,
                id: fiche._id,
                message: 'Fiche created!',
            })
        })
        .catch(error => {
            return res.status(401).json({
                error: error,
                message: 'Fiche not created :',
            })
        })
}

updateFiche = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Fiche.findOne({ _id: req.params.id }, (err, fiche) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Fiche not found!',
            })
        }
        fiche.title_fr = body.title_fr
        fiche.title_en = body.title_en
        fiche.artist = body.artist
        fiche.url = body.url
        fiche.keywords = body.keywords
        fiche.body_en = body.body_en
        fiche.body_fr = body.body_fr
        fiche.year = body.year
        fiche
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: fiche._id,
                    message: 'Fiche updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Fiche not updated!',
                })
            })
    })
}

deleteFiche = async (req, res) => {
    await Fiche.findOneAndDelete({ _id: req.params.id }, (err, fiche) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!fiche) {
            return res
                .status(404)
                .json({ success: false, error: `Fiche not found` })
        }

        return res.status(200).json({ success: true, data: fiche })
    }).catch(err => console.log(err))
}

getFicheById = async (req, res) => {
    await Fiche.findOne({ _id: req.params.id }, (err, fiche) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!fiche) {
            return res
                .status(404)
                .json({ success: false, error: `Fiche not found` })
        }
        return res.status(200).json({ success: true, data: fiche })
    }).catch(err => console.log(err))
}

getFiches = async (req, res) => {
    await Fiche
        .find({})
        .exec(
            (err, fiches) => {
                if (err) {
                    return res.status(401).json({ success: false, error: err })
                }
                if (!fiches.length) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Fiche not found` })
                }
                return res.status(200).json({ success: true, data: fiches })
            })
}

getFichesByKeywords = async (req, res) => {
    await Fiche.find({ keywords: req.params.keyword },
        (err, fiches) => {

            if (err) {
                return res.status(401).json({ success: false, error: err })
            }
            if (!fiches.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Fiche not found` })
            }
            return res.status(200).json({ success: true, data: fiches })
        }).catch(err => console.log(err))
}
module.exports = {
    createFiche,
    updateFiche,
    deleteFiche,
    getFiches,
    getFicheById,
    getFichesByKeywords
}