import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function Profile() {
  const [profile, setprofile] = useState(true)
  const [url, seturl] = useState('')
  const[user,setuser]=useState([])
  const[update,setupdate]=useState(true)
  const [val, setval] = useState({fname:'',lname:''})
  const [post,setpost]=useState([])
  let[myurl,setmyurl]=useState()
    const location=useLocation()
    const id=location.pathname.slice(9)
    useEffect(() => {
      reload()
    }, [profile,update])
    useEffect(() => {
      getallpost()
    }, [])
    const onchange=(e)=>{
      setval({...val,[e.target.name]:e.target.value})
    }
    const getallpost=async()=>{
      const body={
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id})
      }
      const res=await fetch('http://localhost:5001/post/getuserpost',body)
      const result=await res.json()
      setpost(result.allpost)
    }
    const add=()=>{
      setprofile(false)
      const reader=new FileReader()
      const image=document.getElementById('image').files[0]
      reader.readAsDataURL(image)
      reader.onload=(e)=>{
       setmyurl(e.target.result)
      }
    }
    const edit=async()=>{
      if(val.fname.length>=3&&val.lname.length>=3){
        const mybody={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({'id':id,'firstname':val.fname,'lastname':val.lname})
        }
        await fetch('http://localhost:5001/user/updateuser',mybody)
        setupdate(true)
      }
    }
    const upload=async()=>{
      setprofile(false)
      const reader=new FileReader()
      const image=document.getElementById('image').files[0]
      reader.readAsDataURL(image)
      reader.onload=(e)=>{
       myurl=e.target.result
      }
      const mybody={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'id':id,'url':myurl})
      }
      const res=await fetch('http://localhost:5001/user/profile',mybody)
      const result=await res.json()
      if(result.myuser.acknowledged){
        toast.success("Profile Photo Updated Successfully 👍", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(()=>{
          setprofile(true)
        },1400)
    }
    }
    const reload=async()=>{
      const mybody={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'id':id})
      }
      const res=await fetch('http://localhost:5001/user/fetchuser',mybody)
      const result=await res.json()
      seturl(result.myuser.profilephoto)
      setuser(JSON.parse(JSON.stringify(result.myuser)))
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
       {profile&&update&&<div><div style={{height:110+'px'}} className="d-flex justify-content-around  border-primary border-bottom">
            <div><img id='display' onClick={upload} style={{height:95+'px',width:90+'px',borderRadius:100+'px',cursor:'pointer'}} src={url?url:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt='not found'/></div>
            <div><p style={{color:'#6a6aed'}}>{user.firstname+' '+user.lastname}</p>
            <div className='d-flex justify-content-between'><p style={{marginRight:5+'px',color:'orange'}}>{post.length} Posts </p><Link to={'/allies'} style={{color:'blue',marginRight:5+'px',cursor:'pointer',textDecoration:"none"}}>{user.length!==0?user.followers.length>=1000?user.followers.length/1000+' k':'':''}{user.length!==0?user.followers.length>=1000000?user.followers.length/1000000+' m':'':''}{user.length!==0?user.followers.length<1000?user.followers.length:'':''}  Followers</Link><Link style={{marginRight:5+'px',color:'green',cursor:'pointer',textDecoration:'none'}} to={'/allies'}>{user.length!==0?user.following.length>=1000?user.following.length/1000+' k':'':''}{user.length!==0?user.following.length>=1000000?user.following.length/1000000+' m':'':''}{user.length!==0?user.following.length<1000?user.following.length:'':''}  Following</Link></div>
            </div>
            <button onClick={()=>{setupdate(false)}} style={{height:30+'px',borderColor:'blue'}} className='btn btn-sm'>edit</button>
        </div>
        <p style={{marginLeft:25+'vw',marginTop:50+'px',color:'purple'}}>All Posts</p>
        {post.map((k)=>{
          return  <div key={k._id} className='row' style={{marginLeft:25+'vw',marginTop:50+'px'}}>
          <div className='col-md-6 border rounded' style={{height:400+'px',width:35+'vw',backgroundColor:'ButtonFace'}}>
          <div style={{height:350+'px',marginTop:3+'px'}}><div className='d-flex justify-content-center'><img className='border border-secondary' alt="not load" src={k.post} style={{height:350+'px',width:25+'vw',margin:3+'px',marginTop:20+'px'}}/></div></div>
              </div>
              <p>{k.description}</p>
              </div>
        })}</div>}
                {!profile&&<div><div className='container' style={{marginTop:100+'px'}}>
    <div className=" d-flex upload border-bottom border-primary">
      <input type="file" className="form-control" accept='image/*' onChange={add} id="image" style={{width:50+'vw',marginBottom:10+'px'}} />
     <button type="submit" style={{marginLeft:10+'px',marginBottom:10+'px'}} onClick={upload} className='border-bottom border-primary btn btn-sm'>upload</button>
     </div>
    </div></div>}
    {!update&&<div>
      <div className="form-outline mb-2">
                      <label className="form-label" htmlFor="fname" style={{marginRight:29+'vw'}} >First Name</label>
                      <input type="text" id="fname" name='fname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <div className="form-outline mb-2">
                      <label className="form-label" htmlFor="lname" style={{marginRight:29+'vw'}} >Last Name</label>
                      <input type="text" id="lname" name='lname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <button onClick={edit} style={{height:30+'px',borderColor:'blue'}} className='btn btn-sm'>edit</button>
      </div>}
    </div>
  )
}

export default Profile