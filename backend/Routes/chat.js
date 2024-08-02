const express=require('express')
const chats=require('../models/chat')
const router=express.Router()
const ObjectID=require("mongoose").Types.ObjectId
router.post('/getUserChats',async(req,res)=>{
  const userChats=await chats.aggregate([
    {$match:{$or:[{toUser:ObjectID(req.body.userId)},{fromUser:ObjectID(req.body.userId)}]}},
    {$lookup:{from:'users',foreignField:"_id",localField:req.body.userId,as:"logedUser"}},
    {$project:{
        "logedUser.password":0,
        "logedUser.following":0,
        "logedUser.followers":0,
        "logedUser.email":0
    }}
])
  res.status(200).json({userChats})
})
module.exports=router