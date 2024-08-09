import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import logo from '../images/logo.png'

function UserProfileWithName({user,linkNeeded,funcNeeded,nameBelow,nameRemoved,lastChat}) {
  
  const closeModal=()=>{
    if(funcNeeded){
      document.getElementById('closeModal').click();
    }
  }
  return (
    <>{(user)&&<div className={`d-flex ${nameBelow?"flex-column":""} align-items-center`}><div className={`round ${nameBelow?"":"ms-1 mt-1"}`}>{linkNeeded?<Link onClick={closeModal}  to={`/profile/${user._id}`}><img className='w-100 h-100' src={user.profilephoto ? user.profilephoto : logo}/></Link>:<img className='w-100 h-100' src={user.profilephoto ? user.profilephoto : logo}/>}</div>{!nameRemoved&&<div className={`ms-2 d-flex flex-column userName ${nameBelow?"f-10":""}`}><span>{user.firstname?user.firstname:""} {user.lastname?user.lastname:""}</span>{lastChat&&<span style={{opacity:0.5,color:'#157ad0f5'}}>{lastChat}</span>}</div>}</div>}</>
  )
}

export default UserProfileWithName