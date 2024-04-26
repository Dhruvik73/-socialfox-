import React, {useRef, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import MentionAllies from './MentionAllies';
import UserProfileWithName from './UserProfileWithName';
import { useDispatch, useSelector } from 'react-redux';
import { setLastviewedPost } from '../Actions/userIntrection';
import ReactDOMServer from 'react-dom/server'

function Comment({ comments, bgColor, postId, setComments }) {
  const userId = localStorage.getItem("id")
  const dispatch=useDispatch();
  const state=useSelector(state=>state.userIntrection.payload)
  const mentioneAlliesRef = useRef()
  const [userRequested, setUserRequested] = useState(false)
  const [currentComment, setCurrentComment] = useState(0)
  
  const addComment = async () => {
    const btn = document.getElementById('btnCMRP');
    const comment = document.getElementById("userComment")
    if (btn.innerText === "Post") {
      if (comment && comment.value.trim().length > 10) {
        const body = {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: postId, comment: comment.value.trim(), userId: userId, mentionedAllies: mentioneAlliesRef.current.getMentionedAllies() })
        }
        await fetch('http://localhost:5001/post/addComment', body).then((res) => res.json()).then(async res => {
          if (!res.error) {
            const body = {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ postId: postId, userId: userId })
            }
            await fetch('http://localhost:5001/post/getComments', body).then((res) => res.json()).then((res) => { setComments(res.comments); comment.value = ""; })

            //Clear all mentioned allies data from local array and reset user buttone text
            mentioneAlliesRef.current.clearMentionedAllies();

            toast.success(res.msg, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          }
          else {
            toast.warning(res.error, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          }
        })
      }
    }
    else {
      if (comment && comment.value.trim().length > 10) {
        addReply(currentComment, comment.value.trim())
        comment.value = "";
      }
    }
  }
  const addReply = async (commentId,reply) => {
    const body = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: reply,userId:userId,commentId:commentId,mentionedAllies:mentioneAlliesRef.current.getMentionedAllies()})
    }
    await fetch('http://localhost:5001/post/addReply', body).then((res)=>res.json()).then(async(res)=>{
      if(!res.error){

        //After reply added fetch comment so that reply reflect instantly
        const body = {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: postId, userId: userId })
        }
        await fetch('http://localhost:5001/post/getComments', body).then((res) => res.json()).then((res) => { setComments(res.comments);})

        //Clear all mentioned allies data from local array and reset user buttone text
        mentioneAlliesRef.current.clearMentionedAllies(); setCurrentComment(0);

        document.getElementById('btnCMRP').innerText = "Post"

        toast.success(res.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
      else{
        toast.warning(res.error, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    })
  }
  const addLike = async (id,type) =>{
    const body = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type:type,userId:userId,id:id})
    }
    await fetch('http://localhost:5001/post/commentlike', body).then((res)=>res.json()).then((res)=>{
     if(!res.error){
      const iconString=ReactDOMServer.renderToString(<AiFillHeart/>)
      const iconDiv=document.getElementById(`${id}-commentLike`);
      iconDiv.innerHTML=iconString;
      iconDiv.onclick=()=>{removeLike(id,type==="like"?"removeLike":"removeReplyLike")}
     }
    })
  }
  const removeLike = async (id,type) =>{
    const body = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type:type,userId:userId,id:id})
    }
    await fetch('http://localhost:5001/post/commentlike', body).then((res)=>res.json()).then((res)=>{
     if(!res.error){
      const iconString=ReactDOMServer.renderToString(<AiOutlineHeart/>)
      const iconDiv=document.getElementById(`${id}-commentLike`);
      iconDiv.innerHTML=iconString;
      iconDiv.onclick=()=>{addLike(id,type==="removeLike"?"like":"replyLike")};
     }
    })
  }
  return (
    <div>
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
      <div className="modal fade" id="commentModal" data-backdrop="static" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Comments</h5>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="userComment" className="form-label">Post Your Comment</label>
                <textarea className="form-control" id="userComment" rows="2"></textarea>
                <button type="button" className="btn btn-outline-info btn-sm mt-2" id='btnCMRP' onClick={() => { addComment() }}>Post</button>
                <button type="button" className="btn btn-outline-info btn-sm mt-2 ms-2" data-target="#mentionAlliesModal" data-toggle="modal" data-dismiss="modal" onClick={() => { setUserRequested(true) }}>Mention</button>
                {currentComment != 0 && <button type="button" className="btn btn-outline-info btn-sm mt-2 ms-2" id='btnCMRP' onClick={() => { mentioneAlliesRef.current.clearMentionedAllies(); setCurrentComment(0); document.getElementById('btnCMRP').innerText = "Post" }}>Cancle</button>}
              </div>
              {comments.map((k) => {
                return <div key={k._id}><div className={`userComment border mt-1 rounded comment-${k.post}`} style={{ backgroundColor: bgColor }}>
                  <div className='d-flex align-items-start justify-content-between'><UserProfileWithName user={k.user[0]} linkNeeded={true} funcNeeded={true}></UserProfileWithName><div className='like-btn me-2' style={{cursor:'pointer'}} id={`${k._id}-commentLike`}>{k.like?.includes(userId)?<AiFillHeart onClick={()=>{removeLike(k._id,'removeLike')}}/>:<AiOutlineHeart onClick={()=>{addLike(k._id,'like')}}/>}</div></div>
                  <div className='ms-5 d-flex justify-content-between'>
                  <div>{k.comment}</div>
                  <div className='d-flex' style={{height:20+'px'}}>
                  {k.mentionedallies.map((a)=>{
                    return <UserProfileWithName user={a} key={a._id} linkNeeded={true} funcNeeded={true}></UserProfileWithName>
                  })}
                  {userId !== k.user[0]._id && <div className="d-flex justify-content-center align-items-center"><button type="button" className="btn btn-outline-info mt-1 btn-sm w-75 d-flex justify-content-center align-items-center" onClick={() => { setCurrentComment(k._id); document.getElementById('btnCMRP').innerText = "Reply"; }}>Reply</button></div>}
                  </div>
                  </div>
                </div>
                <div className='ms-5'>
                {k.replies.map((r)=>{
                    return <div className={`userComment border mt-1 rounded comment-${k.post} ms-5`} style={{ backgroundColor: bgColor }} key={r._id}><div className='d-flex align-items-start justify-content-between'><UserProfileWithName user={r.user[0]} linkNeeded={true} funcNeeded={true}></UserProfileWithName><div className='like-btn me-2' style={{cursor:'pointer'}} id={`${r._id}-commentLike`}>{r.like?.includes(userId)?<AiFillHeart onClick={()=>{removeLike(r._id,'removeReplyLike')}}/>:<AiOutlineHeart onClick={()=>{addLike(r._id,'replyLike')}}/>}</div></div>
                    <div className='ms-5 d-flex justify-content-between'><div>{r.userReply}</div> <div className='d-flex' style={{height:20+'px'}}>
                  {r.replyMentionedAllies.map((a)=>{
                    return <UserProfileWithName user={a} key={a._id} linkNeeded={true} funcNeeded={true} ></UserProfileWithName>
                  })}</div></div>
                    </div>
                  })}
                  </div>
                </div>
              })}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-info btn-sm" data-dismiss="modal" onClick={() => { mentioneAlliesRef.current.clearMentionedAllies(); setCurrentComment(0); document.getElementById('btnCMRP').innerText = "Post"; dispatch(setLastviewedPost(state.posts,state.comments,state.postId,state.totalPosts,true))}}>Close</button>
              <input type="hidden" className="btn btn-outline-info btn-sm" data-dismiss="modal" id='closeModal' onClick={() => { mentioneAlliesRef.current.clearMentionedAllies(); setCurrentComment(0); document.getElementById('btnCMRP').innerText = "Post";}}></input>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" data-backdrop="static" id="mentionAlliesModal" aria-hidden="true" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Mention Allies</h5>
            </div>
            <div className="modal-body">
              <MentionAllies userRequested={userRequested} ref={mentioneAlliesRef}></MentionAllies>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-info btn-sm" data-target="#commentModal" data-toggle="modal" data-dismiss="modal">Back to Comments</button>
            </div>
          </div>
        </div>
      </div></div>
  )
}

export default Comment