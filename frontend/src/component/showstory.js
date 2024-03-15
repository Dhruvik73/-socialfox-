import React, { useEffect ,useState} from 'react'
import { useLocation } from 'react-router'
import {FcNext,FcPrevious} from 'react-icons/fc'
function Showstory() {
    const location=useLocation()
    const id=location.pathname.slice(1)
    const[stories,setstories]=useState([])
    const [story, setstory] = useState([])
    const [length,setlength]=useState(0)
    const [user,setuser]=useState([])
    let [i,seti]=useState(0)
    const [view,setview]=useState([])
    useEffect(() => {
        getallstories()
    },[])
    useEffect(() => {
      getstories(i)
    }, [stories])
    
    const prev=()=>{
      if (i!==0) {
        seti(i-1)
        getstories(i-1)
      }
    }
    const next=()=>{
      if(i!==length-1){
      seti(i+1)
      getstories(i+1)
      }
    }
    const getallstories=async()=>{
      const body={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:id})
      }
      const res=await fetch('http://localhost:5001/story/getstory',body)
      const result=await res.json()
      setstories(result.mystory)
      console.log(result.mystory)
    }
    const getstories=async(i)=>{
          let onestory=[]
          if(stories.length>0){
          onestory.push(stories[i])
          setlength(stories.length)
          setstory(onestory)
          let views=onestory[0].views
          const b={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({views:views})
          }
          const viewuser=await fetch('http://localhost:5001/story/getview',b)
          const myuser=await viewuser.json()
          setview(myuser.users)
          }
          if(id!==localStorage.getItem('id')){
            let views=onestory[0].views
            if(!views.includes(localStorage.getItem('id'))){
              views.push(localStorage.getItem('id'))
              const a={
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({id:onestory[0]._id,views:views})
              }
              await fetch('http://localhost:5001/story/addview',a)
            }
          }
          const mybody={
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({id:id})
          }
          const myres=await fetch('http://localhost:5001/user/fetchuser',mybody)
          const myresult=await myres.json()
          setuser([myresult.myuser])
    }
  return (
    <div className='container d-flex justify-content-center' style={{marginTop:150+'px'}}>
      <div>
      {user.map((k)=>{
        return <div style={{marginBottom:5+'px',fontSize:1.8+'vh'}} key={k._id}><img className='border border-secondary' src={k.profilephoto?k.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:40+'px',margin:3+'px',borderRadius:50+'px'}}/> {k.firstname}  {k.lastname}</div>
      })}
     {story.length>0&&<div className='d-flex justify-content-center' style={{height:65+'vh',backgroundColor:'#f6f5f3',width:28+'vw',borderRadius:5+'px'}}>
      <div onClick={prev} style={{marginTop:30+'vh',marginRight:1+'vw',cursor:'pointer'}}>{i!==0&&<FcPrevious/>}</div>
            {story.map((k)=>{
                return  <video key={k._id} id='video' autoPlay='autoPlay' src={k.story} style={{height:55+'vh',width:20+'vw',borderRadius:5+'px',marginTop:20+'px'}}  controls></video>
            })}
            <div onClick={next} style={{marginTop:30+'vh',marginLeft:1+'vw',cursor:'pointer'}}>{i!==length-1&&<FcNext/>}</div>
            
      </div>}
      </div>
      {id===localStorage.getItem('id')&&<div>
      <p style={{marginLeft:50+'px',color:'blue'}}>{view.length} Views</p>
      <div style={{overflow:'hidden',width:31+'vh'}}>
      <div style={{marginLeft:5+'vh',overflowY:'auto',whiteSpace:'nowrap',flexWrap:'nowrap',height:65+'vh',width:30+'vh'}}>
      {view.map((k)=>{
        return <div style={{marginBottom:5+'px',fontSize:1.8+'vh'}} key={k._id}><img className='border border-secondary' src={k.profilephoto?k.profilephoto:'https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png'} alt="not load" style={{height:4+'vh',margin:3+'px',borderRadius:50+'px'}}/> {k.firstname}  {k.lastname}</div>
      })}
      </div>
      </div>
      </div>}
      </div>
  )
}

export default Showstory
