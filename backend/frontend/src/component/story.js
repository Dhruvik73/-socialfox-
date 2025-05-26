import React, { useState} from 'react'
import { useLocation } from 'react-router'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import StoryCard from './StoryCard';
import '../component_CSS/story.css';
import videoTypes from '../enum/videoTypes';
function Story() {
  const [userStory,setUserStory]=useState([])
  const [storyType,setStoryType]=useState('')
    const location=useLocation()
    const id=location.pathname.slice(7)
    const preview=()=>{
        var video=document.getElementById('videoInput').files[0]
        if(document.getElementById('videoInput').files[0].size<20000000){
            const reader=new FileReader()
            reader.readAsDataURL(video)
            reader.onload=(e)=>{
              setUserStory(e.target.result)
              setStoryType(e.target.result.split('data:')[1]?.split(';')[0]);
            }
        }  
    }
    const addVideoStory=async()=>{
      if(videoTypes.includes(storyType)){
      document.getElementById('addBtn').disabled=true;
      const array=[]
      array.push(userStory)
      const body={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id,story:array,mediaType:'video'})
      }
      await fetch('http://65.0.19.137:5001/story/add',body).then((res)=>res.json()).then((res)=>{
        if(res.msg){
        toast.success(res.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else
      {
        toast.warning(res.error, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      document.getElementById('addBtn').disabled=false;
      })
    }
    }
  return (
    <div className='container d-flex justify-content-center align-items-center flex-column' style={{marginTop:100+'px'}}>
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
    <div className="d-flex upload border-bottom border-primary">
      <input type="file" className="form-control" accept="video/mp4,video/x-m4v,video/*" onChange={preview} id="videoInput" style={{width:50+'vw',marginBottom:10+'px'}} />
      <button type="submit" id='addBtn' style={{marginLeft:10+'px',marginBottom:10+'px'}} onClick={addVideoStory} className='btn btn-outline-info btn-sm'>Add</button>
     </div>
     <div className='storyPreview mt-5'>
     <StoryCard story={userStory} IsPreview={true}></StoryCard>
     </div>
    </div>
  )
}

export default Story
