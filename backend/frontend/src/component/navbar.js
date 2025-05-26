import React, { useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {BsPersonCircle,BsPlus} from 'react-icons/bs'
import {BiChat, BiHomeAlt,BiSearchAlt2} from 'react-icons/bi'
import {FaUserFriends} from 'react-icons/fa'
import {MdOutlineAddToPhotos} from 'react-icons/md'
import {AiOutlineLogout} from 'react-icons/ai'
import logo from '../images/logo.png'
import '../component_CSS/navbar.css'
import UserProfileWithName from './UserProfileWithName'; 
import Showstory from './showstory'
import { useDispatch, useSelector } from 'react-redux'
import { setLastviewedPost } from '../Actions/userIntrection';
import io from 'socket.io-client'
const Socket=io.connect("http://65.0.19.137:5001")
function Navbar() {
  const dispatch=useDispatch();
  const state=useSelector(state=>state.userIntrection.payload);
  let id=localStorage.getItem('id')?localStorage.getItem('id'):0
  let toUser=localStorage.getItem('toUser')?localStorage.getItem('toUser'):0
  const [user,setuser]=useState({})
  const [notifications,setNotifications]=useState([]);
  const [toggleNotification,setToggleNotification]=useState(false);
  const [storyUser,setStoryUser]=useState([])
  const [userId,setUserId]=useState(0)
  const [logedUserStoryCount,setLogedUserStoryCount]=useState(0)
  useEffect(() => {
      getStories()
  }, [])
  useEffect(() => {
    Socket.on("clientNotification",async(data)=>{ // capture the notification from different components
      if(id===data?.chat?.to){
        if(toUser===data?.chat?.from){
      Socket.emit("updateNotificationStatus",data)
        }
        getNotifications();
        }
    })
  },[Socket,notifications])
  
  const getNotifications=async()=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({logedUser:id,fromUser:toUser}) // here we passed toUser as fromUser to not get notification whose chat is open
    }
    if(id!=null){
    await fetch('http://localhost:5001/notification/getNotifications',body).then(res=>res.json()).then(res=>{
      if(res.notifications){
        setNotifications(res.notifications)
      }
    })
    }

  }
  const getStories=async()=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    if(id!=null){
    const res=await fetch('http://65.0.19.137:5001/user/fetchuser',body)
    const result=await res.json()
    setuser(result?.logedUser)
    dispatch(setLastviewedPost(state.posts,state.comments,state.postId,state.totalPosts,state.isCloseBtnClicked,result?.logedUser))
    setStoryUser(result?.userStories)
    setLogedUserStoryCount(result?.logedUserStoryCount)
    }
  }
  const logout=()=>{
    localStorage.clear();
  }
  return (
    <>
    <div className='fixed-top d-flex justify-content-between border-dark border-bottom' style={{width:100+'vw',backgroundColor:'white'}}>
<div style={{overflow:'hidden',height:70+'px',marginLeft:30+'px'}}><div className='d-flex' style={{height:100+'px',overflowX:'auto',whiteSpace:'nowrap',flexWrap:'nowrap',width:50+'vw',marginTop:10+'px'}}>
      <div style={{position:'relative'}}>
      <div className='round'>
      {logedUserStoryCount>0?<img data-target="#storyModal" data-toggle="modal" onClick={()=>{setUserId(id);document.getElementById("video").play()}} className='border border-secondary  w-100 h-100' src={user.profilephoto?user.profilephoto:logo} alt="not load"/>:<Link to={`/story/${user._id}`}><img className='border border-secondary  w-100 h-100' src={user.profilephoto?user.profilephoto:logo} alt="not load" onClick={()=>{setUserId(0)}}/></Link>}
      </div>
      <Link to={`/story/${user._id}`}><span style={{position: 'absolute',top: 0+'px',right: 0+'px',display:'block',fontSize:17+'px',color:'blue',cursor:'pointer'}} onClick={()=>{setUserId(0)}}><BsPlus/></span></Link><p style={{fontSize:10+'px'}}>Your Story</p></div>
      {storyUser.map((k)=>{
          return <div key={k.storyUser[0]?._id} style={{position:'relative'}} data-target="#storyModal" data-toggle="modal" onClick={()=>{setUserId(k.storyUser[0]?._id);document.getElementById("video").play()}}><UserProfileWithName user={k.storyUser[0]} nameBelow={true}></UserProfileWithName></div>
      })}
      </div>
      </div>
        <div className='d-flex justify-content-end'>
            <ul style={{marginRight:2+'vw',marginTop:8+'px'}}>
            <span style={{fontSize:1.8+'vw',color:'#157ad0f5',marginRight:25+'px'}}>
                <Link to={`/profile/${localStorage.getItem('id')?localStorage.getItem('id'):0}`}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(12 97 169 / 96%)'}}><BsPersonCircle/></span></Link>
                <Link to={'/login'}><span onClick={logout} className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(12 97 169 / 96%)'}}><AiOutlineLogout/> </span></Link>
                <Link to={'/'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(9 83 147 / 96%)'}}><BiHomeAlt/></span></Link>
                <Link to={'/allies'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(12 97 169 / 96%)'}}><FaUserFriends/></span></Link>
                <Link to={'/addpost'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'#157ad0f5'}}><MdOutlineAddToPhotos/></span></Link>
                <div className='badge badge-light position-relative'><Link to={`/chat`} style={{fontSize:1.8+'vw',color:'#157ad0f5'}}><BiChat/></Link><span className="position-absolute top-25 start-75 translate-middle badge rounded-pill cursor-pointer bg-info" onClick={()=>{setToggleNotification(prev=>!prev)}}>
    {notifications.length}
    <span className="visually-hidden">unread messages</span>
  </span>{toggleNotification&&<div className='card notificationCard'>
    {notifications.map((k,i)=>{
          return <div className='mt-3 d-flex align-items-center justify-content-between w-100' key={i}><div className='d-flex userText'><UserProfileWithName user={k?.user[0]} lastChat={k?.notification?.chat?.chat} />
          <span className='ms-2 fw-normal fs-5'>Sent a message</span>
          </div></div>
        })}
  </div>}</div>
                </span>
            </ul>
        </div>
        
    </div>
    {userId!=0&&<Showstory userId={userId}></Showstory>}
</>
  )
}

export default Navbar;