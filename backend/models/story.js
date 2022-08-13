const mongoose=require('mongoose')
const {Schema}=mongoose

const storyschema=new Schema({
    userid:{
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
    views:{
        type:Array
    }
})
module.exports=mongoose.model('story',storyschema)