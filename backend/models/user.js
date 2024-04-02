const mongoose=require('mongoose')
const {Schema}=mongoose
const usermodel=new Schema({
    email:{
    type:String,
    required:true,
    unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    profilephoto:{
        type:String
    },
    followers:{
        type:Array
    },
    following:{
        type:Array
    }
})

module.exports=mongoose.model('user',usermodel)