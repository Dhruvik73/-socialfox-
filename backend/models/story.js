const mongoose=require('mongoose')
const user = require('./user')
const {Schema}=mongoose

const storyschema=new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:user,
        required:true
    },
    mediaType:{
        type:String,
        required:true
    },
    story:{
        type:Array,
        required:true
    },
    time:{
        type:Date,
        default:Date.now,
        index:{expireAfterSeconds:86400}
    },
    views:[{
        type:mongoose.Types.ObjectId,
        ref:user,
    }]
})
module.exports=mongoose.model('story',storyschema)