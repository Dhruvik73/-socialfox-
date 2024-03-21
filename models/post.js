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
        type:Array,
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
     },
     bgColor:{
        type:Array,
        required:true
     },
     insertDate:{
        type:Date,
        required:true,
        default:Date.now()
     },
     userPostCount:{
        type:Number,
        required:true
     }
})
module.exports=mongoose.model('post',postschema)