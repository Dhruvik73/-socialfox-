import React from 'react'
import logo from '../images/logo.png'
function ErrorView() {
  return (
    <div className='container d-flex flex-column align-items-center justify-content-center'>
        <img src={logo} className='round'></img>
        <span>Opps! Something went wrong, Please try again.</span>
    </div>
  )
}

export default ErrorView