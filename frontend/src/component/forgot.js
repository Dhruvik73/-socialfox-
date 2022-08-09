import React,{useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function Forgot() {
    const [val, setval] = useState({email:'',password:''})
    const onchange=(e)=>{
        setval({...val,[e.target.name]:e.target.value})
    }
      const forgot=async()=>{
        const body={
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email:val.email,password:val.password})
        }
        const res=await fetch('http://localhost:5001/user/forgot',body)
        const result=await res.json()
        if(result.myuser){
            toast.success("Password Changed Successfully 👍", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
        }
        else{
            toast.warning("Enter Valid Email !", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
        }
      }
  return (
    <div>
        <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      <div className='container' style={{marginTop:100+'px',width:40+'vw'}}>
      <form>
      <div className="form-outline mb-2">
                      <label className="form-label" htmlFor="email" style={{marginRight:29+'vw'}} >Email</label>
                      <input type="email" autoComplete='username' id="fname" name='email' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <div className="form-outline mb-2">
                      <label className="form-label" htmlFor="password" style={{marginRight:29+'vw'}} >New Password</label>
                      <input autoComplete='current-password' type="password" id="lname" name='password' onChange={onchange} className="form-control form-control-lg" />
                      
                    </div>
                    </form>
                    <button onClick={forgot} style={{height:30+'px',color:'blue'}} className='btn btn-sm'>Forgot</button>
      </div>
    </div>
  )
}

export default Forgot
