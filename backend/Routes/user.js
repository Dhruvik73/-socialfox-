const express=require('express')
const { body, validationResult } = require('express-validator')
const user=require('../models/user')
const router=express.Router()
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const story = require('../models/story');
const secret='dhruvik'
router.post('/signup',[
    body('email','enter valid email').isEmail(),
    body('password','enter valid password').isLength({min:8}),
    body('firstname','enter valid name').isLength({min:3}),
    body('lastname','enter valid name').isLength({min:3})
],async (req,res)=>{
    const error=validationResult(req)
  if(!error.isEmpty()){
    res.status(500).json({"error":"internel server error"})
  }
  else{
    try {
        var myuser=await user.findOne({email:req.body.email})
        if(myuser){
            res.status(400).json({"exist":"user already exist!"})
        }
        else{
            const salt=await bcrypt.genSalt(10)
            const secpass=await bcrypt.hash(req.body.password,salt)
            myuser=await user.create({
            email:req.body.email,
            password:secpass,
            firstname:req.body.firstname,
            lastname:req.body.lastname
            })
            const token=jwt.sign(myuser.id,secret)
            res.status(200).json({myuser,token})
        }
       } catch (e) {
        res.status(500).json({"error":"internel server error"})
       }
  }
})
router.post('/login',[
    body('email','enter valid email').isEmail(),
    body('password','enter valid password').isLength({min:8})
],async (req,res)=>{
  const error=validationResult(req)
  if(error.isEmpty()){
    try {
        const myuser=await user.findOne({email:req.body.email})
        if(myuser){
            const compare=await bcrypt.compare(req.body.password,myuser.password)
            if(compare){
                const token=jwt.sign(myuser.id,secret)
                res.json({myuser,token})
            }
            else{
                res.status(400).json({"msg":"enter valid password"})
            }
        }
        else{
            res.status(400).json({'msg':'you need to signup'})
        }
    } catch (e) {
        res.status(500).json({"error":"internel server error"})
    }
  }
  else{
    res.status(500).json({"error":"internel server error","msg":error.errors[0].msg})
  }
})
router.post('/verify',async(req,res)=>{
  try{
    const token=req.body.token
    var id=jwt.verify(token,secret)
  }catch(e){
   res.status(400).json({'error':'you need to login'})
  }
if(id){
  const myuser=await user.findById({"_id":id})
  if(myuser){
    res.status(200).json({'myuser':myuser.id})
  }
  else{
    res.status(400).json({"login":"you need to signUp"})
  }
  
}
else{
  res.status(400).json({"host":"you are not allowed"})
}
})
router.post('/profile',async(req,res)=>{
  const myuser=await user.updateOne({"_id":req.body.id},{"profilephoto":req.body.url})
  res.status(200).json({myuser})
})
router.post('/fetchuser',async(req,res)=>{
  // try {
    const logedUser=await user.findById(req.body.id).select('-email -password');
    const userStories = await story.aggregate([
      { $match: { $expr: { $in: ['$userId',logedUser?.following] } } }, 
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'storyUser' } }, 
      {$group:{_id:'$userId',storyUser:{$first:'$storyUser'}}},
      { $project: {'storyUser.email':0,'storyUser.password':0,'storyUser.followers':0,'storyUser.following':0,story:0} }
    ])
    res.status(200).json({logedUser,userStories})
  // } catch (error) {
  //   res.status(500).json({error:"Some error occured try again!"})
  // }
})
router.post('/allies',async(req,res)=>{
   const myuser=await user.updateOne({'_id':req.body.id},{'following':req.body.detail})
   res.status(200).json({myuser})
})
router.post('/allusers',async(req,res)=>{
  const users=await user.find().where("_id").ne(req.body.id)
  res.status(200).json({users})
})
router.post('/follow',async(req,res)=>{
  try {
    var logedUser = await user.findById({ _id: req.body.logedUserId }).select('following')
    var toBeFollowed = await user.findById({ _id: req.body.toBeFollowed }).select('followers')
    if (!logedUser.following.includes(req.body.toBeFollowed)) {
      logedUser.following.push(req.body.toBeFollowed);
      await user.findOneAndUpdate({ _id: req.body.logedUserId },{following:logedUser.following});
    }
    if (!toBeFollowed.followers.includes(req.body.logedUserId)) {
      toBeFollowed.followers.push(req.body.logedUserId)
      await user.findByIdAndUpdate({ _id: req.body.toBeFollowed },{followers:toBeFollowed.followers});
    }
    res.status(200).json({ status:1 })
  } catch (error) {
    res.status(500).json({ error: "Some error occured try again!" })
  }
  
})
router.post('/unFollow',async(req,res)=>{
  try {
    var logedUser = await user.findById({ _id: req.body.logedUserId }).select('following')
    var toBeUnFollowed = await user.findById({ _id: req.body.toBeUnFollowed }).select('followers')
    if (logedUser.following.includes(req.body.toBeUnFollowed)) {
      logedUser.following.splice(logedUser.following.indexOf(req.body.toBeUnFollowed),1);
      await user.findOneAndUpdate({_id: req.body.logedUserId},{following:logedUser.following})
    }
    if (toBeUnFollowed.followers.includes(req.body.logedUserId)) {
      toBeUnFollowed.followers.splice(toBeUnFollowed.followers.indexOf(req.body.logedUserId),1);
      await user.findOneAndUpdate({_id: req.body.toBeUnFollowed},{followers:toBeUnFollowed.followers});
    }
    res.status(200).json({ status:1 })
  } catch (error) {
    res.status(500).json({ error: "Some error occured try again!" })
  }
  
})
router.post('/updateuser',body('firstname','enter valid name').isLength({min:3}),
body('lastname','enter valid name').isLength({min:3}),
async(req,res)=>{
  const myuser=await user.updateOne({'_id':req.body.id},{'firstname':req.body.firstname,'lastname':req.body.lastname})
  res.status(200).json({myuser})
})
router.post('/search',async(req,res)=>{
  const followedUsers=await user.find({$and:[{$or:[{firstname:{$regex:req.body.query.trim()}},{lastname:{$regex:req.body.query.trim()}}]},{"followers":{$in:[req.body.logedUser]}},{"_id":{$ne:req.body.logedUser}}]}).select("id firstname lastname profilephoto");
  const unKnownUsers=await user.find({$and:[{$or:[{firstname:{$regex:req.body.query.trim()}},{lastname:{$regex:req.body.query.trim()}}]},{"followers":{$nin:[req.body.logedUser]}},{"_id":{$ne:req.body.logedUser}}]}).select("id firstname lastname profilephoto")
  res.status(200).json({followedUsers,unKnownUsers})
})
router.post('/forgot',async(req,res)=>{
  const salt=await bcrypt.genSalt(10)
  const secpass=await bcrypt.hash(req.body.password,salt)
 const myuser=await user.findOneAndUpdate({email:req.body.email},{password:secpass})
 if(myuser){
  res.status(200).json({myuser})
 }
 else{
  res.status(400).json({error:'enter valid email'})
 }
})
router.post('/suggestedAllies',async(req,res)=>{
  const logedUser=await user.findById({"_id":req.body.id})
  if(logedUser){
    //get followers and following users from loged user's followers and following
    let logedUserAllies=[...new Set((await user.find({$or:[{_id:{$in:logedUser.following}},{_id:{$in:logedUser.followers}}]}).select('followers following')).map(k=>[k.followers,k.following]).toString().replace('[','').replace(']','').trim().split(',').filter((k)=>{ return k!=="";}))];
    
    //filter users from above list that not followed by loged user and include users which followes loged user
    let suggestedAllies=await user.find({$or:[{$and:[{_id:{$in:logedUserAllies}},{_id:{$nin:logedUser.following}},{_id:{$ne:logedUser._id}}]},{$and:[{_id:{$nin:logedUserAllies}},{_id:{$nin:logedUser.following}},{_id:{$ne:logedUser._id}},{_id:{$in:logedUser.followers}}]}]}).select('firstname lastname profilephoto')
    res.status(200).json({suggestedAllies})
  }
})
router.post('/getUserAllies',async(req,res)=>{
  const logedUser=await user.findById({"_id":req.body.logedUser}).select('followers following')
  if(logedUser){
    let logedUserAllies=await user.find({$or:[{_id:{$in:logedUser.followers}},{_id:{$in:logedUser.following}}]}).select('profilephoto firstname lastname');
    res.status(200).json({logedUserAllies});
  }
})
module.exports=router