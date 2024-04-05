import React, { useState } from 'react'
import {Link} from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function Register() {
    const [val, setval] = useState({fname:'',lname:'',email:'',password:'',cpassword:''})
    const submit = async () => {
      if(val.password.length>=8&&val.password==val.cpassword){const url = "http://localhost:5001/user/signup";
      const reqbody = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: val.email, password: val.password,firstname:val.fname,lastname:val.lname}),
      };
      const res = await fetch(url, reqbody);
      const result = await res.json();
      if (result.myuser) {
        localStorage.setItem("token", result.token);
        localStorage.setItem('id',result.myuser._id)
        toast.success("User Created Successfully 👍", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(()=>{
         window.location='/'
        },1500)
      }
      if (result.exist) {
        toast.warning("User Already Exist", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }}
      else{
        toast.warning("Your Passwords are Not Valid", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }); 
      }
    }
    const onchange=(e)=>(
    setval({...val,[e.target.name]:e.target.value})
    )
  return (
    <><section className="vh-100">
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
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="card" style={{borderRadius: 1+'rem'}}>
            <div className="row g-0">
              <div className="col-md-6 col-lg-5 d-none d-md-block">
                <img src='https://cdn.dribbble.com/users/1192832/screenshots/17542965/media/a25c8f616f42f8934462288c1965b1ed.png?compress=1&resize=450x338&vertical=top'
                  alt="login form" className="img-fluid" style={{borderRadius: 1+'rem',height:85+'vh'}}/>
              </div>
              <div className="col-md-6 col-lg-7 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">
  
                  <form>  
                    <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: 1+'px'}}>Create your account</h5>
                    <div className="form-outline mb-2">
                      <label className="form-label" htmlhtmlFor="fname" style={{marginRight:29+'vw'}} >First Name</label>
                      <input type="text" id="fname" name='fname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
                    <div className="form-outline mb-2">
                      <label className="form-label" htmlhtmlFor="lname" style={{marginRight:29+'vw'}} >Last Name</label>
                      <input type="text" id="lname" name='lname' onChange={onchange} className="form-control form-control-lg" />
                    </div>
  
                    <div className="form-outline mb-2">
                      <label className="form-label"htmlhtmlFor="form2Example17" style={{marginRight:28+'vw'}} >Email address</label>
                      <input type="email" id="form2Example17" name='email' onChange={onchange} className="form-control form-control-lg" />
                    </div>
  
                    <div className="form-outline mb-2">
                    <label className="form-label mr-8" style={{marginRight:30+'vw'}}  htmlhtmlFor="form2Example27">Password</label>
                      <input type="password" id="form2Example27" name='password' onChange={onchange} className="form-control form-control-lg"/>
                    </div>
                    <div className="form-outline mb-2">
                    <label className="form-label mr-8" style={{marginRight:26+'vw'}}  htmlhtmlFor="cpassowrd">Confirm Password</label>
                      <input type="password" id="cpassword" name='cpassword' onChange={onchange} className="form-control form-control-lg"/>
                    </div>
  
                    <div className="pt-1 mb-2">
                      <button className="btn btn-dark btn-lg btn-block" type="button" onClick={submit}>Register</button>
                    </div>
                    <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Already have an account? <Link to={'/login'}
                        style={{color:'#393f81'}}>Login here</Link></p>
                  </form>
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section></>
  )
}

export default Register