const express=require('express')
const router=express.Router()
const story=require('../models/story')
const user=require('../models/user')
const { Types } = require('mongoose')
router.post('/add',async(req,res)=>{
    try {
        if(req.body.story?.length>0){
        var storyCount = (await story.where({ userId: req.body.id }))?.length
        if (storyCount) {
            storyCount = storyCount+1
        }
        else {
            storyCount = 1;
        }
        let matches=[];
        let storyType = '';
        let storyData = '';
        for (const story of req.body.story) {
            if(req.body.mediaType==='video'){
            matches = story.match(/^data:video\/([A-Za-z0-9-+\/]+);base64,(.+)$/);
            }
            if (!matches || matches.length !== 3) {
                res.status(500).json({ 'error': "Upload valid file" });
                return;
            }

            storyType = matches[1];
            storyData = matches[2];
            const fs = require('fs')
            // Convert the base64 image data to binary
            const binaryData = Buffer.from(storyData, 'base64');
            const path = `../backend/frontend/src/storyVideos/${req.body.id}-story-${storyCount}.${storyType}`;
            fs.writeFileSync(path, binaryData, 'binary', (e) => {
                if (e) {
                    res.status(500).json({ 'error': e })
                }
            })
        };
           
        const mystory=await story.create({
            userId:req.body.id,
            story:`${req.body.id}-story-${storyCount}.${storyType}`,
            mediaType:req.body.mediaType
        });
        mystory.save();
        res.status(200).json({ 'msg': "Story uploaded successfully!" })

    }
else{
    res.status(500).json({ 'error': "Upload valid file!" })
}
} catch (e) {
        res.status(500).json({ 'error': "Some error occured try again!" })
    }
})
router.post("/getstory", async (req, res) => {
  let userStories = [];
  if (req.body.logedUserOrNot) {
    userStories = await story.aggregate([
      { $match: { userId: Types.ObjectId(req.body.id) } },
      {
        $facet: {
          userStories: [
            {
              $lookup: {
                from: "users",
                localField: "views",
                foreignField: "_id",
                as: "views",
              },
            },
            {
              $project: {
                "views.email": 0,
                "views.password": 0,
                "views.following": 0,
                "views.followers": 0,
              },
            },
          ],
          totalStories: [{ $count: "totalStories" }],
        },
      },
    ]);
  } else {
    userStories = await story.aggregate([
        { $match: { userId: Types.ObjectId(req.body.id) } },
        {
          $facet: {
            userStories: [
              {
                $project: {
                  "views": 0
                },
              },
            ],
            totalStories: [{ $count: "totalStories" }],
          },
        },
      ]);
  }
  if (userStories[0].userStories && userStories[0].totalStories) {
    res
      .status(200)
      .json({
        userStories: userStories[0]?.userStories,
        totalStories: userStories[0]?.totalStories[0]?.totalStories,
      });
  } else {
    res.status(500).json({ error: "internel server error" });
  }
});
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
    const userStory=await story.findById(req.body.storyId);
    if(userStory){
        if(userStory?.userId !== req?.body?.userId){
            let Views=userStory?.views;
        if(!Views?.includes(Types.ObjectId(req?.body?.userId))){
            Views?.push(req?.body?.userId);
            await story.findOneAndUpdate({_id:req.body.storyId},{views:Views});
        }
    }
        res.status(200).json({msg:1})
    }
    else{
        res.status(500).json({error:'Some error occured try again!'})
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