import './RegisterPage.css'
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


function RegisterPage(){
    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistrationToggle] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    function submitRegistration(e) {
        e.preventDefault();
        
        client.post(
          "accounts/register",
          {
            email: email,
            username: username,
            password: password
          }
        ).then(function(res) {
          client.post(
            "accounts/login",
            {
              email: email,
              password: password
            }
          ).then(function(res) {
            setCurrentUser(true);
          });
        });
      }

    return(
        <div className="CentralDiv">
        <div className="LoginDiv">
            <div className="login-top">
                <h1 style={{padding:'16px', textAlign:'center'}}>Register</h1>
            </div>

            <form style={{minWidth:'80%', padding:'12px'}} onSubmit={e => submitRegistration(e)}>
                <div className="form-group">
                    
                    <div className="input-holder">
                        <button>👤</button><input type="username" id="fname" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div className="input-holder">
                        <button>✉️</button><input type="email" id="fname" name="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="input-holder">
                    
                        <button>🔒</button><input type="password" id="lname" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    
                    <div className="login-button-holder"><button className="login-button" type="submit">Create Account</button></div>
                </div>
                
            </form>
           
            <p>Already have an account? <a href='/login'>Login</a></p>
            <a href='#' className="sample-acc">Sample account</a>
        </div>
    </div>
    )
}

export default RegisterPage