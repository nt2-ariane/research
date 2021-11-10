const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Credit = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String },
        url: { type: String },
        isArtist: { type: Boolean, default: false },
        isPartner: { type: Boolean, default: false },
        role: { type: String }
    },
    {
      timestamps: true,
      collection : 'credits' },
)

module.exports = mongoose.model('credit', Credit)
