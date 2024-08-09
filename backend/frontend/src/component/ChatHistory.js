import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import UserProfileWithName from './UserProfileWithName';
const connectSocketIO=io.connect('http://localhost:5001');
function ChatHistory({setActiveChat}) {
  const [userChats,setUserChats]=useState([]);
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
    await fetch('http://localhost:5001/chat/getUserChats',body).then(res=>res.json()).then((res)=>{
      if(res.userChats){
        setUserChats(res.userChats)
        setActiveChat(res.userChats[0])
      }
    })
  }
  return (
      <div className='chat_historyTab h-100'>
      <span>Chats</span>
      <div className='d-flex flex-column align-items-center'>
        {userChats.map((k,i)=>{
          return <div className='mt-3 oldChats w-75' key={i} onClick={()=>{setActiveChat(k)}}><UserProfileWithName user={k?.fromUser[0]?._id===logedUser?k?.toUser[0]:k?.fromUser[0]} lastChat={k?.chats[k?.chats?.length-1]?.chat}/></div>
        })}
      </div>
      </div>
  )
}

export default ChatHistory