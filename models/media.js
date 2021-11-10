const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Media = new Schema(
    {
        title_fr: { type: String, required: true },
        title_en: { type: String, required: true },
        description_fr: { type: String },
        description_en: { type: String },
        file: { },
    },
    {
      collection : 'media' },
)

module.exports = mongoose.model('media', Media)
