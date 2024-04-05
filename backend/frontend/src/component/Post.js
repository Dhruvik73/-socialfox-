import React, { useEffect, useState } from 'react'
import { FcNext, FcPrevious } from 'react-icons/fc'

function Post({ posts, type,Identifier,bgColors,Rank }) {
    const [imgCounter, setImgCounter] = useState(0)
    useEffect(() => {
        const image = document.getElementById(`img-${Identifier}`);
        if(type==="Preview"){
            image.src=posts[imgCounter] 
         }
         else{
         image.src = require(`../images/${posts[imgCounter]}`)
         }
    }, [])

    const getNewImage = (command) => {
        const postComments=document.getElementsByClassName(`comment-${Identifier}`)
        const image = document.getElementById(`img-${Identifier}`);
        if (command === "Next") {
            if (imgCounter < posts.length - 1) {
                setImgCounter(prev => prev + 1)
                if(type==="Preview"){
                   image.src=posts[imgCounter+1]
                }
                else{
                image.src = require(`../images/${posts[imgCounter+1]}`)
                document.getElementById(`${Identifier}-postcard-${Rank}`).style.backgroundColor=bgColors[imgCounter+1]
                }
            }
        }
        else {
            if (imgCounter > 0) {
                setImgCounter(prev => prev - 1)
                if(type==="Preview"){
                    image.src=posts[imgCounter-1] 
                 }
                 else{
                 image.src = require(`../images/${posts[imgCounter-1]}`)
                 document.getElementById(`${Identifier}-postcard-${Rank}`).style.backgroundColor=bgColors[imgCounter-1]
                 }
            }
        }
        for (let commentIndex = 0; commentIndex < postComments.length; commentIndex++) {
            const comment = postComments[commentIndex];
            comment.style.backgroundColor=document.getElementById(`${Identifier}-postcard-${Rank}`).style.backgroundColor
        }
    }
    return (
        <div className='w-100 h-100'>
            <div className='d-flex align-items-center justify-content-center h-100'>
                {imgCounter > 0 ? <div className='me-2 cursor w-5 d-flex justify-content-center' onClick={() => { getNewImage("Prev") }}><FcPrevious></FcPrevious></div> : <div className='me-2 w-5'></div>}
                <div className='h-100 w-90 object-fit-contain'>
                    <img className='border rounded border-secondary w-100 h-100 userPosts' id={`img-${Identifier}`} alt="not load" />
                </div>
                {imgCounter !== posts.length - 1 ? <div className='ms-2 cursor w-5 d-flex justify-content-center' onClick={() => { getNewImage("Next") }}><FcNext></FcNext></div> : <div className='ms-2 w-5'></div>}
            </div>
        </div>
    )
}

export default Post