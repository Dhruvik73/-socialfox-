import React, { useState, useEffect } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import UserProfileWithName from './UserProfileWithName'
function Search({setToUser,setToUserDetails,setOldCHats,toUser}) {
  const [search, setsearch] = useState('')
  const [followedUsers, setFollowedUsers] = useState([])
  const [unKnownUsers, setUnKnownUsers] = useState([])
  const [reload, setreload] = useState(1)
  const logedUser=localStorage.getItem('id')?localStorage.getItem('id'):0;
  useEffect(() => {
    submit()
  }, [search, reload])

  const onchange = (e) => {
    if (e.target.value.trim().replace(/\s/g, '').length > 7) {
      setsearch(e.target.value.trim().replace(/\s/g, '').slice(7))
    }
    else {
      setsearch(e.target.value.trim().replace(/\s/g, ''))
    }
  }
  const submit = async () => {
    if (search) {
      const body = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search, logedUser: localStorage.getItem('id')?localStorage.getItem('id'):0 })
      }
      const res = await fetch('http://localhost:5001/user/search', body)
      const result = await res.json()
      setFollowedUsers(result.followedUsers)
      setUnKnownUsers(result.unKnownUsers)
    }
    else {
      setFollowedUsers([])
      setUnKnownUsers([])
    }
  }
  const follow = async (id) => {
    const body = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id')?localStorage.getItem('id'):0 })
    }
    const res = await fetch('http://localhost:5001/user/fetchuser', body)
    const result = await res.json()
    let following = result.logedUser.following
    following.push(id)
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id')?localStorage.getItem('id'):0, detail: following })
    }
    await fetch('http://localhost:5001/user/allies', mybody)
    const userbody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }
    const myres = await fetch('http://localhost:5001/user/fetchuser', userbody)
    const myresult = await myres.json()
    let followers = myresult.logedUser.followers
    followers.push(localStorage.getItem('id')?localStorage.getItem('id'):0)
    const b = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, detail: followers })
    }
    await fetch('http://localhost:5001/user/follow', b)
    setreload(reload + 1)
  }
  const unfollow = async (id) => {
    const body = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id')?localStorage.getItem('id'):0 })
    }
    const res = await fetch('http://localhost:5001/user/fetchuser', body)
    const result = await res.json()
    let following = result.myuser.following
    following.splice(following.indexOf(id), 1)
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id')?localStorage.getItem('id'):0, detail: following })
    }
    await fetch('http://localhost:5001/user/allies', mybody)
    const userbody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }
    const myres = await fetch('http://localhost:5001/user/fetchuser', userbody)
    const myresult = await myres.json()
    let followers = myresult.myuser.followers
    followers.splice(followers.indexOf(localStorage.getItem('id')?localStorage.getItem('id'):0), 1)
    const b = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, detail: followers })
    }
    await fetch('http://localhost:5001/user/follower', b)
    setreload(reload + 1)
  }
  const openUserChat=async(user)=>{
    if(toUser!==user._id){
    await setOldCHats(logedUser,user._id)
    setToUser(user._id);
    localStorage.setItem('toUser',user._id);
    setToUserDetails(user);
    }
  }
  return (
    <div className='w-100'>
      <div className="input-group w-100">
        <div className="form-outline d-flex w-100">
          <input onChange={onchange} id="search-input" type="text" className="form-control w-90" placeholder='Search' />
          <button className="btn btn-outline-info btn-sm w-10" onClick={submit} style={{ fontSize: 15 + 'px', marginLeft: 15 + 'px' }}><BiSearchAlt2 /></button>
        </div>
      </div>
      <div className='d-flex align-items-center flex-column mt-2'>
      {followedUsers.map((k) => {
        return <div key={k._id} className="d-flex justify-content-between w-100 align-items-center mt-2"><div className='cursor-pointer' onClick={()=>{openUserChat(k)}}><UserProfileWithName user={k} linkNeeded={true}></UserProfileWithName></div><button className='btn btn-outline-info btn-sm h-75 ms-3' onClick={() => { unfollow(k._id) }}>unFollow</button>
        </div>
      })}
      {unKnownUsers.map((k) => {
        return <div key={k._id} className="d-flex justify-content-between w-100 align-items-center mt-2"><div className='cursor-pointer' onClick={()=>{openUserChat(k)}}><UserProfileWithName user={k} linkNeeded={true}></UserProfileWithName></div><button className='btn btn-outline-info btn-sm h-75 ms-3' onClick={() => { follow(k._id) }}>Follow</button>
        </div>
      })}
      </div>
    </div>
  )
}

export default Search