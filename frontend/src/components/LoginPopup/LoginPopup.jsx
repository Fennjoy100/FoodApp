import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({ setShowLogin }) => {

  const [currState, setCurrState] = useState("Login")

  return (
    <div className='Login-popup'>
      <form className="login-popup-container">

        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input type="text" placeholder="Your name" required />
          )}

          <input type="email" placeholder="Your email" required />
          <input type="password" placeholder="Password" required />
        </div>

        <button>
          {currState === "Sign Up" ? "Create account" : "Login"}</button>
          <div className="login-popup-condition">
            <input type='checkbox' required/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, veritatis?</p>
          </div>
          {currState==="Login"?
         <p>Create a new accout? <span onClick={()=>setCurrState("Sign up")}>Click hear</span></p>
         :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login hear</span></p>   
        }
       
    
      </form>
    </div>
  )
}

export default LoginPopup
