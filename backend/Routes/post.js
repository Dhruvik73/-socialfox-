const express = require('express')
const router = express.Router()
const post = require('../models/post')
const getColors = require('get-image-colors')
const systemPath = require('path')
const comment = require('../models/comment')
const adjustColor = (color) => {
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
router.post('/add', async (req, res) => {
    try {
        var postcount = (await post.where({ userid: req.body.id }).sort({ post: -1 })).at(0)
        if (postcount) {
            postcount = postcount.userPostCount
        }
        else {
            postcount = 0;
        }
        const userPosts = [];
        const bgColors = [];
        for (const post of req.body.post) {
            const matches = post.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                res.status(500).json({ 'error': "Upload valid file" })
            }

            const imageType = matches[1];
            const imageData = matches[2];
            const fs = require('fs')
            // Convert the base64 image data to binary
            const binaryData = Buffer.from(imageData, 'base64');
            const path = `../backend/frontend/src/images/${req.body.id}-post-${postcount + 1}.${imageType}`;
            fs.writeFileSync(path, binaryData, 'binary', (e) => {
                if (e) {
                    res.status(500).json({ 'error': e })
                }
            })
            userPosts.push(`${req.body.id}-post-${postcount + 1}.${imageType}`);
            const buffer = fs.readFileSync(systemPath.resolve(path))
            const options = {
                count: 1,
                type: `image/${imageType}`
            }
            const colorRes = await getColors(buffer, options);
            await Promise.all(colorRes.map((color) => { bgColors.push(adjustColor(color.hex())) }))
            postcount++;
        };
        if (bgColors.length > 0) {
            await post.create({
                user: req.body.id,
                post: userPosts,
                comment: req.body.comment,
                like: req.body.like,
                dislike: req.body.dislike,
                description: req.body.des,
                bgColor: bgColors,
                userPostCount: postcount
            })
        }
        res.status(200).json({ 'message': "Posts uploaded successfully!" })

    } catch (e) {
        res.status(500).json({ 'error': "Some error occured try again!" })
    }
})
router.post('/fetchpost', async (req, res) => {
    try {
        var totalPost = await post.find().count()
        // var allpost = await post.find().populate({ path: "user", model: "user", select: "-following -followers -password -email" }).skip(req.body.limit - 5).limit(5);
        var allpost = await post.aggregate([
            { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
            { $lookup: { from: "comments", localField: "id", foreignField: "post", as: "comment" } },
            { $addFields: { commentsCount: { $size: "$comment" },user: { $arrayElemAt: ["$user", 0] } } },
            {
                $project: {
                    comment: 0,
                    "user.email": 0,
                    "user.following": 0,
                    "user.followers": 0,
                    "user.password": 0
                }
            }

        ]).skip(req.body.limit - 5).limit(5);
        res.status(200).json({ allpost, totalPost })
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
router.post('/like', async (req, res) => {
    try {
        var likes = await post.findById(req.body.id).select()
        if (req.body.type == "like") {
            if (!likes.like.includes(req.body.userId)) {
                likes.like.push(req.body.userId)
                await post.updateOne({ _id: req.body.id }, { like: likes.like })
                res.status(200).json({ count: likes.like.length })
            }
            else {
                res.status(200).json({ 'error': 'You already liked this post!' })
            }
        }
        else if (req.body.type == "fillLike") {
            if (likes.like.includes(req.body.userId)) {
                likes.like.splice(likes.like.indexOf(req.body.userId), 1)
                await post.updateOne({ _id: req.body.id }, { like: likes.like })
                res.status(200).json({ count: likes.like.length })
            }
            else {
                res.status(200).json({ 'error': 'You have not liked this post!' })
            }
        }
        else if (req.body.type == "dislike") {
            if (!likes.dislike.includes(req.body.userId)) {
                likes.dislike.push(req.body.userId)
                await post.updateOne({ _id: req.body.id }, { dislike: likes.dislike })
                res.status(200).json({ count: likes.dislike.length })
            }
            else {
                res.status(200).json({ 'error': 'You already disliked this post!' })
            }
        }
        else {
            if (likes.dislike.includes(req.body.userId)) {
                likes.dislike.splice(likes.dislike.indexOf(req.body.userId), 1)
                await post.updateOne({ _id: req.body.id }, { dislike: likes.dislike })
                res.status(200).json({ count: likes.dislike.length })
            }
            else {
                res.status(200).json({ 'error': 'You have not disliked this post!' })
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
router.post('/addComment', async (req, res) => {
    try {
        var userComment = await comment.create({
            user: req.body.userId,
            comment: req.body.comment,
            post: req.body.postId
        });
        await userComment.save();
        res.status(200).json({ msg: "Comment posted sucessfully!" })
    } catch (e) {
        res.status(500).json({ 'error': "Some error ocurred try again!" })
    }
})

router.post('/getComments', async (req, res) => {
    try {
        const comments = await comment.find({ post: req.body.postId }).populate({ path: "user", model: "user", select: "-following -followers -password -email" }).select("-post")
        res.status(200).json({ comments })
    } catch (e) {
        res.status(500).json({ 'error': e })
    }
})
module.exports = router