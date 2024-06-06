const connection=require('./db')
const express=require('express')
const app=express()
const cors=require('cors')
const deleteVideoOfDeletedStories = require('./storyDeleter')
const port=process.env.PORT || 5001

connection().then(()=>{
    deleteVideoOfDeletedStories();
});
app.use(cors())
app.use(express.json({limit:'50mb'}))
//app.use(express.urlencoded({limit:'50mb'}))
app.use('/user',require('./Routes/user'))
app.use('/post',require('./Routes/post'))
app.use('/story',require('./Routes/story'))
if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"))
}
app.listen(port,()=>{
})


