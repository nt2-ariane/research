const Credit = require('../models/credit')

createCredit = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a credit',
        })
    }

    const credit = new Credit(body)

    if (!credit) {
        return res.status(401).json({ success: false, error: err })
    }

    credit
        .save()
        .then(() => {
            return res.status(202).json({
                success: true,
                id: credit._id,
                message: 'Credit created!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error: error,
                message: 'Credit not created :',
            })
        })
}

updateCredit = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Credit.findOne({ _id: req.params.id }, (err, credit) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Credit not found!',
            })
        }
        credit.firstname = body.firstname
        credit.lastname = body.lastname
        credit.isArtist = body.isArtist
        credit.isPartner = body.isPartner
        credit.url = body.url
        credit.role = body.role
        credit
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: credit._id,
                    message: 'Credit updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Credit not updated!',
                })
            })
    })
}

deleteCredit = async (req, res) => {
    await Credit.findOneAndDelete({ _id: req.params.id }, (err, credit) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!credit) {
            return res
                .status(404)
                .json({ success: false, error: `Credit not found` })
        }

        return res.status(200).json({ success: true, data: credit })
    }).catch(err => console.log(err))
}

getCreditById = async (req, res) => {
    await Credit.findOne({ _id: req.params.id }, (err, credit) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!credit) {
            return res
                .status(404)
                .json({ success: false, error: `Credit not found` })
        }
        return res.status(200).json({ success: true, data: credit })
    }).catch(err => console.log(err))
}
getCreditsByArrayId = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide ids',
        })
    }

    await Credit.find({ _id: { $in: req.body.ids } }, (err, credits) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!credits) {
            return res
                .status(404)
                .json({ success: false, error: `Credit not found` })
        }
        return res.status(200).json({ success: true, data: credits })
    }).catch(err => console.log(err))
}

getCredits = async (req, res) => {
    await Credit
        .find({})
        .sort({ title: 'asc' })
        .exec(
            (err, credits) => {
                if (err) {
                    return res.status(401).json({ success: false, error: err })
                }
                if (!credits.length) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Credit not found` })
                }
                return res.status(200).json({ success: true, data: credits })
            })
}
getArtists = async (req, res) => {
    try {
        await Credit
            .find({ isArtist: true })
            .exec(
                (err, credits) => {
                    if (err) {
                        return res.status(401).json({ success: false, error: err })
                    }
                    if (!credits.length) {
                        return res
                            .status(404)
                            .json({ success: false, error: `Credit not found` })
                    }
                    return res.status(200).json({ success: true, data: credits })
                })
    }
    catch (e) {
        console.log(e)
    }
}
getPartners = async (req, res) => {
    try {
        await Credit
            .find({ isPartner: true })
            .exec(
                (err, credits) => {
                    if (err) {
                        return res.status(401).json({ success: false, error: err })
                    }
                    if (!credits.length) {
                        return res
                            .status(404)
                            .json({ success: false, error: `Credit not found` })
                    }
                    return res.status(200).json({ success: true, data: credits })
                })
    }
    catch (e) {
        console.log(e)
    }
}
getMembers = async (req, res) => {
    try {
        await Credit
            .find({ isArtist: false, isPartner: false })
            .exec(
                (err, credits) => {
                    if (err) {
                        return res.status(401).json({ success: false, error: err })
                    }
                    if (!credits.length) {
                        return res
                            .status(404)
                            .json({ success: false, error: `Credit not found` })
                    }
                    return res.status(200).json({ success: true, data: credits })
                })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports = {
    createCredit,
    updateCredit,
    deleteCredit,
    getCredits,
    getCreditById,
    getMembers,
    getPartners,
    getArtists,
    getCreditsByArrayId
}