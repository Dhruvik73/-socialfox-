import React from 'react'
import {Link} from 'react-router-dom'

function UserProfileWithName({user,linkNeeded}) {
  return (
    <>{(user.profilephoto&&user.firstname&&user.lastname)&&<div className='d-flex align-items-center'><div className='round ms-1 mt-1'>{linkNeeded?<Link to={`allies/profile/${user._id}`}><img className='w-100 h-100' src={user.profilephoto ? user.profilephoto : 'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'}/></Link>:<img className='w-100 h-100' src={user.profilephoto ? user.profilephoto : 'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'}/>}</div><span className='ms-2'>{user.firstname} {user.lastname}</span></div>}</>
  )
}

export default UserProfileWithName