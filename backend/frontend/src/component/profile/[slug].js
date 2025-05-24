import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../../component_CSS/profile.css'
import logo from '../../images/logo.png'
import Post from '../Post';
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
    }, [profile,update,id])
    useEffect(() => {
      getallpost()
    }, [id])
    const onchange=(e)=>{
      setval({...val,[e.target.name]:e.target.value})
    }
    const getallpost=async()=>{
      const body={
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id})
      }
      const res=await fetch('http://13.234.20.67:5001/post/getuserpost',body)
      const result=await res.json()
      setpost(result.allpost)
    }
    const add=()=>{
      setprofile(false)
      const reader=new FileReader()
      const image=document.getElementById('image')?.files[0]
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
        await fetch('http://13.234.20.67:5001/user/updateuser',mybody)
        setupdate(true)
      }
    }
    const upload=async()=>{
      const reader=new FileReader()
      const image=document.getElementById('image')?.files[0]
      reader.readAsDataURL(image)
      reader.onload=(e)=>{
       myurl=e.target.result
      }
      const mybody={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'id':id,'url':myurl})
      }
      const res=await fetch('http://13.234.20.67:5001/user/profile',mybody)
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
      const res=await fetch('http://13.234.20.67:5001/user/fetchuser',mybody)
      const result=await res.json()
      seturl(result?.logedUser?.profilephoto)
      setuser(JSON.parse(JSON.stringify(result?.logedUser)))
    }
  return (
    <div className='container'>
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
       {profile&&update&&<div><div className="d-flex justify-content-around border-primary border-bottom align-items-center">
            <div className='roundProfile col-lg-5 col-md-5'>{id===localStorage.getItem('id')?<img className='w-100 h-100' id='display' onClick={()=>{setprofile(false)}} src={url?url:logo} alt='not found'/>:<img className='w-100 h-100' id='display' src={url?url:logo} alt='not found'/>}</div>

            <div className='col-lg-5 col-md-5'><p>{user.firstname+' '+user.lastname}</p>
            <div className='d-flex justify-content-between'><p>{post.length} Posts </p><Link to={'/allies'}>{user.length!==0?user.followers.length>=1000?user.followers.length/1000+' k':'':''}{user.length!==0?user.followers.length>=1000000?user.followers.length/1000000+' m':'':''}{user.length!==0?user.followers.length<1000?user.followers.length:'':''}  Followers</Link><Link to={'/allies'}>{user.length!==0?user.following.length>=1000?user.following.length/1000+' k':'':''}{user.length!==0?user.following.length>=1000000?user.following.length/1000000+' m':'':''}{user.length!==0?user.following.length<1000?user.following.length:'':''}  Following</Link></div>
            </div>
            {id==localStorage.getItem('id')?<button onClick={()=>{setupdate(false)}} className='btn btn-outline-info btn-sm col-md-1 h-25'>edit</button>:''}
        </div>
        <p>All Posts</p><div className='d-flex flex-column align-items-center'>
        {post.map((k,index)=>{
          return <div className='col-lg-4 col-md-6 col-sm-8 col-9 border rounded mt-5 postcard d-flex align-items-center' key={k._id} id={`${k._id}-postcard-${index}`} style={{backgroundColor:k.bgColor[0],height:350+'px'}}><div className='w-100 h-80'><Post posts={k.post} type={"Home"} Identifier={k._id} bgColors={k.bgColor} Rank={index}></Post></div></div>
        })}</div></div>}
                {!profile&&<div><div className='container'>
    <div className=" d-flex upload border-bottom border-primary">
      <input type="file" className="form-control" accept='image/*' onChange={add} id="image"/>
     <button type="submit" onClick={upload} className='border-bottom border-primary btn btn-sm'>upload</button>
     </div>
    </div></div>}
    {!update&&<div>
      <div className="form-outline mb-2">
                      <label className="form-label" htmlhtmlFor="fname" style={{marginRight:29+'vw'}} >First Name</label>
                      <input type="text" id="fname" name='fname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <div className="form-outline mb-2">
                      <label className="form-label" htmlhtmlFor="lname" style={{marginRight:29+'vw'}} >Last Name</label>
                      <input type="text" id="lname" name='lname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <button onClick={edit} style={{height:30+'px',borderColor:'blue'}} className='btn btn-sm'>edit</button>
      </div>}
    </div>
  )
}

export default Profile