const Text = require('../models/text')

getText = async (req, res) => {
    console.log(req.params.name)
    await Text.findOne({ name: req.params.name }, (err, text) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }
        if (!text) {
            return res
                .status(404)
                .json({ success: false, error: `Text not found` })
        }

        return res.status(200).json({ success: true, data: text })
    })
        .catch(err => console.log(err))
}

getTextById = async (req, res) => {
    await Text.findOne({ _id: req.params.id }, (err, text) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!text) {
            return res
                .status(404)
                .json({ success: false, error: `Text not found` })
        }
        return res.status(200).json({ success: true, data: text })
    }).catch(err => console.log(err))
}
getAllTexts = async (req, res) => {
    await Text.find({}, (err, rows) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }
        if (!rows) {
            return res
                .status(404)
                .json({ success: false, error: `Text not found` })
        }

        return res.status(200).json({ success: true, data: rows })
    })
        .catch(err => console.log(err))
}
updateText = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    await Text.findOne({ _id: body.id }, (err, text) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }
        if (!text) {
            return res
                .status(404)
                .json({ success: false, error: `Text not found` })
        }
        console.log(text)
        text.text_fr = body.text_fr
        text.text_en = body.text_en
        text
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    content: text,
                    message: 'Text updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    content: text,
                    message: 'Text not updated!',
                })
            })
    })
        .catch(err => console.log(err))
}
createText = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a text',
        })
    }

    const text = new Text(body)

    if (!text) {
        return res.status(401).json({ success: false, error: err })
    }

    text
        .save()
        .then(() => {
            return res.status(202).json({
                success: true,
                message: 'Text created!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error: error,
                message: 'Text not created :',
            })
        })
}
module.exports = {
    getText,
    getTextById,
    getAllTexts,
    updateText,
    createText
}