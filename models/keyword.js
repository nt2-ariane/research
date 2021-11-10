const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keywordSchema = new Schema(
    {
        title_fr: { type: String, required: true,unique:true },
        title_en: { type: String, required: true,unique:true },
    },
    {
      collection : 'keywords' },
)

module.exports = mongoose.model('keyword', keywordSchema)
