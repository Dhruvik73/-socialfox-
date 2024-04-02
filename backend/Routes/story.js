const express=require('express')
const router=express.Router()
const story=require('../models/story')
const user=require('../models/user')
router.post('/add',async(req,res)=>{
    const mystory=await story.create({
        userid:req.body.id,
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
    const mystory=await story.find({userid:req.body.id})
    if(mystory){
        res.status(200).json({mystory})
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