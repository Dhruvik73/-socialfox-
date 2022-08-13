const express=require('express')
const router=express.Router()
const post=require('../models/post')
router.post('/add',async(req,res)=>{
    try {
        var mypost=await post.create({
            userid:req.body.id,
            post:req.body.post,
            comment:req.body.comment,
            like:req.body.like,
            dislike:req.body.dislike,
            description:req.body.des,
            profile:req.body.profile,
            username:req.body.username
           }) 
           res.status(200).json({mypost})  
    } catch (e){
        res.status(500).json({'error':e})
    }
})
router.post('/fetchpost',async(req,res)=>{
    try {
        if(req.body.limit==0){
            var allpost=await post.find()
            res.status(200).json({allpost})   
        }
        else{
        allpost=await post.find().skip(req.body.limit-5).limit(5)
           res.status(200).json({allpost})  
        }
    } catch (e){
        res.status(500).json({'error':e})
    }
})
router.post('/getpost',async(req,res)=>{
    try {
        var allpost=await post.findById({_id:req.body.id})
           res.status(200).json({allpost})  
    } catch (e){
        res.status(500).json({'error':e})
    }
})
router.post('/like',async(req,res)=>{
    try {
        var allpost=await post.updateOne({_id:req.body.id},{like:req.body.like,dislike:req.body.dislike})
           res.status(200).json({allpost})  
    } catch (e){
        res.status(500).json({'error':e})
    }
})
router.post('/getuserpost',async(req,res)=>{
    try {
        var allpost=await post.find({userid:req.body.id})
           res.status(200).json({allpost})  
    } catch (e){
        res.status(500).json({'error':e})
    }
})
router.post('/comment',async(req,res)=>{
    try {
        var allpost=await post.updateOne({_id:req.body.id},{comment:req.body.comment})
           res.status(200).json({allpost})  
    } catch (e){
        res.status(500).json({'error':e})
    }
})
module.exports=router