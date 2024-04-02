import React from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {AiOutlineLike,AiFillLike,AiOutlineDislike,AiFillDislike} from 'react-icons/ai' 

function Comment({ comments, bgColor, postId }) {
  const addComment = async () => {
    const comment = document.getElementById("userComment").value
    const userId = localStorage.getItem("id")
    if (comment) {
      const body = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postId, comment: comment,userId:userId })
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
      <div className="modal fade" id="commentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Comments</h5>
          </div>
          <div className="modal-body">
            <div class="mb-3">
              <label for="userComment" class="form-label">Post Your Comment</label>
              <textarea class="form-control" id="userComment" rows="2"></textarea>
              <button type="button" className="btn btn-outline-info btn-sm mt-2" onClick={addComment}>Post</button>
            </div>
            {comments.map((k) => {
              return <div className='userComment border mt-1 rounded' key={k._id}>
                  <div className='d-flex align-items-center justify-content-between'><div className='d-flex align-items-center'><div className='round ms-1 mt-1'><img className='w-100 h-100' src={k.user.profilephoto}/></div><span className='ms-2'>{k.user.firstname} {k.user.lastname}</span></div><div className='d-flex align-items-center'><div><AiOutlineLike /></div><div className='ms-1'><AiOutlineDislike /></div></div></div>
                  <div className='ms-5'>{k.comment}</div>
              </div>
            })}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-info btn-sm" data-dismiss="modal">Close</button>

          </div>
        </div>
      </div>
    </div></div>
  )
}

export default Comment