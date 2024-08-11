import React, { useState,useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AiOutlineSend } from 'react-icons/ai'
import UserProfileWithName from './UserProfileWithName';
import {throwNotifications} from '../middleware/notificationManager'
function ChatBar({socket,fromUser,toUser,toUserDetails,fromUserDetails,activeChat}) {
    const [message,setMessage]=useState("");
    const [recentMessages,setRecentMessages]=useState([]);
    useEffect(() => {
      captureMessageAndStoreHistory()
      }, [socket]);
    useEffect(() => {
        setOldCHats();
      }, [activeChat])
      
    const sendMessageToSocket=async()=>{
      const chatInput=document.getElementById("chatInput")
      const message=chatInput.value.trim();
      if(message.length>=1){
        const messageWithDetails={
          chat:message,
          from:fromUser,
          to:toUser
        }
         chatInput.value="";
         setRecentMessages([...recentMessages,messageWithDetails]);
         socket.emit("sendMessage",[...recentMessages,messageWithDetails])
         const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({chat:message,fromUser:fromUser,toUser:toUser})
        }
        await fetch('http://localhost:5001/chat/addUserChats',body).then(res=>res.json()).then((res)=>{
          if(res.error){
            toast.warning(res.error, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
      }
    }
    const captureMessageAndStoreHistory=async()=>{
        socket.on('messageResponse', async(data) => {
        if(data && Array.isArray(data)){
        setRecentMessages(data);
            const notification={
              fromUserDetails:fromUserDetails,
              chat:data[data.length-1],
              notificationType:"chatMessage"
            }
            throwNotifications(notification);
        }
        });
      }
    const setOldCHats=()=>{
      if(activeChat&&Object.keys(activeChat).length>0){
        setRecentMessages(activeChat?.chats)
      }
    }
  return (
    <div className='w-100 h-100'>
    <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        {Object.keys(toUserDetails)!=0?<UserProfileWithName user={toUserDetails} linkNeeded={true}/>:<span>Start a new chat!</span>}
        <div className='h-90 chat-bar'>
        <div className='h-90 chatsDiv d-flex flex-column-reverse'>
        {[...recentMessages].reverse().map((m,i)=>{
          return m?.from==fromUser?<div key={i} className='d-flex justify-content-end align-items-center w-100'><span className='badge rounded-pill bg-info text-dark h-50 me-2'>{m?.chat}</span><UserProfileWithName user={fromUserDetails} nameRemoved={true}/></div>:<div key={i} className='d-flex align-items-center w-100'><UserProfileWithName  user={toUserDetails} nameRemoved={true}/><span className='badge rounded-pill bg-info text-dark h-50 ms-2'>{m?.chat}</span></div>
        })}
        </div>
        <div className='footer w-100 d-flex justify-content-center align-items-center'>
                      <input type="text" id="chatInput" name='chatInput' className="form-control form-control-lg w-75" autoComplete='name'/>
                      <button className='btn btn-outline-info btn-sm h-100 ms-3' onClick={sendMessageToSocket}><AiOutlineSend></AiOutlineSend></button>
        </div>
        </div>
    </div>
  )
}

export default ChatBar