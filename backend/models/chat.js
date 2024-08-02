const mongoose = require('mongoose')
const { Schema } = mongoose
const user = require('./user')

const chat = new Schema({
    fromUser: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    toUser: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    chats: {
        type: Array,
        required:true
    },
    chatStartDate:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model('chats', chat)