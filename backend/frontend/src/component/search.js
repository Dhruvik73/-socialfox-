import React, { useState,useEffect } from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
function Search() {
    const [search, setsearch] = useState('')
    const [users,setusers]=useState([])
    const [reload,setreload]=useState(1)
    useEffect(() => {
      submit()
    }, [search,reload])
    
    const onchange=(e)=>{
         if(e.target.value.trim().replace(/\s/g,'').length>7){
           setsearch(e.target.value.trim().replace(/\s/g,'').slice(7))
         }
         else{
        setsearch(e.target.value.trim().replace(/\s/g,''))
         }
    }
    const submit=async()=>{
      if(search){
        const body={
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({query:search})
        }
        const res=await fetch('http://localhost:5001/user/search',body)
        const result=await res.json()
        setusers(result.users)
    }
    else{
        setusers([])
    }
  }
  const follow=async(id)=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:localStorage.getItem('id')})
    }
    const res=await fetch('http://localhost:5001/user/fetchuser',body)
    const result=await res.json()
    let following=result.myuser.following
    following.push(id)
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:localStorage.getItem('id'),detail:following})
    }
    await fetch('http://localhost:5001/user/allies',mybody)
    const userbody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const myres=await fetch('http://localhost:5001/user/fetchuser',userbody)
    const myresult=await myres.json()
    let followers=myresult.myuser.followers
    followers.push(localStorage.getItem('id'))
    const b={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id,detail:followers})
    }
    await fetch('http://localhost:5001/user/follower',b)
    setreload(reload+1)
  }
  const unfollow=async(id)=>{
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:localStorage.getItem('id')})
    }
    const res=await fetch('http://localhost:5001/user/fetchuser',body)
    const result=await res.json()
    let following=result.myuser.following
    following.splice(following.indexOf(id),1)
    const mybody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:localStorage.getItem('id'),detail:following})
    }
    await fetch('http://localhost:5001/user/allies',mybody)
    const userbody={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const myres=await fetch('http://localhost:5001/user/fetchuser',userbody)
    const myresult=await myres.json()
    let followers=myresult.myuser.followers
    followers.splice(followers.indexOf(localStorage.getItem('id')),1)
    const b={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id,detail:followers})
    }
    await fetch('http://localhost:5001/user/follower',b)
    setreload(reload+1)
  }
  return (
    <div className='container' style={{marginTop:100+'px'}}>
        <div className="input-group">
  <div className="form-outline d-flex">
    <input onChange={onchange} id="search-input" style={{height:5+'vh',width:40+'vw',marginLeft:100+'px'}} type="text" className="form-control" placeholder='Search' />
    <button className="btn btn-sm" onClick={submit} style={{color:'blue',fontSize:15+'px',borderColor:'blue',marginLeft:15+'px'}}><BiSearchAlt2/></button>
  </div>
</div>
{users.map((k)=>{
  if(k._id!==localStorage.getItem('id')){
  return  <div key={k._id} style={{height:50+'px',width:35+'vw',marginTop:20+'px',marginLeft:25+'vw'}}  className="results col-md-8">
  <div className='d-flex' style={{height:50+'px'}}><img className='border border-secondary' src={k.profilephoto} alt="not load" style={{height:40+'px',margin:3+'px',borderRadius:50+'px'}}/> <p style={{marginLeft:2+'vw',marginTop:8+'px',fontSize:14+'px'}}>{k.firstname} {k.lastname}</p> {!k.followers.includes(localStorage.getItem('id'))&&<p onClick={()=>{follow(k._id)}} style={{marginLeft:15+'vw',marginTop:8+'px',color:'blue',fontSize:14+'px',cursor:'pointer'}}>Follow</p>}{k.followers.includes(localStorage.getItem('id'))&&<p onClick={()=>{unfollow(k._id)}} style={{marginLeft:15+'vw',marginTop:8+'px',color:'blue',fontSize:14+'px',cursor:'pointer'}}>unFollow</p>}</div>
  </div>
}
else{
  return <div></div>
}})}
</div>
  )
}

export default Search