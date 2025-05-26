import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function SuggestedAllies() {
  const [suggestedAllies,setSuggestedAllies]=useState([]);
  useEffect(() => {
    getSuggestedAllies();
  }, [])
  const followme =async(id) => {
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "logedUserId": localStorage.getItem('id')?localStorage.getItem('id'):0, 'toBeFollowed': id })
    }
    await fetch('http://65.0.19.137:5001/user/follow', mybody).then((res)=>(res.json())).then((res)=>{
      if(res.status){
        var btn=document.getElementById(`${id}-btn`)
        btn.onclick=()=>{
          unfollowme(id);
        }
        btn.innerText='UnFollow';
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
    await fetch('http://65.0.19.137:5001/user/unFollow', mybody).then((res)=>(res.json())).then((res)=>{
      if(!res.error){
        var btn=document.getElementById(`${id}-btn`)
        btn.onclick=()=>{
          followme(id);
        }
        btn.innerText='Follow';
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
  const getSuggestedAllies=async()=>{
    const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
    if(logedUser){
      const body={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:logedUser})
      }
      await fetch('http://65.0.19.137:5001/user/suggestedAllies',body).then((res)=>(res.json())).then((res)=>{setSuggestedAllies(res.suggestedAllies)})
    }
  }
  return (
    <div>
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
    {suggestedAllies.map((k)=>{
      return <div key={k._id} className='suggestedAlliesDiv'>
      <div key={k._id} id={k._id} className='d-flex align-items-center mt-3'><Link to={`profile/${k._id}`}><div className='round'><img className='border border-secondary w-100 h-100' src={k.profilephoto?k.profilephoto:require('../images/fox.jpg')} alt="not load"/></div></Link><span className='ms-2'>{k.firstname+' '+k.lastname}</span><span className='followtxt ms-3' onClick={()=>{followme(k._id)}} id={`${k._id}-btn`}>{"Follow"}</span></div>
      </div>
    })}
  </div>
  )
}

export default SuggestedAllies