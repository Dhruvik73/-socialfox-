import React, { useEffect ,useState} from 'react'
import {FcNext,FcPrevious} from 'react-icons/fc'
import UserProfileWithName from './UserProfileWithName'
import '../component_CSS/story.css'
function Showstory({userId}) {
    const id=userId;
    const [story, setStory] = useState([]);
    useEffect(() => {
        getallstories()
    },[userId])
    const getallstories=async()=>{
      const body={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id})
      }
      const res=await fetch('http://localhost:5001/story/getstory',body)
      const result=await res.json();
      setStory(result?.userStories)
    }
  return (
    <div className="modal fade" id="storyModal" data-backdrop="static" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-lg modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">Stories</h5>
        </div>
        <div className="modal-body">
        <div className='d-flex justify-content-center'>
     {story.length>0&&<div className='d-flex justify-content-center'>
            {story.map((k)=>{
                return  <video key={k._id} id='video' className='storyVideoPlayer' autoPlay='autoPlay' src={k.story[0]}></video>
            })}
            
      </div>}
      </div>
      </div>
      <div className="modal-footer">
              <button className="btn btn-outline-info btn-sm" data-dismiss="modal">Close</button>
            </div>
      </div>
    </div>
  </div>
  )
}

export default Showstory
