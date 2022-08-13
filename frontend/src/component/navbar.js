import React, { useState,useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {BsPersonCircle,BsPlus} from 'react-icons/bs'
import {FiLogIn} from 'react-icons/fi'
import {BiHomeAlt,BiSearchAlt2} from 'react-icons/bi'
import {FaUserFriends} from 'react-icons/fa'
import {MdOutlineAddToPhotos} from 'react-icons/md'
import {AiOutlineLogout} from 'react-icons/ai'
function Navbar() {
  const location=useLocation()
  let slug=location.pathname
  let a=localStorage.getItem('login')
  let id=localStorage.getItem('id')
  const [user,setuser]=useState({})
  const [login, setlogin] = useState()
  const [storyuser,setstoryuser]=useState([])
  useEffect(() => {
    setTimeout(()=>{
      verify()
    },100)
  }, [login])
  const verify=async()=>{
    if(a==='1'){
      setlogin(true)
      }
      else{
        setlogin(false)
      }
    const body={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:id})
    }
    const res=await fetch('http://localhost:5001/user/fetchuser',body)
    const result=await res.json()
    setuser(result.myuser)
    const myres=await fetch('http://localhost:5001/story/getuser',body)
    const myresult=await myres.json()
    setstoryuser(myresult.users)
  }
  const logout=()=>{
    setlogin(false)
    localStorage.removeItem('login')
    localStorage.removeItem('token')
  }
  return (
    <>
    <div className='fixed-top d-flex justify-content-between border-dark border-bottom' style={{width:100+'vw',backgroundColor:'white'}}>
      {slug==='/'?<div style={{overflow:'hidden',height:70+'px',marginLeft:30+'px'}}><div className='d-flex' style={{height:100+'px',overflowX:'auto',whiteSpace:'nowrap',flexWrap:'nowrap',width:50+'vw',marginTop:10+'px'}}>
      <div style={{position:'relative'}}><Link to={`/${user._id}`}><img className='border border-secondary' src={user.profilephoto?user.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:35+'px',margin:3+'px',borderRadius:100+'px'}}/></Link><Link to={`/story/${user._id}`}><span style={{position: 'absolute',top: 0+'px',right: 0+'px',display:'block',fontSize:17+'px',color:'blue',cursor:'pointer'}}><BsPlus/></span></Link><p style={{fontSize:10+'px'}}>Your Story</p></div>
      {storyuser.map((k)=>{
        if(user.following.includes(k._id)){
          return <div key={k._id} style={{position:'relative',marginLeft:5+'px'}}><Link to={`/${k._id}`}><img className='border border-secondary' src={k.profilephoto?k.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:35+'px',margin:3+'px',borderRadius:100+'px'}}/></Link><p style={{fontSize:10+'px'}}>{k.firstname.length>=5?k.firstname:k.firstname+" "+k.lastname}</p></div>
        }
        else{
          return null
        }
      })}
      </div>
      </div>
      :<div></div>}
        <div className='d-flex justify-content-end'>
            <ul style={{marginRight:2+'vw',marginTop:8+'px'}}>
            {login&&<span style={{fontSize:1.8+'vw',color:'#157ad0f5',marginRight:25+'px'}}><Link to={`allies/profile/${localStorage.getItem('id')}`}><BsPersonCircle/></Link><span onClick={logout} style={{fontSize:1.8+'vw',color:'#157ad0f5',marginLeft:25+'px'}}><Link to={'/login'} style={{textDecoration:'none'}}><AiOutlineLogout/> </Link></span><Link to={'/'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(9 83 147 / 96%)'}}><BiHomeAlt/></span></Link>
                <Link to={'/allies'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(12 97 169 / 96%)'}}><FaUserFriends/></span></Link>
                <Link to={'/search'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'rgb(35 114 180 / 96%)'}}><BiSearchAlt2/></span></Link>
                <Link to={'/addpost'}><span className='badge badge-light' style={{fontSize:1.8+'vw',color:'#157ad0f5'}}><MdOutlineAddToPhotos/></span></Link></span>}
            {!login&&<Link to={'/login'}><span style={{fontSize:1.8+'vw',color:'#157ad0f5',marginRight:25+'px'}}><FiLogIn/></span></Link>}
            </ul>
        </div>
    </div>
</>
  )
}

export default Navbar;