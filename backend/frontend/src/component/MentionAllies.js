import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import UserProfileWithName from './UserProfileWithName';

const MentionAllies = forwardRef(({ userRequested }, ref) => {
    const logedUser = localStorage.getItem('id')?localStorage.getItem('id'):0 ? localStorage.getItem('id')?localStorage.getItem('id'):0 : 0;
    let mentionedAllies = [];
    const [Allies, setAllies] = useState([])
    useEffect(() => {
        if (userRequested) {
            getAllies()
        }
    }, [userRequested])
    const getAllies = async () => {
        const body = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logedUser })
        }
        await fetch('http://13.234.20.67:5001/user/getUserAllies', body).then((res) => res.json()).then((res) => {
            if (res.logedUserAllies) {
                setAllies(res.logedUserAllies)
            }
        })
    }
    const mentionAllie = (userId) => {
        const userAccess = document.getElementById(userId);
        if (userAccess.innerText === 'Mention') {
            mentionedAllies.push(userId);
            userAccess.innerText = 'Mentioned';
        }
        else {
            mentionedAllies.splice(mentionedAllies.indexOf(userId), 1);
            userAccess.innerText = 'Mention';
        }
    }

    useImperativeHandle(ref, () => ({
        getMentionedAllies: () => {
            return mentionedAllies;
        },
        clearMentionedAllies:()=>{
            mentionedAllies=[];
            var mentionButtons=document.getElementsByClassName('mn-btn')
            for (let index = 0; index < mentionButtons.length; index++) {
                mentionButtons[index].innerText='Mention';
            }
        }
    }))
    return (
        <div>{Allies.map((k) => {
            return <div key={k._id} className='d-flex justify-content-between align-items-center'><UserProfileWithName user={k}></UserProfileWithName><button id={k._id} onClick={() => { mentionAllie(k._id) }} className='btn btn-outline-info btn-sm mn-btn'>Mention</button></div>
        })}</div>
    )
})


export default MentionAllies