const connection=require('./db')
const express=require('express')
const app=express()
const http=require('http')
const cors=require('cors')
const {Server}=require('socket.io');

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
app.use('/chat',require('./Routes/chat'))
if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"))
}
const server=http.createServer(app);

//create a server and add CORS for our client
const io=new Server(server,{
    cors:{
        methods:["GET","POST"],
        origin:"http://localhost:3000"
    }
})

//listen the server when client's connect with socekt.io server
io.on("connection",(socket)=>{
    //write events
    socket.on("sendMessage",(data)=>{
        io.emit("messageResponse",data)// join the user to the socket room
    })
})

server.listen(port,()=>{
})


