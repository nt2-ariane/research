const Media = require('../models/media')

createMedia = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a media',
        })
    }
    const media = new Media(body)

    if (!media) {
        return res.status(401).json({ success: false, error: err })
    }

    media
        .save()
        .then(() => {
            return res.status(202).json({
                success: true,
                id: media._id,
                message: 'Media created!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error: error,
                message: 'Media not created :',
            })
        })
}

updateMedia = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(401).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Media.findOne({ _id: req.body._id }, (err, media) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Media not found!',
            })
        }
        media.description_fr = body.description_fr
        media.description_en = body.description_en
        media.title_fr = body.title_fr
        media.title_en = body.title_en
        media.file = body.file
        media
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: media._id,
                    message: 'Media updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Media not updated!',
                })
            })
    })
}

deleteMedia = async (req, res) => {
    await Media.findOneAndDelete({ _id: req.params.id }, (err, media) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!media) {
            return res
                .status(404)
                .json({ success: false, error: `Media not found` })
        }

        return res.status(200).json({ success: true, data: media })
    }).catch(err => console.log(err))
}

getMedia = async (req, res) => {
    await Media.findOne({ _id: req.params.id }, (err, media) => {
        if (err) {
            return res.status(401).json({ success: false, error: err })
        }

        if (!media) {
            return res
                .status(404)
                .json({ success: false, error: `Media not found` })
        }
        return res.status(200).json({ success: true, data: media })
    }).catch(err => console.log(err))
}

getMedias = async (req, res) => {
    await Media
        .find({})
        .sort({ title: 'asc' })
        .exec(
            (err, medias) => {
                if (err) {
                    return res.status(401).json({ success: false, error: err })
                }
                if (!medias.length) {
                    return res
                        .status(404)
                        .json({ success: false, error: `Media not found` })
                }
                return res.status(200).json({ success: true, data: medias })
            })
}



module.exports = {
    createMedia,
    updateMedia,
    deleteMedia,
    getMedias,
    getMedia,
}