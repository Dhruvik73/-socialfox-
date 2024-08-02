import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import ChatBar from './ChatBar';
import '../component_CSS/chatRoom.css'
import '../component_CSS/general.css'
import ChatHistory from './ChatHistory';
import Search from './search';
const connectSocketIO=io.connect('http://localhost:5001');
function ChatRoom() {
  const [userChats,setUserChats]=useState([]);
  const [toUser,setToUser]=useState("");
  const [toUserDetails,setToUserDetails]=useState({});
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  useEffect(() => {
    getUserChats()
  }, [])
  const getUserChats=async()=>{
    connectSocketIO.on("message",(data)=>{
      console.log(data)
    })
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userId:logedUser})
    }
    await fetch('http://localhost:5001/chat/getUserChats',body).then(res=>res.json()).then((res)=>{})
  }
  return (
    <div className='chatRoom w-100'>
    <div className='row justify-content-center h-full w-100'>
      <div className='col-lg-3 h-100'>
      <Search setToUser={setToUser} setToUserDetails={setToUserDetails}/>
      </div>
      <div className='col-lg-5 h-100'><ChatBar socket={connectSocketIO} toUser={toUser} fromUser={logedUser} toUserDetails={toUserDetails}/></div>
      <div className='col-lg-3'>
        <ChatHistory/>
      </div>
    </div>
    </div>
  )
}

export default ChatRoom