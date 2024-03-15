import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
function Addpost() {
    const [des,setdes]=useState('')
    const [val, setval] = useState(false)
    let id=localStorage.getItem('id')
    const [myurl,setmyurl]=useState()
    const seturl=()=>{
      const image=document.getElementById('image').files[0]
      const reader=new FileReader()
      reader.readAsDataURL(image)
      reader.onload=(e)=>{
    document.getElementById('display').src=e.target.result   
    setmyurl(e.target.result)
  }
  setval(true)
    }
const onchange=(e)=>{
  setdes(e.target.value)
}
const submit=async()=>{
  let body={
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:id})
  }
  const myres=await fetch('http://localhost:5001/user/fetchuser',body)
   const myresult= await myres.json()
   let mybody={
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:id,post:myurl,des:des,username:myresult.myuser.firstname+" "+myresult.myuser.lastname,profile:myresult.myuser.profilephoto})
  }
  const res=await fetch('http://localhost:5001/post/add',mybody)
   const result= await res.json()
   if(result.mypost){
    setval(true)
    toast.success("Post Uploaded Successfully 👍", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(()=>{
    },1800)
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
      <input type="file" className="form-control" accept='image/*' id="image" onChange={seturl} style={{width:50+'vw',marginBottom:10+'px'}} />
      <button type="button" style={{marginLeft:10+'px',marginBottom:10+'px'}} onClick={submit}  className='border-bottom border-primary btn btn-sm'>post</button>
     </div>
     <div className='d-flex justify-content-around'>
     {val&&<div style={{marginTop:30+'px'}}><p>Preview</p><img id='display'className='border border-secondary' style={{height:30+'vh',margin:3+'px'}}/>
     </div>}<div style={{marginTop:30+'px'}}><p>description</p> <div className="form-outline mb-2">
                      <input type="text" onChange={onchange} id="des" name='des' className="form-control form-control-lg" />
                    </div></div></div>
    </div>
  )
}

export default Addpost