import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";
import { FaPlay, FaPause } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const StoryCard=forwardRef(({ story, totalStories, IsPreview,setParentStoryCount },ref)=>{
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  const [currentStoryCount, setCurrentStoryCount] = useState(0);
  const [storyPlayed, setStoryPlayed] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState(story[currentStoryCount]?._id);
  useEffect(() => {
    addView();
  }, [story])
  
  const pausePlayStory = () => {
    const storyVideoPlayer = document.getElementById("video");
    if (storyVideoPlayer.paused) {
      storyVideoPlayer.play();
      document.getElementById("pause").classList.add("playPauseBtnShow");
      document.getElementById("play").classList.add("playPauseBtnHide");
      document.getElementById("play").classList.remove("playPauseBtnShow");
      setTimeout(() => {
        document.getElementById("pause").classList.add("playPauseBtnHide");
        document.getElementById("pause").classList.remove("playPauseBtnShow");
      }, 1500);
    } else {
      storyVideoPlayer.pause();
      document.getElementById("play").classList.add("playPauseBtnShow");
      document.getElementById("pause").classList.add("playPauseBtnHide");
      document.getElementById("pause").classList.remove("playPauseBtnShow");
    }
  };
  const next = () => {
    if (currentStoryCount < totalStories - 1) {
      setCurrentStoryCount((prev) => prev + 1);
      setParentStoryCount((prev) => prev + 1);
    } else {
      setCurrentStoryCount((prev) => prev - 1);
      setParentStoryCount((prev) => prev - 1);
    }
    setCurrentStoryId(story[currentStoryCount]?._id);
    addView();
    document.getElementById("play").classList.remove("playPauseBtnShow");
    document.getElementById("pause").classList.remove("playPauseBtnShow");
  };
  const prev = () => {
    if (currentStoryCount > 0) {
      setCurrentStoryCount((prev) => prev - 1);
      setParentStoryCount((prev) => prev - 1);
    } else {
      setCurrentStoryCount((prev) => prev);
      setParentStoryCount((prev) => prev);
    }
    setCurrentStoryId(story[currentStoryCount]?._id);
    addView();
    document.getElementById("play").classList.remove("playPauseBtnShow");
    document.getElementById("pause").classList.remove("playPauseBtnShow");
  };
  const calculateStoryPlayedAndSetProgress=()=>{
    const video=document.getElementById('video');
    if(video){
      if(!isNaN(video?.currentTime)&&!isNaN(video?.duration)){
      const videoPlayed=(video?.currentTime/video?.duration)*100;
        setStoryPlayed(videoPlayed);
      }
      else{
        setStoryPlayed(1);
      }
    }
  }
  const addView=async()=>{
    const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userId:logedUser,storyId:currentStoryId})
    }
    if(logedUser !== story[currentStoryCount]?.userId && !IsPreview){
    await fetch('http://13.234.20.67:5001/story/addview',body).then((res)=>res.json()).then((res)=>{
      if(res?.error){
      toast.error(res?.error, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    })
  }
  }
  useImperativeHandle(ref,()=>({
    setCurrentStoryCountTo0:()=>{
      setCurrentStoryCount(0);
      setParentStoryCount(0);
    },
    currentStoryCount
  }
  ))
  return (
    <>
      {IsPreview ? (
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="me-2"></div>
          <video
            className="storyVideoPlayer w-100"
            src={story}
            autoPlay
            id="video"
          ></video>
          <div className="ms-2"></div>
        </div>
      ) : (
        story?.length > 0 && (
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="me-2 w-25 d-flex justify-content-center">
              {currentStoryCount !== 0 && (
                <FcPrevious onClick={prev}></FcPrevious>
              )}
            </div>
            <div>
            <video
              className="storyVideoPlayer"
              onClick={pausePlayStory}
              src={require(`../storyVideos/${story[currentStoryCount]?.story[0]}`)}
              autoPlay
              id="video"
              onTimeUpdate={calculateStoryPlayedAndSetProgress}
              preload="auto"
            ></video>
            <div className="progress mt-1" style={{width:290+'px',height:5+'px'}}>
  <div className="progress-bar progress-bar-striped bg-info" style={{width:`${storyPlayed}`+'%'}} role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
</div>
            </div>
            <div onClick={pausePlayStory} id="play" className="playPauseBtn">
              <FaPlay></FaPlay>
            </div>
            <div id="pause" className="playPauseBtn" onClick={pausePlayStory}>
              <FaPause></FaPause>
            </div>
            <div className="ms-2 w-25 d-flex justify-content-center">
              {currentStoryCount < totalStories - 1 && (
                <FcNext onClick={next}></FcNext>
              )}
            </div>
          </div>
        )
      )}
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
    </>
  );
})

export default StoryCard;
