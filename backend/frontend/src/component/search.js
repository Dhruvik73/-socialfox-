import React, { useState, useEffect } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
function Search() {
  const [search, setsearch] = useState('')
  const [followedUsers, setFollowedUsers] = useState([])
  const [unKnownUsers, setUnKnownUsers] = useState([])
  const [reload, setreload] = useState(1)
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
        body: JSON.stringify({ query: search, logedUser: localStorage.getItem('id') })
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
      body: JSON.stringify({ id: localStorage.getItem('id') })
    }
    const res = await fetch('http://localhost:5001/user/fetchuser', body)
    const result = await res.json()
    let following = result.myuser.following
    following.push(id)
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id'), detail: following })
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
    followers.push(localStorage.getItem('id'))
    const b = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, detail: followers })
    }
    await fetch('http://localhost:5001/user/follower', b)
    setreload(reload + 1)
  }
  const unfollow = async (id) => {
    const body = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id') })
    }
    const res = await fetch('http://localhost:5001/user/fetchuser', body)
    const result = await res.json()
    let following = result.myuser.following
    following.splice(following.indexOf(id), 1)
    const mybody = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('id'), detail: following })
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
    followers.splice(followers.indexOf(localStorage.getItem('id')), 1)
    const b = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, detail: followers })
    }
    await fetch('http://localhost:5001/user/follower', b)
    setreload(reload + 1)
  }
  return (
    <div className='container' style={{ marginTop: 100 + 'px' }}>
      <div className="input-group">
        <div className="form-outline d-flex">
          <input onChange={onchange} id="search-input" style={{ height: 5 + 'vh', width: 40 + 'vw', marginLeft: 100 + 'px' }} type="text" className="form-control" placeholder='Search' />
          <button className="btn btn-outline-info btn-sm" onClick={submit} style={{ fontSize: 15 + 'px', marginLeft: 15 + 'px' }}><BiSearchAlt2 /></button>
        </div>
      </div>
      <div className='d-flex align-items-center flex-column mt-5'>
      {followedUsers.map((k) => {
        return <div key={k._id} className="d-flex justify-content-between w-50 align-items-center mt-2"><div className='round'><img className='border border-secondary w-100 h-100' src={k.profilephoto} alt="not load" /> </div>
          <span className='ms-3'>{k.firstname} {k.lastname}</span><button className='btn btn-outline-info btn-sm h-75 ms-3' onClick={() => { unfollow(k._id) }}>unFollow</button>
        </div>
      })}
      {unKnownUsers.map((k) => {
        return <div key={k._id} className="d-flex justify-content-between w-50 align-items-center mt-2"><div className='round'><img className='border border-secondary w-100 h-100' src={k.profilephoto} alt="not load" /> </div>
          <span className='ms-3'>{k.firstname} {k.lastname}</span><button className='btn btn-outline-info btn-sm h-75 ms-3' onClick={() => { follow(k._id) }}>Follow</button>
        </div>
      })}
      </div>
    </div>
  )
}

export default Search