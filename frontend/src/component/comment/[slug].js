import React, { useEffect,useState} from 'react'
import { useLocation } from 'react-router-dom'
function Slug() {
  const location=useLocation();
  let i=0
  const [post,setpost]=useState({})
  const [val,setval]=useState('')
  const slug=location.pathname.slice(9)
  let [com,setcom]=useState([])
  const [comment,setcomment]=useState([])
  useEffect(() => {
    getpost()
  }, [com])
  const onchange=(e)=>{
    setval(e.target.value)
  }
  const getpost=async()=>{
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:slug})
    }
    const res=await fetch('http://localhost:5001/post/getpost',body)
    const result=await res.json()
    setpost(result.allpost)
    setcomment(result.allpost.comment)
  }
  const addcomment=async()=>{
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:localStorage.getItem('id')})
    }
    const myres=await fetch('http://localhost:5001/user/fetchuser',mybody)
    const myresult=await myres.json()
    com=post.comment
    com.push({photo:myresult.myuser.profilephoto,name:myresult.myuser.firstname+" "+myresult.myuser.lastname,comment:val})
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:slug,comment:com})
    }
    const res=await fetch('http://localhost:5001/post/comment',body)
    const result=await res.json()
      setcom(result)
  }
  return (
    <div className='container' style={{marginTop:100+'px'}}>
        <div className='row' style={{marginLeft:100+'px'}}>
            <div className='col-md-6 border rounded' style={{height:500+'px',width:35+'vw',backgroundColor:post.bgColor}}>
              <div className='d-flex align-items-center mt-2'><div className='round'><img className='border border-secondary w-100 h-100' src={post.profile?post.profile:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load"/></div><span className='ms-3'>{post.username}</span></div>
              {post.post?<div style={{height:350+'px',marginTop:3+'px'}}><div className='d-flex justify-content-center'><img className='border border-secondary' alt="not load" src={require(`../../images/${post.post}`)} style={{height:350+'px',width:25+'vw',margin:3+'px'}}/></div></div>:""}
              <p style={{marginTop:25+'px'}}>description: {post.description}</p>
            </div>
            <div className="col-md-4">
            <label htmlFor="post">Comment</label>
            <div className="form-group d-flex">
  <textarea onChange={onchange} className="form-control" id="post" rows="1"></textarea><button style={{marginLeft:5+'px',color:'#157ad0f5'}} onClick={addcomment} className='btn btn-sm'>comment</button>
</div>
            </div>
        </div>
        <div className='row' style={{width:30+'vw',marginLeft:100+'px',marginTop:30+'px'}}>
            <div className='d-flex align-items-center'><div className='round'><img className='border border-secondary w-100 h-100' src={post.profile} alt="not load"/></div>
            <span className='ms-3'>{post.username}</span>
            </div>
           {comment.map((k)=>{
            i=i+1
            return <div key={i}>
            <div style={{height:50+'px',marginTop:20+'px'}}><div className='round'><img className='border border-secondary w-100 h-100' src={k.photo} alt="not load"/> {k.name} </div><span className='comment'> comment: {k.comment}</span></div>  
            </div>
           })}
            </div>
    </div>
  )
}
export default Slug