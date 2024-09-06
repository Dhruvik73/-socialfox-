const express=require('express')
const chats=require('../models/chat')
const { body, validationResult } = require('express-validator')
const router=express.Router()
const ObjectID=require("mongoose").Types.ObjectId
router.post('/getUserChatsHistory',async(req,res)=>{
  const userChats=(await chats.aggregate([
    {$match:{$or:[{toUser:ObjectID(req.body.userId)},{fromUser:ObjectID(req.body.userId)}]}},
    {$lookup:{from:'users',foreignField:"_id",localField:"fromUser",as:"fromUser"}},
    {$lookup:{from:'users',foreignField:"_id",localField:"toUser",as:"toUser"}},
    {$sort:{chatUpdateDate:-1}},
    { $addFields: { lastChat: { $arrayElemAt: ["$chats", -1] } } },
    {$project:{
        "fromUser.password":0,
        "fromUser.following":0,
        "fromUser.followers":0,
        "fromUser.email":0,
        "toUser.password":0,
        "toUser.following":0,
        "toUser.followers":0,
        "toUser.email":0,
        "chats":0
    }}
]))
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
          await chats.updateOne({"_id":oldChats.at(0).id},{chats:oldChats.at(0).chats,chatUpdateDate:Date.now()});
          res.status(200).json({status:1})
        }
        else{
          if(oldChats.length<1){
            const newChat=await chats.create({
              chats:[chat],
              fromUser:req.body.fromUser,
              toUser:req.body.toUser,
              chatUpdateDate:Date.now(),
              chatStartDate:Date.now()
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
router.post('/getUserChats',async(req,res)=>{
  const userChats=await chats.aggregate([
    {$match:{$or:[{$and:[{toUser:ObjectID(req.body.toUser)},{fromUser:ObjectID(req.body.fromUser)}]},{$and:[{toUser:ObjectID(req.body.fromUser)},{fromUser:ObjectID(req.body.toUser)}]}]}},
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
module.exports=router