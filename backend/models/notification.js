const mongoose = require('mongoose')
const { Schema } = mongoose
const user = require('./user')

const notification = new Schema({
    fromUser: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    toUser: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    relationID: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    notification: {
        type: Object,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    notificationDate:{
        type:Date,
        default:Date.now()
    }
})
module.exports = mongoose.model('notifications', notification)