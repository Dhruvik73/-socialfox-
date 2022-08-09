const express=require('express')
const { body, validationResult } = require('express-validator')
const user=require('../models/user')
const router=express.Router()
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
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
                res.status(400).json({"pass":"enter valid password"})
            }
        }
        else{
            res.status(400).json({'login':'you need to signup'})
        }
    } catch (e) {
        res.status(500).json({"error":"internel server error"})
    }
  }
  else{
    res.status(500).json({"error":"internel server error"})
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
  const myuser=await user.findById({"_id":req.body.id})
  res.status(200).json({myuser})
})
router.post('/allies',async(req,res)=>{
   const myuser=await user.updateOne({'_id':req.body.id},{'following':req.body.detail})
   res.status(200).json({myuser})
})
router.post('/allusers',async(req,res)=>{
  const users=await user.find().where("_id").ne(req.body.id)
  res.status(200).json({users})
})
router.post('/follower',async(req,res)=>{
  const myuser=await user.updateOne({'_id':req.body.id},{'followers':req.body.detail})
  res.status(200).json({myuser})
})
router.post('/updateuser',body('firstname','enter valid name').isLength({min:3}),
body('lastname','enter valid name').isLength({min:3}),
async(req,res)=>{
  const myuser=await user.updateOne({'_id':req.body.id},{'firstname':req.body.firstname,'lastname':req.body.lastname})
  res.status(200).json({myuser})
})
router.post('/search',async(req,res)=>{
  const users=await user.find({$or:[{firstname:{$regex:req.body.query.trim()}},{lastname:{$regex:req.body.query.trim()}}]})
  res.status(200).json({users})
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
module.exports=router