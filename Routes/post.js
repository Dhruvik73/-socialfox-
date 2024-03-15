const express=require('express')
const router=express.Router()
const post=require('../models/post')
const getColors = require('get-image-colors')
const systemPath=require('path')
const adjustColor=(color)=> {
    // Check if the color is in hex format, if not, return as it is
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return color;
    }

    // Remove the # symbol
    color = color.slice(1);

    // Convert hex to RGB
    var r = parseInt(color.slice(0, 2), 16);
    var g = parseInt(color.slice(2, 4), 16);
    var b = parseInt(color.slice(4, 6), 16);

    // Calculate brightness
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Adjust color based on brightness
    if (brightness < 128) {
        // Dark color, make it lighter
        r = Math.min(255, r + 150);
        g = Math.min(255, g + 150);
        b = Math.min(255, b + 150);
    } else {
        // Light color, return as it is
        return '#' + color;
    }

    // Convert RGB back to hex
    var adjustedColor = '#' + (r * 65536 + g * 256 + b).toString(16).padStart(6, '0');
    return adjustedColor;
}
router.post('/add',async(req,res)=>{
    try {

        const matches = req.body.post.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            res.status(500).json({ 'error': "Upload valid file" })
        }

        const imageType = matches[1];
        const imageData = matches[2];
        const fs = require('fs')
        // Convert the base64 image data to binary
        const binaryData = Buffer.from(imageData, 'base64');
        var postcount = await post.where({ userid: req.body.id }).count()
        
        const path = `../backend/frontend/src/images/${req.body.id}-post-${postcount + 1}.${imageType}`;
        fs.writeFileSync(path, binaryData, 'binary', (e) => {
            if (e) {
                res.status(500).json({ 'error': e })
            }
        })
        const buffer=fs.readFileSync(systemPath.resolve(path))
        const options = {
            count: 10,
            type: `image/${imageType}`
          }
        getColors(buffer, options).then(async colors => {
            var mypost = await post.create({
                userid: req.body.id,
                post: `${req.body.id}-post-${postcount + 1}.${imageType}`,
                comment: req.body.comment,
                like: req.body.like,
                dislike: req.body.dislike,
                description: req.body.des,
                profile: req.body.profile,
                username: req.body.username,
                bgColor:adjustColor(colors[0].hex())
            })
            res.status(200).json({ mypost })
          })
        
    } catch (e) {
        res.status(500).json({ 'error': e.message })
    }
})
router.post('/fetchpost', async (req, res) => {
    try {
        if (req.body.limit == 0) {
            var totalPost = await post.find().count()
            res.status(200).json({ totalPost })
        }
        else {
            allpost = await post.find().skip(req.body.limit - 5).limit(5)
            res.status(200).json({ allpost })
        }
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
router.post('/getpost', async (req, res) => {
    try {
        var allpost = await post.findById({ _id: req.body.id })
        res.status(200).json({ allpost })
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
router.post('/like', async (req, res) => {
    try {
        var likes = await post.findById(req.body.id).select()
        if(req.body.type=="like"){
            if(!likes.like.includes(req.body.userId)){
                likes.like.push(req.body.userId)
                await post.updateOne({ _id: req.body.id }, { like: likes.like})
                res.status(200).json({ count:likes.like.length })
            }
            else{
                res.status(200).json({ 'error':'You already liked this post!'})
            }
        }
        else if(req.body.type=="fillLike"){
            if(likes.like.includes(req.body.userId)){
                likes.like.splice(likes.like.indexOf(req.body.userId),1)
                await post.updateOne({ _id: req.body.id }, { like: likes.like})
                res.status(200).json({ count:likes.like.length })
            }
            else{
                res.status(200).json({ 'error':'You have not liked this post!' })
            }
        }
        else if(req.body.type=="dislike"){
            if(!likes.dislike.includes(req.body.userId)){
                likes.dislike.push(req.body.userId)
                await post.updateOne({ _id: req.body.id }, { dislike: likes.dislike})
                res.status(200).json({ count:likes.dislike.length })
            }
            else{
                res.status(200).json({ 'error':'You already disliked this post!' })
            }
        }
        else{
            if(likes.dislike.includes(req.body.userId)){
                likes.dislike.splice(likes.dislike.indexOf(req.body.userId),1)
                await post.updateOne({ _id: req.body.id }, { dislike: likes.dislike})
                res.status(200).json({ count:likes.dislike.length })
            }
            else{
                res.status(200).json({ 'error':'You have not disliked this post!' })
            }
        }
    } catch (e) {
        res.status(500).json({ 'error': "Some error occured try again!" })
    }
})
router.post('/getuserpost', async (req, res) => {
    try {
        var allpost = await post.find({ userid: req.body.id })
        res.status(200).json({ allpost })
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
router.post('/comment', async (req, res) => {
    try {
        var allpost = await post.updateOne({ _id: req.body.id }, { comment: req.body.comment })
        res.status(200).json({ allpost })
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
module.exports = router