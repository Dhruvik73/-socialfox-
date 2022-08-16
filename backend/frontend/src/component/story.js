import React, { useState} from 'react'
import { useLocation } from 'react-router'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function Story() {
  const [video, setvideo] = useState(false)
  const [url,seturl]=useState([])
    const location=useLocation()
    const id=location.pathname.slice(7)
    const preview=()=>{
        var video=document.getElementById('video').files[0]
        if(document.getElementById('video').files[0].size<20000000){
          setvideo(true)
          setTimeout(() => {
            const reader=new FileReader()
            reader.readAsDataURL(video)
            reader.onload=(e)=>{
              document.getElementById('display').src=e.target.result
              seturl(e.target.result)
            }
      }, 100);
        }  
    }
    const add=async()=>{
      const array=[]
      array.push(url)
      const body={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id,story:array})
      }
      await fetch('http://localhost:5001/story/add',body)
      toast.success("Story Posted Successfully 👍", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
      <input type="file" className="form-control" accept="video/mp4,video/x-m4v,video/*" onChange={preview} id="video" style={{width:50+'vw',marginBottom:10+'px'}} />
      <button type="submit" style={{marginLeft:10+'px',marginBottom:10+'px'}} onClick={add} className='border-bottom border-primary btn btn-sm'>Add</button>
     </div>
     <div style={{marginTop:30+'px'}}><p style={{color:'red'}}>Note:- please upload video with length of less than 20 seconds</p><p>Preview</p>
     {video&&<video style={{height:30+'vh',width:30+'vw',margin:3+'px',borderRadius:20+'px'}} id='display' controls>
     </video>}
     </div>
    </div>
  )
}

export default Story
