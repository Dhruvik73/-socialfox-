import React, { useState,useEffect, useDeferredValue } from 'react'
import {AiOutlineLike,AiFillLike,AiOutlineDislike,AiFillDislike} from 'react-icons/ai'
import {FaComment} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroll-component";
import '../component_CSS/home.css'
import { setLastviewedPost } from '../Actions/userIntrection';
import ReactDOMServer from 'react-dom/server';
import SuggestedAllies from './suggestedAllies';
import Post from './Post';
import Comment from './Comment';
import UserProfileWithName from './UserProfileWithName';
import { useDispatch, useSelector } from 'react-redux';
function Home() {
  const dispatch=useDispatch();
  const state=useSelector(state=>state.userIntrection.payload)
  const [page,setpage]=useState(5);
  const [post,setpost]=useState([]);
  const userId=localStorage.getItem("id");
  const [count,setcount]=useState(0);
  const [postId,setPostId]=useState(0);
  const [comments,setComments]=useState([]);
  const [bgColor,setBgColor]=useState('');
  const defferedComments=useDeferredValue(comments);
  useEffect(() => {
    fetchpost();
    checkUserLastVisitedPost()
  },[])
  const fetchpost=async()=>{
    if(!(state.posts)){
    const userId=localStorage.getItem('id')
    const mybody={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({limit:page,userId:userId})
    }
    const res=await fetch('http://localhost:5001/post/fetchpost',mybody)
    const result=await res.json()
    if(result.allpost){
     setpost(result.allpost)
     setcount(result.totalPost)
     dispatch(setLastviewedPost(result.allpost,[],0,result.totalPost,false))
    }
  }
  }
  const fetchmoredata=async()=>{
    if((state.posts && state.posts.length < state.totalPosts)){
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
     dispatch(setLastviewedPost(post.concat(result.allpost),[],0,count,false))
    }
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

  const getComments=async(currentPostId,bgColor)=>{
      if(currentPostId!==postId){
      setBgColor(bgColor)
      setPostId(currentPostId)
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({postId:currentPostId,userId:userId})
    }
    await fetch('http://localhost:5001/post/getComments',body).then((res)=>res.json()).then((res)=>{setComments(res.comments);dispatch(setLastviewedPost(post,res.comments,currentPostId,count,false))})
  }
  }

  const checkUserLastVisitedPost=()=>{
    if((state.posts && state.comments)){
        setpost(state.posts);
        setBgColor(state?.posts[0]?.bgColor[0]);
        setComments(state.comments);
        setPostId(state.postId);
        const currentPage=Math.floor(state.posts.length/5)*5;
        setpage(currentPage);
        if(state.comments.length>0 && !state.isCloseBtnClicked){
        const btn=document.getElementById('openCommentModalBTN');
        if(btn){
        btn.click();
        }
      }
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
         <div className='col-lg-4 col-md-6 col-sm-8 d-flex align-items-center flex-column'>
            {post.map((k,index)=>{
              return <div className='w-100 border rounded mt-5 postcard' key={k._id} id={`${k._id}-postcard-${index}`} style={{backgroundColor:k.bgColor[0]}}>
              <div className='mt-2 ms-2 h-10'><UserProfileWithName user={k.user} linkNeeded={true}></UserProfileWithName></div>
                  <div className='h-90'>
                    <div className='d-flex flex-column align-items-center justify-content-center h-100 mt-1'>
                    <div className='h-75 w-100'>
                      <Post posts={k.post} type={"Home"} Identifier={k._id} bgColors={k.bgColor} Rank={index}></Post>
                      </div>
                      <div className='w-75 h-25' id={`likeBtns-${k._id}`}>{k.like.includes(localStorage.getItem('id')) ? <span className='likebtns' id={`fillLike-${k._id}`} onClick={() => { removelike(k._id) }}><AiFillLike/></span> : '' }
                      {!k.like.includes(localStorage.getItem('id')) ? <span className='likebtns' id={`like-${k._id}`} onClick={() => { addlike(k._id) }}><AiOutlineLike /></span> : '' }
                      {k.dislike.includes(localStorage.getItem('id')) ? <span className='likebtns ms-3' id={`fillDislike-${k._id}`} onClick={() => { removedislike(k._id) }}><AiFillDislike /></span> : '' }
                      {!k.dislike.includes(localStorage.getItem('id')) ? <span className='likebtns ms-3' id={`dislike-${k._id}`} onClick={() => { adddislike(k._id) }}><AiOutlineDislike /></span> : '' }
                      <span className='likebtns ms-3'><Link to={`/comment/${k._id}`}><FaComment /></Link></span><br></br>
                      <span id={`likeCount-${k._id}`}>{k.like.length} </span> Likes <span id={`dislikeCount-${k._id}`}>{k.dislike.length} </span> disLikes {k.commentsCount} comments <br></br><button type="button" className="btn btn-info btn-sm mt-1" data-toggle="modal" onClick={()=>{getComments(k._id,k.bgColor[0])}} data-target="#commentModal">
  Show All
</button>
                    </div>
                    </div>
                  </div>
                </div>
            })}
            <Comment postId={postId} comments={defferedComments} bgColor={bgColor} setComments={setComments}></Comment>
          </div>
          <div className='col-lg-4 col-md-6 col-sm-8 position-sticky d-flex align-items-center flex-column' style={{ top:100+'px'}}>
            <p style={{ color: 'gray' }}>Make More Allies 👍👍🤞 <Link to={'/allies'} style={{ color: 'blue', cursor: 'pointer', textDecoration: "none" }}>See All</Link></p>
            <SuggestedAllies></SuggestedAllies>
          </div>
        </div>
        </InfiniteScroll>
        <input type="hidden" className="btn btn-info btn-sm mt-1" id='openCommentModalBTN' data-toggle="modal" data-target="#commentModal"></input>
        </div>
  )
}

export default Home