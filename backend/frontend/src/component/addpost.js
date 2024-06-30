import React, { useState} from 'react'
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { detectChangeOfPosts } from '../Actions/userIntrection';
import Post from './Post';
function Addpost() {
    const [des,setdes]=useState('')
    const nevigation=useNavigate();
    const dispatch=useDispatch();
    const state=useSelector(state=>state.userIntrection.payload)
    let id=localStorage.getItem('id')?localStorage.getItem('id'):0
    const [userPosts,setUserPosts]=useState([])
    const getUserPosts=async ()=>{
      const image=document.getElementById('image').files
      const imagePromises=[]
      for (let index = 0; index < image.length; index++) {
        imagePromises.push(getFilePromise(image[index]))
      }
      let images=await Promise.all(imagePromises);
    setUserPosts(images)
    }
    const getFilePromise=(image)=>{
      return new Promise((resolve,reject)=>{
        const reader=new FileReader()
        reader.readAsDataURL(image)
        reader.onload=(e)=>{resolve(e.target.result)}
        reader.onerror=(e)=>{reject(e)} 
      })
    }
const onchange=(e)=>{
  setdes(e.target.value)
}
const submit=async()=>{
   let mybody={
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:id,post:userPosts,des:des})
  }
  const res=await fetch('http://localhost:5001/post/add',mybody)
   const result= await res.json()
   if(!result.error){
    toast.success("Post Uploaded Successfully 👍", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    dispatch(detectChangeOfPosts());
    setTimeout(()=>{
      nevigation("/")
    },1800)
   }
   else{
    toast.warning(result.error, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
   }
}
  return (
    <div className='container' style={{marginTop:100+'px'}}>
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
    <div className=" d-flex upload border-bottom border-primary">
      <input type="file" className="form-control" accept='image/*' id="image" multiple onChange={getUserPosts} style={{width:50+'vw',marginBottom:10+'px'}} />
      <button type="button" style={{marginLeft:10+'px',marginBottom:10+'px'}} onClick={submit}  className='border-bottom border-primary btn btn-sm'>post</button>
     </div>
     <div className='row justify-content-center'>
     {userPosts.length>0&&<div className='mt-3 col-md-5 col-sm-12 border rounded postcard'><p className='mt-3'>Preview</p><div className='h-75 mt-4'><Post Identifier={0} posts={userPosts} type={"Preview"}></Post></div>
     </div>}
     {userPosts.length>0&&<div className='mt-3 col-md-5 col-sm-12'><p>description</p> <div className="form-outline mb-2">
                      <input type="text" onChange={onchange} id="des" name='des' className="form-control form-control-lg" />
                    </div></div>}</div>
    </div>
  )
}

export default Addpost