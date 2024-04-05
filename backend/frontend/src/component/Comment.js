import React, { useRef, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {AiOutlineLike,AiFillLike,AiOutlineDislike,AiFillDislike} from 'react-icons/ai' 
import MentionAllies from './MentionAllies';
import UserProfileWithName from './UserProfileWithName';

function Comment({ comments, bgColor, postId }) {
  const userId = localStorage.getItem("id")
  const mentioneAlliesRef=useRef()
  const [userRequested, setUserRequested] = useState(false)
  const addComment = async () => {
    const comment = document.getElementById("userComment").value
    if (comment) {
      const body = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postId, comment: comment,userId:userId,mentionedAllies:mentioneAlliesRef.current.getMentionedAllies() })
      }
      await fetch('http://localhost:5001/post/addComment', body).then((res) => res.json()).then(res => { 
        if(!res.error){
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
  }
  const addReply = async()=>{
    // const userReply=document.getElementById()
    const body = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })
    }
    await fetch('http://localhost:5001/post/addReply', body).then((res)=>res.json()).then((res)=>{console.log(res)})
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
              <button type="button" className="btn btn-outline-info btn-sm mt-2" onClick={addComment}>Post</button>
              <button type="button" className="btn btn-outline-info btn-sm mt-2 ms-2" data-target="#mentionAlliesModal" data-toggle="modal" data-dismiss="modal" onClick={()=>{setUserRequested(true)}}>Mention</button>
            </div>
            {comments.map((k) => {
              return <div className={`userComment border mt-1 rounded comment-${k.post}`} style={{backgroundColor:bgColor}} key={k._id}>
                  <div className='d-flex align-items-center justify-content-between'><UserProfileWithName user={k.user}></UserProfileWithName><div className='d-flex align-items-center me-1'><div><AiOutlineLike /></div><div className='ms-1'><AiOutlineDislike /></div></div></div>
                  <div className='ms-5 d-flex justify-content-between'><div>{k.comment}</div>{userId!==k.user._id&&<div className="d-flex justify-content-center align-items-center"><button type="button" className="btn btn-outline-info btn-sm h-75 w-75 d-flex justify-content-center align-items-center" onClick={addReply}>Reply</button></div>}</div>
              </div>
            })}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-info btn-sm" data-dismiss="modal">Close</button>

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
          <MentionAllies  userRequested={userRequested} ref={mentioneAlliesRef}></MentionAllies>
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