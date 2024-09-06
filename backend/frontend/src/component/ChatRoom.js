import React, { useEffect, useState } from 'react'
import ChatBar from './ChatBar';
import '../component_CSS/chatRoom.css'
import io from 'socket.io-client'
import '../component_CSS/general.css'
import ChatHistory from './ChatHistory';
import Search from './search';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const connectSocketIO=io.connect('http://localhost:5001');
function ChatRoom() {
  const [toUser,setToUser]=useState("");
  const [bubbleNeeded,setBubbleNeeded]=useState(false);
  const [toUserDetails,setToUserDetails]=useState({});
  const [recentChatCount,setRecentChatCount]=useState(0);
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  const state=useSelector(state=>state.userIntrection.payload);
  const [recentMessages,setRecentMessages]=useState([]);
  useEffect(() => {
    markNotification();
  }, [connectSocketIO])
  
  const markNotification=async()=>{
      connectSocketIO.on("clientNotification",async(data)=>{
        if(logedUser===data?.chat?.to && data?.chat?.from === toUser){
          const body={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({fromUser:data?.chat?.from,toUser:data?.chat?.to})
          }
          await fetch('http://localhost:5001/notification/updateNotifications',body).then(res=>res.json()).then((res)=>{
            if(res.error){
              toast.warning(res.error, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
          })
        }
      })
  }
  const setOldCHats=async(fromUser,toUser)=>{
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({fromUser:fromUser,toUser:toUser})
    }
    await fetch('http://localhost:5001/chat/getUserChats',body).then(res=>res.json()).then((res)=>{
      if(res.userChats&&res.userChats.length>0){
        setRecentMessages(res.userChats[0]?.chats)
        setToUserDetails(res.userChats[0]?.fromUser[0]?._id===fromUser?res.userChats[0]?.toUser[0]:res.userChats[0]?.fromUser[0])
      }
      else{
        setRecentMessages([])
      }
    })
  }
  return (
    <div className='chatRoom w-100'>
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
    <div className='row justify-content-center h-full w-100'>
      <div className='col-lg-3 h-100'>
      <Search setToUser={setToUser} setToUserDetails={setToUserDetails} setOldCHats={setOldCHats} toUser={toUser}/>
      </div>
      <div className='col-lg-5 h-100'>{toUser&&<ChatBar setRecentMessages={setRecentMessages} recentMessages={recentMessages} socket={connectSocketIO} setBubbleNeeded={setBubbleNeeded} setRecentChatCount={setRecentChatCount} toUser={toUser} fromUser={logedUser} toUserDetails={toUserDetails} fromUserDetails={state?.logedUserDetails}/>}</div>
      <div className='col-lg-3'>
        <ChatHistory setToUser={setToUser} setToUserDetails={setToUserDetails} recentChatCount={recentChatCount} setOldCHats={setOldCHats} bubbleNeeded={bubbleNeeded} toUser={toUser}/>
      </div>
    </div>
    </div>
  )
}

export default ChatRoom