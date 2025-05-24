import React, { useEffect, useRef, useState } from "react";
import "../component_CSS/story.css";
import StoryCard from "./StoryCard";
import UserProfileWithName from "./UserProfileWithName";
import { Link } from "react-router-dom";
function Showstory({ userId }) {
  const id = userId;
  const storyCountRef = useRef();
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  const [story, setStory] = useState([]);
  const [currentStoryCount, setCurrentStoryCount] = useState(0);
  const [totalStories, SetTotalStories] = useState(0);
  useEffect(() => {
    getallstories();
  }, [userId]);
  const getallstories = async () => {
    const body = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id,logedUserOrNot:logedUser===id}),
    };
    const res = await fetch("http://13.234.20.67:5001/story/getstory", body);
    const result = await res.json();
    setStory(result?.userStories);
    SetTotalStories(result?.totalStories);
  };
  const stopVideoOnClose = () => {
    const videoPlayer = document.getElementById("video");
    storyCountRef?.current?.setCurrentStoryCountTo0()
    setTimeout(() => {
    videoPlayer?.pause();
    }, 100);
    document.getElementById("play")?.classList?.remove("playPauseBtnShow");
    document.getElementById("pause")?.classList?.remove("playPauseBtnShow");
  };
  return (
    <div
      className="modal fade"
      id="storyModal"
      data-backdrop="static"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Stories
            </h5>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-center w-100">
              <div className="d-flex justify-content-center w-50">
                {story.length > 0 &&(
                  <StoryCard
                    ref={storyCountRef}
                    story={story}
                    totalStories={totalStories}
                    setParentStoryCount={setCurrentStoryCount}
                  ></StoryCard>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <div className="d-flex">
              {logedUser===userId&&story[currentStoryCount]?.views?.map((k) => {
                return <UserProfileWithName user={k} linkNeeded={true} key={k._id} nameBelow={true}></UserProfileWithName>
              })}
            </div>
            <button
              className="btn btn-outline-info btn-sm"
              data-dismiss="modal"
              onClick={stopVideoOnClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showstory;
