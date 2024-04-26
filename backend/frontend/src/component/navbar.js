import React, { useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {BsPersonCircle,BsPlus} from 'react-icons/bs'
import {BiHomeAlt,BiSearchAlt2} from 'react-icons/bi'
import {FaUserFriends} from 'react-icons/fa'
import {MdOutlineAddToPhotos} from 'react-icons/md'
import {AiOutlineLogout} from 'react-icons/ai'
import logo from '../images/logo.png'
import '../component_CSS/navbar.css'
import UserProfileWithName from './UserProfileWithName'; 
import Showstory from './showstory'
function Navbar() {
  let id=localStorage.getItem('id')
  const [user,setuser]=useState({})
  const [storyUser,setStoryUser]=useState([])
  const [userId,setUserId]=useState(0)
  useEffect(() => {
      getStories()
  }, [])
  const getStories=async()=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    if(id!=null){
    const res=await fetch('http://localhost:5001/user/fetchuser',body)
    const result=await res.json()
    setuser(result?.logedUser)
    setStoryUser(result?.userStories)
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
      <img data-target="#storyModal" data-toggle="modal" onClick={()=>{setUserId(id)}} className='border border-secondary  w-100 h-100' src={user.profilephoto?user.profilephoto:logo} alt="not load"/></div>
      <Link to={`/story/${user._id}`}><span style={{position: 'absolute',top: 0+'px',right: 0+'px',display:'block',fontSize:17+'px',color:'blue',cursor:'pointer'}}><BsPlus/></span></Link><p style={{fontSize:10+'px'}}>Your Story</p></div>
      {storyUser.map((k)=>{
          return <div key={k.storyUser[0]?._id} style={{position:'relative'}} data-target="#storyModal" data-toggle="modal" onClick={()=>{setUserId(k.storyUser[0]?._id)}}><UserProfileWithName user={k.storyUser[0]} nameBelow={true}></UserProfileWithName></div>
      })}
      </div>
      </div>
        <div className='d-flex justify-content-end'>
            <ul style={{marginRight:2+'vw',marginTop:8+'px'}}>
            <span style={{fontSize:1.8+'vw',color:'#157ad0f5',marginRight:25+'px'}}><Link to={`/profile/${localStorage.getItem('id')}`}><BsPersonCircle/></Link><span onClick={logout} style={{fontSize:1.8+'vw',color:'#157ad0f5',marginLeft:25+'px'}}><Link to={'/login'} style={{textDecoration:'none'}}><AiOutlineLogout/> </Link></span><Link to={'/'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(9 83 147 / 96%)'}}><BiHomeAlt/></span></Link>
                <Link to={'/allies'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(12 97 169 / 96%)'}}><FaUserFriends/></span></Link>
                <Link to={'/search'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(35 114 180 / 96%)'}}><BiSearchAlt2/></span></Link>
                <Link to={'/addpost'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'#157ad0f5'}}><MdOutlineAddToPhotos/></span></Link></span>
            </ul>
        </div>
    </div>
    {userId!=0&&<Showstory userId={userId}></Showstory>}
</>
  )
}

export default Navbar;