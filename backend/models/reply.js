const mongoose=require('mongoose')
const schema= mongoose.Schema
const user=require('./user')
const comment=require('./comment')

const reply=new schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:user
    },
    comment:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:comment
    }
    ,userReply:{
        type:String,
        required:true
    },
    mentionedAllies:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }],
    repliedAt:{
        type:Date,
        default:Date.now()
    },
    like:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }]
})

module.exports=mongoose.model('Replies',reply);