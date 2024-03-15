const mongoose=require('mongoose')
const {Schema}=mongoose
const usermodel=new Schema({
    id: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profilephoto: {
        type: String
    }
})

module.exports=usermodel