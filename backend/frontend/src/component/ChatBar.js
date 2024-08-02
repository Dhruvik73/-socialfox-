import React, { useState,useEffect } from 'react'

import { AiOutlineSend } from 'react-icons/ai'
import UserProfileWithName from './UserProfileWithName';
function ChatBar({socket,fromUser,toUser,toUserDetails}) {
    const [message,setMessage]=useState("");
    const [recentMessages,setRecentMessages]=useState([]);
    const sendMessageToSocket=()=>{
      const messageWithDetails={
        message,
        fromUser,
        toUser
      }
        socket.emit("sendMessage",{messageWithDetails})
    }
    useEffect(() => {
      captureMessageAndStoreHistory()
      }, [socket,recentMessages]);
      const captureMessageAndStoreHistory=()=>{
        const tMessages=recentMessages
        socket.on('messageResponse', (data) => {
          tMessages.push(data);
          setRecentMessages(tMessages);
        });
      }
  return (
    <div className='w-100 h-100'>
        {Object.keys(toUserDetails)!=0?<UserProfileWithName user={toUserDetails} linkNeeded={true}/>:<span>Start a new chat!</span>}
        <div className='h-90 chat-bar'>
        <div className='h-90'>
        {recentMessages.map((m)=>{
          return <div><UserProfileWithName user={toUserDetails}/></div>
        })}
        </div>
        <div className='footer w-100 d-flex justify-content-center align-items-center'>
                      <input type="text" id="chatInput" name='chatInput' onChange={(e)=>{setMessage(e.target.value)}} className="form-control form-control-lg w-75" autoComplete='name'/>
                      <button className='btn btn-outline-info btn-sm h-100 ms-3' onClick={sendMessageToSocket}><AiOutlineSend></AiOutlineSend></button>
        </div>
        </div>
    </div>
  )
}

export default ChatBar