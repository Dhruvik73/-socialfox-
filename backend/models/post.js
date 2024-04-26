const mongoose=require('mongoose')
const user = require('./user')
const comment = require('./comment')
const {Schema}=mongoose

const postschema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:user
    },
    post:{
        type:Array,
        required:true
    },
    like:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    dislike:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    description:{
        type:String,
        default:''
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