const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Text = new Schema(
    {
        name: { type: String, required: true },
        text_fr: { type: String, required: true },
        text_en: { type: String, required: true },
    },
    { collection : 'texts' },
)

module.exports = mongoose.model('text', Text)
