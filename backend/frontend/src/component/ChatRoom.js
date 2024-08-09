import React, { useEffect, useState } from 'react'
import ChatBar from './ChatBar';
import '../component_CSS/chatRoom.css'
import io from 'socket.io-client'
import '../component_CSS/general.css'
import ChatHistory from './ChatHistory';
import Search from './search';
import { useSelector } from 'react-redux';
const connectSocketIO=io.connect('http://localhost:5001');
function ChatRoom() {
  const [toUser,setToUser]=useState("");
  const [activeChat,setActiveChat]=useState([]);
  const [toUserDetails,setToUserDetails]=useState({});
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  const state=useSelector(state=>state.userIntrection.payload);
  const setActiveChatFromHistory=()=>{
    if(activeChat&&Object.keys(activeChat).length>0){
    setToUserDetails(activeChat?.fromUser[0]?._id!==logedUser?activeChat?.fromUser[0]:activeChat?.toUser[0])
    setToUser(activeChat?.fromUser[0]?._id!==logedUser?activeChat?.fromUser[0]?._id:activeChat?.toUser[0]?._id)
    }
  }
  useEffect(() => {
    setActiveChatFromHistory();
  }, [activeChat])
  return (
    <div className='chatRoom w-100'>
    <div className='row justify-content-center h-full w-100'>
      <div className='col-lg-3 h-100'>
      <Search setToUser={setToUser} setToUserDetails={setToUserDetails}/>
      </div>
      <div className='col-lg-5 h-100'>{toUser&&<ChatBar socket={connectSocketIO} activeChat={activeChat} toUser={toUser} fromUser={logedUser} toUserDetails={toUserDetails} fromUserDetails={state?.logedUserDetails}/>}</div>
      <div className='col-lg-3'>
        <ChatHistory setActiveChat={setActiveChat}/>
      </div>
    </div>
    </div>
  )
}

export default ChatRoom