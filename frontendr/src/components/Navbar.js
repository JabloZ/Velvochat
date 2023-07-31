import React, {Component, useEffect, useState} from "react";
import './HomePage.css';
import Dropdown from 'react-bootstrap/Dropdown';

import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function NavBar(props) { 
    
    const [username, setUsername]=useState('')

    useEffect(()=>{
      CheckLoggedIn();
      },[]
    )
    const navigate = useNavigate();
    const leftstyle={
      float:"left",
      display:"flex",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems:"center"
    }
    const minimalFont={
        fontSize:'12px',
        textAlign:'center'
    }
    function submitLogout(e) {
        
      e.preventDefault();
      
      client.post(
      "accounts/logout",
      {
        withCredentials: true
      }
      ).then(function(res) {
        navigate("/login");
        
    });
    
    }

    function CheckLoggedIn(){
      
      return fetch("/accounts/user").then(response =>
        response.json().then((data) => {
         
          if (data.user==undefined){
            navigate("/login")
          }
          const DB=data.user
          console.log(DB)
          setUsername(DB.username)
          return DB;
          
        }
      ));
    }



    return(
    <nav className='navbar'>
      <div className='navbar-inner' >
        <a href="/" style={leftstyle} >VelvoChat</a>
      </div>
      <div className='navbar-inner-search'>
        <input type="text" id="lname" name="lname" placeholder="Search..." /><button>→</button>
        
      </div>
      <div className='navbar-inner'>
        <a href={"/profile/"+username+'/'} style={leftstyle} >👤<p style={minimalFont}>{username}</p></a>
        <a href="#" style={leftstyle} >🔔<p style={minimalFont}>Notifications</p></a>
        <a href="/allchats" style={leftstyle} >💬<p style={minimalFont}>Chats</p></a>
        
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-button-style">
          ...
        </Dropdown.Toggle>

        <Dropdown.Menu className="Dropdown-items-holder">
          <Dropdown.Item href="#">📙 Help and FAQ</Dropdown.Item>
          <Dropdown.Item href="/requests">👥Friends requests</Dropdown.Item>
          <Dropdown.Item href="/settings">⚙️ Settings</Dropdown.Item>
          <Dropdown.Item href="logout" style={{border:'3px solid rgb(184 195 217)'}} className='form-class' onClick={e => submitLogout(e)}>
            <form onSubmit={e => submitLogout(e)}>
                <button className="Button-form-logout" type="submit" variant="light" style={{padding:'0px', backgroundColor:'inherit'}}>⬅ Log out</button>
            </form>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>
    </nav>
    )
  }

export default NavBar