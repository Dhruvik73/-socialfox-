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
              notificationDate:Date.now()
            })
            await newNotification.save();
            res.status(200).json({status:1})
    } catch (e) {
        res.status(500).json({"error":"internel server error"})
    }
})
router.post('/updateNotifications',async(req,res)=>{
          const notificationId=(await notification.find({fromUser:req.body.fromUser,toUser:req.body.toUser}).sort({notificationDate:-1}).limit(1)).at(0)?.id;
          await notification.updateOne({_id:notificationId},{isRead:true});
          res.status(200).json({status:1})
})
module.exports=router