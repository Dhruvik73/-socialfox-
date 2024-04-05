const mongoose = require('mongoose')
const { Schema } = mongoose
const user = require('./user')

const comment = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    post: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    mentionedAllies:{
        type:Array
    },
    comment: {
        type: String
    },
    like: {
        type: Array
    },
    dislike: {
        type: Array
    },
    insertDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
module.exports = mongoose.model('comments', comment)