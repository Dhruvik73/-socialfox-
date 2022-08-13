const connection=require('./db')
const express=require('express')
const app=express()
const cors=require('cors')
const port=5001
connection()
app.use(cors())
app.use(express.json({limit:'50mb'}))
//app.use(express.urlencoded({limit:'50mb'}))
app.use('/user',require('./Routes/user'))
app.use('/post',require('./Routes/post'))
app.use('/story',require('./Routes/story'))
app.listen(port,()=>{
})

