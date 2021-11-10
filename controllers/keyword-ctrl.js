const Keyword = require('../models/keyword')

createKeyword = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a keyword',
        })
    }

    const keyword = new Keyword(body)

    if (!keyword) {
        return res.status(401).json({ success: false, error: err })
    }

    keyword
        .save()
        .then(() => {
            return res.status(401).json({
                success: true,
                id: keyword._id,
                message: 'Keyword created!',
            })
        })
        .catch(error => {
            return res.status(401).json({
                error: error,
                message: 'Keyword not created :',
            })
        })
}

updateKeyword = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    console.log(req.params.id)

    Keyword.findById(req.params.id, (err, keyword) => {
        if (err) {
            console.log(err)
            return res.status(404).json({
                err,
                message: 'Keyword not found!',
            })
        }
        keyword.title_fr = body.title_fr
        keyword.title_en = body.title_en

        keyword
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: keyword._id,
                    message: 'Keyword updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Keyword not updated!',
                })
            })
    })
}

deleteKeyword = async (req, res) => {
    await Keyword.findOneAndDelete({ _id: req.params.id }, (err, keyword) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!keyword) {
            return res
                .status(404)
                .json({ success: false, error: `Keyword not found` })
        }

        return res.status(200).json({ success: true, data: keyword })
    }).catch(err => console.log(err))
}

getKeywordById = async (req, res) => {
    await Keyword.findOne({ _id: req.params.id }, (err, keyword) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!keyword) {
            return res
                .status(404)
                .json({ success: false, error: `Keyword not found` })
        }
        return res.status(200).json({ success: true, data: keyword })
    }).catch(err => console.log(err))
}
getKeywordByTitle = async (req, res) => {

    let field = req.params.field
    if (field.includes('title_fr')) field = 'title_fr'
    if (field.includes('title_en')) field = 'title_en'
    
    await Keyword.findOne({ $or: [{ title_fr: req.params.title }, { title_en: req.params.title }] }, (err, keyword) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }
        if (!keyword) {
            return res
                .status(404)
                .json({ success: false, error: `Keyword not found` })
        }

        return res.status(200).json({ success: true, data: keyword })
    })
        .catch(err => console.log(err))
}

getKeywords = async (req, res) => {
    await Keyword.find({}, (err, keywords) => {
        if (err) {

            return res.status(401).json({ success: false, error: err })
        }
        if (!keywords.length) {
            return res
                .status(404)
                .json({ success: false, error: `Keyword not found` })
        }
        if (typeof req.params.withKey !== 'undefined') {
            keywords = keywords.reduce((a, x) => ({ ...a, [x._id]: x }), {})
        }

        return res.status(200).json({ success: true, data: keywords })
    })
        .catch(err => console.log(err))
}

module.exports = {
    createKeyword,
    updateKeyword,
    deleteKeyword,
    getKeywords,
    getKeywordById,
    getKeywordByTitle
}