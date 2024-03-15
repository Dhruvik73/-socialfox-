import React, { useState,useEffect } from 'react'
import {AiOutlineLike,AiFillLike,AiOutlineDislike,AiFillDislike} from 'react-icons/ai'
import {FaComment} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
import '../component_CSS/home.css'
import ReactDOMServer from 'react-dom/server';
import SuggestedAllies from './suggestedAllies';
function Home() {
  const [page,setpage]=useState(5)
  const [post,setpost]=useState([])
  const [count,setcount]=useState(0)
  useEffect(() => {
    verify()
    fetchpost()
  },[])
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
    if(myresult.totalPost){
     setcount(myresult.totalPost)
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
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,userId:localStorage.getItem('id'),type:"like"})
        }
        await fetch('http://localhost:5001/post/like',body).then((res)=>res.json()).then((res)=>{
          if(typeof(res.count)=="number"){
           addLikeDislikebtns(id,"like",res.count);
          }
        })
        
  }
  const removelike=async(id)=>{
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,userId:localStorage.getItem('id'),type:"fillLike"})
        }
        await fetch('http://localhost:5001/post/like',body).then((res)=>res.json()).then((res)=>{
          if(typeof(res.count)=="number"){
            addLikeDislikebtns(id,"fillLike",res.count);
          }
        })
    
  }
  const adddislike=async(id)=>{
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,userId:localStorage.getItem('id'),type:"dislike"})
        }
        await fetch('http://localhost:5001/post/like',body).then((res)=>res.json()).then((res)=>{
          if(typeof(res.count)=="number"){
            addLikeDislikebtns(id,"dislike",res.count);
          }
        })
  }
  const removedislike=async(id)=>{
        const body={
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id:id,userId:localStorage.getItem('id'),type:"fillDislike"})
        }
        await fetch('http://localhost:5001/post/like',body).then((res)=>res.json()).then((res)=>{
          if(typeof(res.count)=="number"){
            addLikeDislikebtns(id,"fillDislike",res.count);
          }
        })
  }

  const addLikeDislikebtns = (id, type,count) => {
    var span, iconString, iconNode
    document.getElementById(`${type}-${id}`).remove()
    span = document.createElement("span")
    span.className = "likebtns";
    const parentDiv = document.getElementById(`likeBtns-${id}`);
    if (type === "like") { 
      // Render the icon component to a string
      iconString = ReactDOMServer.renderToString(<AiFillLike />);
      // Convert the string to a DOM node
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = iconString;
      iconNode = tempDiv.firstChild;
      span.appendChild(iconNode);
      span.onclick = ()=>{removelike(id);};
      span.id=`fillLike-${id}`
      parentDiv.prepend(span);
      document.getElementById(`likeCount-${id}`).innerText=count
    }
    else if (type === "fillLike") { 
      // Render the icon component to a string
      iconString = ReactDOMServer.renderToString(<AiOutlineLike />);
      // Convert the string to a DOM node
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = iconString;
      iconNode = tempDiv.firstChild;
      span.appendChild(iconNode);
      span.onclick = ()=>{addlike(id)};
      span.id=`like-${id}`
      parentDiv.prepend(span);
      document.getElementById(`likeCount-${id}`).innerText=count
    }
    else if (type === "dislike") { 
      // Render the icon component to a string
      iconString = ReactDOMServer.renderToString(<AiFillDislike />);
      // Convert the string to a DOM node
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = iconString;
      iconNode = tempDiv.firstChild;
      span.appendChild(iconNode);
      span.onclick = ()=>{removedislike(id)};
      span.id=`fillDislike-${id}`
      span.classList.add('ms-3')
      parentDiv.insertBefore(span,parentDiv.childNodes[1]);
      document.getElementById(`dislikeCount-${id}`).innerText=count
    }
    else if (type === "fillDislike") { 
      // Render the icon component to a string
      iconString = ReactDOMServer.renderToString(<AiOutlineDislike />);
      // Convert the string to a DOM node
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = iconString;
      iconNode = tempDiv.firstChild;
      span.appendChild(iconNode);
      span.onclick = ()=>{adddislike(id)};
      span.id=`dislike-${id}`
      span.classList.add('ms-3')
      parentDiv.insertBefore(span,parentDiv.childNodes[1]);
      document.getElementById(`dislikeCount-${id}`).innerText=count
    }

  }
  return (
    <div className='container'>
         <InfiniteScroll
          dataLength={post.length}
          next={fetchmoredata}
          hasMore={post.length!==count}
          style={{overflow:'unset'}}
          
        >
          <div className='d-flex justify-content-around row'>
         <div className='col-md-6'>
            {post.map((k)=>{
              return <div className='w-75 border rounded mt-5 postcard' key={k._id} style={{backgroundColor:k.bgColor}}>
                  <div className='d-flex align-items-center mt-2 ms-2 h-10'><div className='round'><Link to={`allies/profile/${k.userid}`}>
                    <img className='border border-secondary w-100 h-100' src={k.profile ? k.profile : 'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" /></Link>
                  </div><span className='ms-3'>{k.username}</span></div>
                  <div className='h-90'>
                    <div className='d-flex flex-column align-items-center justify-content-center h-100 mt-2'>
                    <div className='h-75 w-75 object-fit-contain'>
                      <img className='border rounded border-secondary w-100 h-100' id={k._id} alt="not load" src={require(`../images/${k.post}`)} />
                      </div>
                      <div className='w-75 h-25' id={`likeBtns-${k._id}`}>{k.like.includes(localStorage.getItem('id')) ? <span className='likebtns' id={`fillLike-${k._id}`} onClick={() => { removelike(k._id) }}><AiFillLike/></span> : '' }
                      {!k.like.includes(localStorage.getItem('id')) ? <span className='likebtns' id={`like-${k._id}`} onClick={() => { addlike(k._id) }}><AiOutlineLike /></span> : '' }
                      {k.dislike.includes(localStorage.getItem('id')) ? <span className='likebtns ms-3' id={`fillDislike-${k._id}`} onClick={() => { removedislike(k._id) }}><AiFillDislike /></span> : '' }
                      {!k.dislike.includes(localStorage.getItem('id')) ? <span className='likebtns ms-3' id={`dislike-${k._id}`} onClick={() => { adddislike(k._id) }}><AiOutlineDislike /></span> : '' }
                      <span className='likebtns ms-3'><Link to={`/comment/${k._id}`}><FaComment /></Link></span><br></br>
                      <span id={`likeCount-${k._id}`}>{k.like.length} </span> Likes <span id={`dislikeCount-${k._id}`}>{k.dislike.length} </span> disLikes {k.comment.length} comments <h6><Link to={`/comment/${k._id}`}>Show all</Link></h6>
                    </div>
                    </div>
                  </div>
                </div>
            })}
          </div>
          <div className='col-md-6' style={{ height: 400 + 'px'}}>
            <p style={{ color: 'gray' }}>Make More Allies 👍👍🤞 <Link to={'/allies'} style={{ color: 'blue', cursor: 'pointer', textDecoration: "none" }}>See All</Link></p>
            <SuggestedAllies></SuggestedAllies>
          </div>
        </div>
        </InfiniteScroll>
        </div>
  )
}

export default Home