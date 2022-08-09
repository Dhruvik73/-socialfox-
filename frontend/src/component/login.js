import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function Login() {
  const [val, setval] = useState({ email: "", password: "" });
  const submit = async () => {
    const url = "http://localhost:5001/user/login";
    const reqbody = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: val.email, password: val.password }),
    };
    const res = await fetch(url, reqbody);
    const result = await res.json();
    if (result.myuser) {
      localStorage.setItem("token", result.token);
      localStorage.setItem('id',result.myuser._id)
      toast.success("Login Successfully 👍", {
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
      },2000)
    }
    if (result.pass) {
      toast.error("Wrong Details", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (result.login) {
      toast.warning("You need to SignUp first", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  };
  const onchange = (e) => {
    setval({ ...val, [e.target.name]: e.target.value });
  };
  return (
    <>
      <section className="vh-100">
        <div className="container py-5 h-100">
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
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: 1 + "rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://cdn.dribbble.com/users/1192832/screenshots/17542965/media/a25c8f616f42f8934462288c1965b1ed.png?compress=1&resize=450x338&vertical=top"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: 1 + "rem", height: 73 + "vh" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form>
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: 1 + "px" }}
                        >
                          Sign into your account
                        </h5>

                        <div className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="form2Example17"
                            style={{ marginRight: 28 + "vw" }}
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            id="form2Example17"
                            name="email"
                            onChange={onchange}
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label
                            className="form-label mr-8"
                            style={{ marginRight: 30 + "vw" }}
                            htmlFor="form2Example27"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="form2Example27"
                            name="password"
                            onChange={onchange}
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="pt-1 mb-4">
                        <button
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                            onClick={submit}
                          >
                          Login
                          </button>
                        </div>

                        <Link to={'/forgot'}><a className="small text-muted" href="#!">
                          Forgot password?
                        </a></Link>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Don't have an account?{" "}
                          <Link to={"/register"} style={{ color: "#393f81" }}>
                            Register here
                          </Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
