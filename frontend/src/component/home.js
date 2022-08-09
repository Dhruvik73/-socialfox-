import React, { useState,useEffect } from 'react'
import {AiOutlineLike,AiFillLike,AiOutlineDislike,AiFillDislike} from 'react-icons/ai'
import {FaComment} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
function Home() {
  let [like, setlike] = useState([])
  const [page,setpage]=useState(5)
  const [post,setpost]=useState([])
  const [count,setcount]=useState(0)
  useEffect(() => {
    verify()
    fetchpost()
  },[like])
  const verify=async()=>{
    if(localStorage.getItem('token')){
      const mybody={
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'token':localStorage.getItem('token')})
      }
      const res= await fetch('http://localhost:5001/user/verify',mybody)
      const result=await res.json()
      if(result.error){
        localStorage.setItem('login',2)
        window.location='/login'
      }
      if (result.myuser){
        localStorage.setItem('login',1)
      }
      if(result.login){
        localStorage.setItem('login',0)
        window.location='/register'
      }
      if(result.host){
        localStorage.setItem('login',2)
        window.location='/login'
      }
    }
    else{
      window.location='/login'
    }
    
  }
  const fetchpost=async()=>{
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({limit:0})
    }
    const myres=await fetch('http://localhost:5001/post/fetchpost',body)
    const myresult=await myres.json()
    if(myresult.allpost){
     setcount(myresult.allpost.length)
    }
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({limit:page})
    }
    const res=await fetch('http://localhost:5001/post/fetchpost',mybody)
    const result=await res.json()
    if(result.allpost){
     setpost(result.allpost)
    }
  }
  const fetchmoredata=async()=>{
    setpage(page+5)
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({limit:page+5})
    }
    const res=await fetch('http://localhost:5001/post/fetchpost',mybody)
    const result=await res.json()
    if(result.allpost){
     setpost(post.concat(result.allpost))
    }
  }
  const addlike=async(id)=>{
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const res=await fetch('http://localhost:5001/post/getpost',mybody)
    const result=await res.json()
    if(result.allpost.like){
      like=(result.allpost.like)
      setlike(result.allpost.like)
        like.push(localStorage.getItem('id'))
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,like:like})
        }
        await fetch('http://localhost:5001/post/like',body)
    }
    setpage(5)
  }
  const removelike=async(id)=>{
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const res=await fetch('http://localhost:5001/post/getpost',mybody)
    const result=await res.json()
    if(result.allpost.like){
      like=(result.allpost.like)
      setlike(result.allpost.like)
        like.splice(result.allpost.like.indexOf(localStorage.getItem('id')),1)
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,like:like})
        }
        await fetch('http://localhost:5001/post/like',body)
    }
    setpage(5)
  }
  const adddislike=async(id)=>{
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const res=await fetch('http://localhost:5001/post/getpost',mybody)
    const result=await res.json()
    if(result.allpost.dislike){
      like=(result.allpost.dislike)
      setlike(result.allpost.dislike)
        like.push(localStorage.getItem('id'))
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,dislike:like})
        }
        await fetch('http://localhost:5001/post/like',body)
    }
    setpage(5)
  }
  const removedislike=async(id)=>{
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const res=await fetch('http://localhost:5001/post/getpost',mybody)
    const result=await res.json()
    if(result.allpost.dislike){
      like=(result.allpost.dislike)
      setlike(result.allpost.dislike)
        like.splice(result.allpost.dislike.indexOf(localStorage.getItem('id')),1)
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,dislike:like})
        }
        await fetch('http://localhost:5001/post/like',body)
    }
    setpage(5)
  }
  return (
    <div className='container' style={{marginTop:100+'px'}}>
         <InfiniteScroll
          dataLength={post.length}
          next={fetchmoredata}
          hasMore={post.length!==count}
        >
          <div className='d-flex justify-content-around'>
         <div>
            {post.map((k)=>{
              return <div className='row' key={k._id} style={{marginLeft:60+'px',marginTop:20+'px'}}><div className='col-md-6 border rounded' style={{height:450+'px',width:35+'vw',backgroundColor:'#e1eedd'}}>
              <div style={{height:50+'px'}}><div><img className='border border-secondary' src={k.profile?k.profile:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:40+'px',margin:3+'px',borderRadius:50+'px'}}/>{k.username}</div></div>
              <div style={{height:350+'px',marginTop:3+'px'}}><div className='d-flex justify-content-center'><img className='border border-secondary' alt="not load" src={k.post} style={{height:40+'vh',width:20+'vw',margin:3+'px'}}/></div>
              <div style={{height:60+'px',marginTop:3+'px',color:'#157ad0f5'}}>{k.like.includes(localStorage.getItem('id'))?!k.dislike.includes(localStorage.getItem('id'))?<span onClick={()=>{removelike(k._id)}} style={{marginLeft:10+'px',fontSize:25+'px',cursor:'pointer'}}><AiFillLike/></span>:'':''}
              {!k.like.includes(localStorage.getItem('id'))?!k.dislike.includes(localStorage.getItem('id'))?<span onClick={()=>{addlike(k._id)}} style={{marginLeft:10+'px',fontSize:25+'px',cursor:'pointer'}}><AiOutlineLike/></span>:'':''}
              {k.dislike.includes(localStorage.getItem('id'))?!k.like.includes(localStorage.getItem('id'))?<span onClick={()=>{removedislike(k._id)}} style={{marginLeft:10+'px',fontSize:25+'px',cursor:'pointer'}}><AiFillDislike/></span>:'':''}{!k.dislike.includes(localStorage.getItem('id'))?!k.like.includes(localStorage.getItem('id'))?<span onClick={()=>{adddislike(k._id)}} style={{marginLeft:10+'px',fontSize:25+'px',cursor:'pointer'}}><AiOutlineDislike/></span>:'':''}<span  style={{marginLeft:10+'px',fontSize:25+'px',cursor:'pointer'}}><Link to={`/comment/${k._id}`}><FaComment/></Link></span>
                <p style={{marginLeft:5+"px"}}>{k.like.length} Likes {k.dislike.length} disLikes {k.comment.length} comments <h6 style={{marginLeft:5+"px",cursor:'pointer'}}><Link to={`/comment/${k._id}`} style={{textDecoration:'none'}}>Show all</Link></h6></p>
              </div>
              </div>
            </div></div>
            })}
            </div>
            <div className='col-md-3' style={{height:400+'px',width:30+'vw'}}>
            <p style={{color:'gray'}}>Make More Allies 👍👍🤞 <Link to={'/allies'} style={{color:'blue',cursor:'pointer',textDecoration:"none"}}>See All</Link></p>
            </div>
        </div>
        </InfiniteScroll>
        </div>
  )
}

export default Home