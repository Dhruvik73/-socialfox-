import React, { useEffect } from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
function Allies() {
  const [val,setval]=useState([])
  const [following,setfollowing]=useState([])
  const [follower,setfollower]=useState([])
  const [change,setchange]=useState(true)
  const [friend,setfriend]=useState([])
  useEffect(() => {
    users()
  }, [change])
  const validator=(id)=>{
      let valid=false
        if(following.includes(id)){
          valid=true
        }
      return valid
  }
  const users=async()=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":localStorage.getItem('id')})
    }
    const myres= await fetch('http://localhost:5001/user/fetchuser',body)
    const myresult=await myres.json()
    setfollowing(myresult.myuser.following)
    setfollower(myresult.myuser.followers)
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":localStorage.getItem('id')})
    }
    const res= await fetch('http://localhost:5001/user/allusers',mybody)
    const result=await res.json()
    if(result.users){
      if(myresult.myuser.following.length>0){
        let allies=[]
        let notallie=result.users
        for (let index = 0; index < myresult.myuser.following.length; index++) {
          allies.push(result.users.filter(user=>user._id==myresult.myuser.following[index])[0])
        }
        setfriend(allies)
        for (let index = 0; index < myresult.myuser.following.length; index++) {
          notallie=notallie.filter(user=>user._id!=myresult.myuser.following[index])
        }
        setval(notallie)
      }
      else{
        setval(result.users)
      }
    }
    
  }
  const followme=async(id)=>{
    let count=true
    let followercount=true
         if(following.includes(id)){
          count=false
         }
      if(follower.includes(localStorage.getItem('id'))){
       followercount=false}
    if(count){
    following.push(id)
    }
    if(followercount){
      follower.push(localStorage.getItem('id'))
    }
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":localStorage.getItem('id'),'detail':following})
    }
    const res= await fetch('http://localhost:5001/user/allies',mybody)
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":id,'detail':follower})
    }
    const myres= await fetch('http://localhost:5001/user/follower',body)
    if(change){
      setchange(false)
    }
    else{
      setchange(true)
    }

  }
  const unfollowme=async(id)=>{
    following.splice(following.indexOf(id),1)
    follower.splice(follower.indexOf(localStorage.getItem('id')),1)
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":localStorage.getItem('id'),'detail':following})
    }
    const res= await fetch('http://localhost:5001/user/allies',mybody)
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":id,'detail':follower})
    }
    const myres= await fetch('http://localhost:5001/user/follower',body)
    if(change){
      setchange(false)
    }
    else{
      setchange(true)
    }
  }
  return (
    <div className='d-flex container' style={{marginTop:100+'px'}}>
        <div className='col-md-12' style={{height:500+'px',width:35+'vw',marginLeft:20+'px'}}>
        <h6 style={{color:'gray',marginLeft:40+'px'}}>Allies</h6>
        {friend.map((k)=>{
          return <div key={k._id} className='d-flex' style={{height:50+'px',marginTop:20+'px'}}><Link to={`profile/${k._id}`}><img className='border border-secondary' src={k.profilephoto?k.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:40+'px',width:38+'px',margin:3+'px',borderRadius:50+'px'}}/></Link>{k.firstname+' '+k.lastname}<p onClick={validator(k._id)?()=>{unfollowme(k._id)}:()=>{followme(k._id)}} style={{marginLeft:15+'px',color:'blue',fontSize:14+'px',cursor:'pointer'}}>{validator(k._id)?"UnFollow":"Follow"}</p></div>
        })}
        </div>
        <div className='col-md-12' style={{height:500+'px',width:35+'vw',marginLeft:20+'px'}}>
        <h6 style={{color:'gray',marginLeft:40+'px'}}>Suggested</h6>
        {val.map((k)=>{
          return <div key={k._id} className='d-flex' style={{height:50+'px',marginTop:20+'px'}}><Link to={`profile/${k._id}`}><img className='border border-secondary' src={k.profilephoto?k.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:40+'px',width:38+'px',margin:3+'px',borderRadius:50+'px'}}/></Link>{k.firstname+' '+k.lastname}<p onClick={validator(k._id)?()=>{unfollowme(k._id)}:()=>{followme(k._id)}} style={{marginLeft:15+'px',color:'blue',fontSize:14+'px',cursor:'pointer'}}>{validator(k._id)?"UnFollow":"Follow"}</p></div>
        })}
        </div>
    </div>
  )
}
export default Allies