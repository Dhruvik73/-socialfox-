const express=require('express')
const router=express.Router()
const story=require('../models/story')
const user=require('../models/user')
const { Types } = require('mongoose')
router.post('/add',async(req,res)=>{
    const mystory=await story.create({
        userId:req.body.id,
        story:req.body.story
    })
    if(mystory){
        res.status(200).json({mystory})
    }
    else{
        res.status(500).json({error:'internel server error'})
    }
})
router.post('/getstory',async(req,res)=>{
    const userStories = await story.aggregate([{ $match: { userId: Types.ObjectId(req.body.id) } },
        {$limit:1},
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $lookup: { from: 'users', localField: 'views', foreignField: '_id', as: 'views' } },
        { $project: { 'views.email': 0, 'views.password': 0, 'views.following': 0, 'views.followers': 0, 'user.email': 0, 'user.password': 0, 'user.following': 0, 'user.followers': 0 } }
]);
    if(userStories){
        res.status(200).json({userStories})
    }
    else{
        res.status(500).json({error:'internel server error'})
    }
})
router.post('/getuser',async(req,res)=>{
    const mystory=await story.find().where('userid').ne(req.body.id)
    const usersid=[]
    if(mystory){
        for(let story of mystory){
           usersid.push(story.userid)
        }
        const uniqueuser=[...new Set(usersid)]
        const users=[]
        for (let id of uniqueuser){
            const myuser=await user.findById(id)
            users.push(myuser)
        }
        res.status(200).json({users})
    }
    else{
        res.status(500).json({error:'internel server error'})
    }
})
router.post('/addview',async(req,res)=>{
    const view=await story.findOneAndUpdate({_id:req.body.id},{views:req.body.views})
    if(view){
        res.status(200).json({view})
    }
    else{
        res.status(500).json({error:'internel server error'})
    }
})
router.post('/getview',async(req,res)=>{
    const views=req.body.views
    const users=[]
    for(let id of views){
        const myuser=await user.findById(id)
        users.push(myuser)
    }
    if(users){
        res.status(200).json({users})
    }
    else{
        res.status(500).json({error:'enternel server error'})
    }
})
module.exports=router