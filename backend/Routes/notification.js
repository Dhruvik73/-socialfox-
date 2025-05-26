const express=require('express')
const notification=require('../models/notification')
const { body, validationResult } = require('express-validator')
const router=express.Router()
const ObjectID=require("mongoose").Types.ObjectId
router.post('/addNotifications',async(req,res)=>{
    try {
            const newNotification=await notification.create({
              notification:req.body.notification,
              fromUser:req.body.fromUser,
              toUser:req.body.toUser,
              notificationDate:Date.now(),
              relationID:req.body.relationID
            })
            await newNotification.save();
            res.status(200).json({status:1})
    } catch (e) {
        res.status(500).json({"error":"internel server error"})
    }
})
router.post('/updateNotifications',async(req,res)=>{
  if(req.body.All){
    await notification.updateMany({$and:[{fromUser:req.body.fromUser},{toUser:req.body.toUser},{isRead:false}]},{isRead:true});
    res.status(200).json({status:1})
  }
  else{
          const notificationId=(await notification.find({fromUser:req.body.fromUser,toUser:req.body.toUser,isRead:false}).sort({notificationDate:-1}).limit(1)).at(0)?.id;
          await notification.updateOne({_id:notificationId},{isRead:true});
          res.status(200).json({status:1})
  }
})
router.post('/getNotifications',async(req,res)=>{
  const notifications=await notification.aggregate([{$match:{$and:[{toUser:ObjectID(req.body.logedUser)},{isRead:false},{fromUser:{$ne:ObjectID(req.body.fromUser)}}]}},
    {$lookup:{from:'users',localField:"fromUser","foreignField":"_id",as:"user"}},
    {
      $project: {
        "user.email": 0,
        "user.password": 0,
        "user.following": 0,
        "user.followers": 0,
      },
    }])
  res.status(200).json({notifications})
})
module.exports=router