import React, { useEffect, useState } from 'react'
import UserProfileWithName from './UserProfileWithName';
function ChatHistory({setToUser,setToUserDetails,recentChatCount,setOldCHats,toUser,bubbleNeeded}) {
  const [userChats,setUserChats]=useState([]);
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  useEffect(() => {
    getUserChats()
  }, [recentChatCount])
  const getUserChats=async()=>{
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userId:logedUser})
    }
    await fetch('http://localhost:5001/chat/getUserChatsHistory',body).then(res=>res.json()).then((res)=>{
      if(res.userChats){
        setUserChats(res.userChats)
        if(recentChatCount===0){
        setToUser(res.userChats[0]?.fromUser[0]?._id===logedUser?res.userChats[0]?.toUser[0]?._id:res.userChats[0]?.fromUser[0]?._id)
        setToUserDetails(res.userChats[0]?.fromUser[0]?._id===logedUser?res.userChats[0]?.toUser[0]:res.userChats[0]?.fromUser[0])
        setOldCHats(logedUser,res.userChats[0]?.fromUser[0]?._id===logedUser?res.userChats[0]?.toUser[0]?._id:res.userChats[0]?.fromUser[0]?._id);
        }
      }
    })
  }
  const openUserChat=async(user)=>{
    if(toUser!==(user?.fromUser[0]?._id===logedUser?user?.toUser[0]?._id:user?.fromUser[0]?._id)){
    await setOldCHats(logedUser,user?.fromUser[0]?._id===logedUser?user?.toUser[0]?._id:user?.fromUser[0]?._id);
    setToUser(user?.fromUser[0]?._id===logedUser?user?.toUser[0]?._id:user?.fromUser[0]?._id)
    localStorage.setItem('toUser',user?.fromUser[0]?._id===logedUser?user?.toUser[0]?._id:user?.fromUser[0]?._id);
    }
  }
  return (
      <div className='chat_historyTab h-100'>
      <span>Chats</span>
      <div className='d-flex flex-column align-items-center' id='chatHistory'>
        {userChats.map((k,i)=>{
          return <div className='mt-3 oldChats w-75' key={i} onClick={()=>{openUserChat(k)}}><UserProfileWithName user={k?.fromUser[0]?._id===logedUser?k?.toUser[0]:k?.fromUser[0]} lastChat={k?.lastChat?.chat}/>{bubbleNeeded&&<span>1</span>}</div>
        })}
      </div>
      </div>
  )
}

export default ChatHistory