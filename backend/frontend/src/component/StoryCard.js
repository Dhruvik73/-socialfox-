import React, { useEffect, useState } from "react";
import { FcPrevious, FcNext } from "react-icons/fc";
import { FaPlay, FaPause } from "react-icons/fa";

function StoryCard({ story, totalStories, IsPreview }) {
  const [currentStoryCount, setCurrentStoryCount] = useState(0);
  const [storyPlayed, setStoryPlayed] = useState(0);
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
    } else {
      setCurrentStoryCount((prev) => prev - 1);
    }
    document.getElementById("play").classList.remove("playPauseBtnShow");
    document.getElementById("pause").classList.remove("playPauseBtnShow");
  };
  const prev = () => {
    if (currentStoryCount > 0) {
      setCurrentStoryCount((prev) => prev - 1);
    } else {
      setCurrentStoryCount((prev) => prev);
    }
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
            ></video>
            <div class="progress mt-1" style={{width:290+'px',height:5+'px'}}>
  <div class="progress-bar progress-bar-striped bg-info" style={{width:`${storyPlayed}`+'%'}} role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
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
    </>
  );
}

export default StoryCard;
