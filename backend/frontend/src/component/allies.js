import React, { useEffect } from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
      body:JSON.stringify({"id":localStorage.getItem('id')?localStorage.getItem('id'):0})
    }
    const myres= await fetch('http://13.234.20.67:5001/user/fetchuser',body)
    const myresult=await myres.json()
    setfollowing(myresult.logedUser?.following)
    setfollower(myresult.logedUser?.followers)
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({"id":localStorage.getItem('id')?localStorage.getItem('id'):0})
    }
    const res= await fetch('http://13.234.20.67:5001/user/allusers',mybody)
    const result=await res.json()
    if(result.users){
      if(myresult.logedUser?.following.length>0){
        let allies=[]
        let notallie=result.users
        for (let index = 0; index < myresult.logedUser?.following.length; index++) {
          allies.push(result.users.filter(user=>user._id==myresult.logedUser?.following[index])[0])
        }
        setfriend(allies)
        for (let index = 0; index < myresult.logedUser?.following.length; index++) {
          notallie=notallie.filter(user=>user._id!=myresult.logedUser?.following[index])
        }
        setval(notallie)
      }
      else{
        setval(result.users)
      }
    }
    
  }
  const followme =async(id) => {
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "logedUserId": localStorage.getItem('id')?localStorage.getItem('id'):0, 'toBeFollowed': id })
    }
    await fetch('http://13.234.20.67:5001/user/follow', mybody).then((res)=>(res.json())).then((res)=>{
      if(res.status){
        var followed=document.getElementById(id)
        var btn=document.getElementById(`${id}-btn`)
        btn.onclick=()=>{
          unfollowme(id);
        }
        btn.innerText='UnFollow';
        document.getElementById('allies').append(followed);
      }
      else{
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
  const unfollowme = async (id) => {
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "logedUserId": localStorage.getItem('id')?localStorage.getItem('id'):0, 'toBeUnFollowed': id })
    }
    await fetch('http://13.234.20.67:5001/user/unFollow', mybody).then((res)=>(res.json())).then((res)=>{
      if(!res.error){
        var unFollowed=document.getElementById(id)
        var btn=document.getElementById(`${id}-btn`)
        btn.onclick=()=>{
          followme(id);
        }
        btn.innerText='Follow';
        document.getElementById('suggested').append(unFollowed);
      }
      else{
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
  return (
    <div className='d-flex justify-content-center w-100 container'>
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
        <div className='col-md-5' id='allies'>
        <h6>Allies</h6>
        {friend.map((k)=>{
          return <div key={k._id} id={k._id} className='d-flex align-items-center mt-3'><Link to={`profile/${k._id}`}><div className='round'><img className='border border-secondary w-100 h-100' src={k.profilephoto?k.profilephoto:require('../images/fox.jpg')} alt="not load"/></div></Link><span className='ms-2'>{k.firstname+' '+k.lastname}</span><span className='followtxt ms-3' id={`${k._id}-btn`} onClick={validator(k._id)?()=>{unfollowme(k._id)}:()=>{followme(k._id)}}>{validator(k._id)?"UnFollow":"Follow"}</span></div>
        })}
        </div>
        <div className='col-md-5' id='suggested'>
        <h6>Suggested</h6>
        {val.map((k)=>{
          return <div key={k._id} id={k._id} className='d-flex align-items-center mt-3'><Link to={`profile/${k._id}`}><div className='round'><img className='border border-secondary w-100 h-100' src={k.profilephoto?k.profilephoto:require('../images/fox.jpg')} alt="not load"/></div></Link><span className='ms-2'>{k.firstname+' '+k.lastname}</span><span className='followtxt ms-3' id={`${k._id}-btn`} onClick={validator(k._id)?()=>{unfollowme(k._id)}:()=>{followme(k._id)}}>{validator(k._id)?"UnFollow":"Follow"}</span></div>
        })}
        </div>
    </div>
  )
}
export default Allies