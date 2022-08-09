const mongoose=require('mongoose')
const {Schema}=mongoose

const postschema=new Schema({
    userid:{
        type:String,
        required:true
    },
    profile:{
        type:String
    },
    post:{
        type:String,
        required:true
    },
    comment:{
        type:Array
    },
    like:{
        type:Array
    },
    dislike:{
        type:Array
    },
    description:{
        type:String
    },
     username:{
        type:String
     }
})
module.exports=mongoose.model('post',postschema)