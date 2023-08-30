import React, {Component} from "react";
import "./LoginPage.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    function checkLoginStatus(){
    
        console.log('acc no')
        return axios.get("http://127.0.0.1:8000/accounts/user").then(response => {
          
          console.log(response.data.logged)
          if (response.data.logged=="yes"){
            navigate("/")
          }
          }).catch(error => {
            
          })
          
    }
    useEffect(()=>{
        checkLoginStatus();
    },[]) 
    function submitLogin(e) {
        
        e.preventDefault();
        
        client.post(
        "accounts/login",
        {
          email: email,
          password: password
        }
        ).then(function(res) {
            navigate("/");
            
        });
      }

    return (
    <div className="CentralDiv">
        <div className="LoginDiv">
            <div className="login-top">
                <h1 style={{padding:'16px', textAlign:'center'}}>Login</h1>
            </div>
                                            
            <form style={{minWidth:'80%', padding:'12px'}} onSubmit={e => submitLogin(e)}>
                <div className="form-group">
                    
                    <div className="input-holder">
                        <button>👤</button><input type="email" id="fname" name="fname" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="input-holder">

                        <button>🔒</button><input type="password" id="lname" name="lname" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="login-button-holder"><button className="login-button">Login</button></div>
                </div>
                
            </form>
           
            <p>Don't have an account? <a href='/register'>Signup</a></p>
            <a href='#' className="sample-acc">Sample account</a>
        </div>
    </div>
    
    
    )

}
export default LoginPage