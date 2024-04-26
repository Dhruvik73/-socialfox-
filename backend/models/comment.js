const mongoose = require('mongoose')
const { Schema } = mongoose
const user = require('./user')

const comment = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: user
    },
    post: {
        type: String,
        required:true
    },
    mentionedAllies:[{
        type: mongoose.Types.ObjectId,
        ref: 'user' // This references the User model, replace 'User' with your actual model name
      }],
    comment: {
        type: String,
        default:''
    },
    like: [{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    dislike: [{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    insertDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})
module.exports = mongoose.model('comments', comment)