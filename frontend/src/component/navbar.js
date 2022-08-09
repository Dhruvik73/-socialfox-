import React, { useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {BsPersonCircle} from 'react-icons/bs'
import {FiLogIn} from 'react-icons/fi'
import {BiHomeAlt,BiSearchAlt2} from 'react-icons/bi'
import {FaUserFriends} from 'react-icons/fa'
import {MdOutlineAddToPhotos} from 'react-icons/md'
import {AiOutlineLogout} from 'react-icons/ai'
function Navbar() {
  let a=localStorage.getItem('login')
  const [login, setlogin] = useState()
  useEffect(() => {
    setTimeout(()=>{
      verify()
    },100)
  }, [login])
  const verify=()=>{
    if(a==='1'){
      setlogin(true)
      }
      else{
        setlogin(false)
      }
  }
  const logout=()=>{
    setlogin(false)
    localStorage.removeItem('login')
    localStorage.removeItem('token')
  }
  return (
    <>
    <div className='fixed-top' style={{backgroundColor:'#e1eedd',width:80+'vw',marginLeft:10+'vw',borderRadius:100+'px'}}>
        <div className='d-flex justify-content-end'>
            <ul style={{marginRight:2+'vw',marginTop:8+'px'}}>
            {login&&<span style={{fontSize:25+'px',color:'#157ad0f5',marginRight:15+'px'}}><Link to={`/profile/${localStorage.getItem('id')}`}><BsPersonCircle/></Link><span onClick={logout} style={{fontSize:25+'px',color:'#157ad0f5',marginLeft:25+'px'}}><Link to={'/login'} style={{textDecoration:'none'}}><AiOutlineLogout/> </Link></span><Link to={'/'}><span className='badge badge-light' style={{fontSize:25+'px',color:'rgb(9 83 147 / 96%)'}}><BiHomeAlt/></span></Link>
                <Link to={'/allies'}><span className='badge badge-light' style={{fontSize:24+'px',color:'rgb(12 97 169 / 96%)'}}><FaUserFriends/></span></Link>
                <Link to={'/search'}><span className='badge badge-light' style={{fontSize:23+'px',color:'rgb(35 114 180 / 96%)'}}><BiSearchAlt2/></span></Link>
                <Link to={'/addpost'}><span className='badge badge-light' style={{fontSize:22+'px',color:'#157ad0f5'}}><MdOutlineAddToPhotos/></span></Link></span>}
            {!login&&<Link to={'/login'}><span style={{fontSize:25+'px',color:'#157ad0f5',marginRight:15+'px'}}><FiLogIn/></span></Link>}
            </ul>
        </div>
    </div>
</>
  )
}

export default Navbar;