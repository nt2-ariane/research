const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Fiche = new Schema(
    {
        artist: { type: Array, required: true },
        url: { type: String, required: false },
        keywords: { type: Array, required: true },
        year: { type: String, required: true },

        body_fr: { type: String, required: true },
        body_en: { type: String, required: true },

        title_fr: { type: String, required: true },
        title_en: { type: String, required: true },
    },
    { 
      timestamps: true,
      collection : 'fiches' },
)

module.exports = mongoose.model('fiche', Fiche)
