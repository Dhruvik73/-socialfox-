const express=require('express')
const chats=require('../models/chat')
const { body, validationResult } = require('express-validator')
const router=express.Router()
const ObjectID=require("mongoose").Types.ObjectId
router.post('/getUserChats',async(req,res)=>{
  const userChats=await chats.aggregate([
    {$match:{$or:[{toUser:ObjectID(req.body.userId)},{fromUser:ObjectID(req.body.userId)}]}},
    {$lookup:{from:'users',foreignField:"_id",localField:"fromUser",as:"fromUser"}},
    {$lookup:{from:'users',foreignField:"_id",localField:"toUser",as:"toUser"}},
    {$project:{
        "fromUser.password":0,
        "fromUser.following":0,
        "fromUser.followers":0,
        "fromUser.email":0,
        "toUser.password":0,
        "toUser.following":0,
        "toUser.followers":0,
        "toUser.email":0
    }}
])
  res.status(200).json({userChats})
})
router.post('/addUserChats',[body('chat','This chat length is not valid').isLength({min:0})],async(req,res)=>{
  const error=validationResult(req)
  if(error.isEmpty()){
    try {
        const chat={
          chat:req.body.chat,
          from:req.body.fromUser,
          to:req.body.toUser,
          chatTime:Date.now()
        }
        const oldChats=(await chats.find({$or:[{$and:[{fromUser:req.body.fromUser},{toUser:req.body.toUser}]},{$and:[{fromUser:req.body.toUser},{toUser:req.body.fromUser}]}]}))
        if(oldChats.length==1){
          oldChats.at(0).chats.push(chat);
          await chats.updateOne({"_id":oldChats.at(0).id},{chats:oldChats.at(0).chats});
          res.status(200).json({status:1})
        }
        else{
          if(oldChats.length<1){
            const newChat=await chats.create({
              chats:[chat],
              fromUser:req.body.fromUser,
              toUser:req.body.toUser
            })
            await newChat.save();
            res.status(200).json({status:1})
          }
          else{
            res.status(500).json({"error":"internel server error"})
          }
        }
    } catch (e) {
        res.status(500).json({"error":"internel server error"})
    }
  }
  else{
    res.status(500).json({"error":"internel server error","msg":error.errors[0].msg})
  }
})
module.exports=router