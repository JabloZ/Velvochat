import React, {Component, useEffect, useState} from "react";
import './NavBar.css';
import Dropdown from 'react-bootstrap/Dropdown';

import axios from 'axios';
import {Route, useNavigate, useLocation } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function NavBar(props) { 
    
    const location = useLocation();
    const routesWithoutNavBar = ["/login", "/register"];
    const shouldDisplayNavBar = !routesWithoutNavBar.includes(location.pathname);

    if (!shouldDisplayNavBar) {
      console.log('JAAA')
      return null; // Jeśli nie chcemy wyświetlać nawigacji, zwracamy null
    }
    const navigate = useNavigate();
    let currentId = -1;
    const [username, setUsername]=useState('')
    const [notifications, updateNotifications]=useState([]);
    const [search, setSearch] = useState('');

    useEffect(()=>{
     
      setUsername(props.loggedUser.username)
      getNotifications();
      },[]
    )
    
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
    function searchRedirect(){
      console.log(search)
      navigate("searchresult/"+search);

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
    function getNotifications(){
      return fetch("/chatapp/allusernotifications").then(response=>response.json().then(data=>{
          console.log(data.all_notifications)
          updateNotifications(data.all_notifications)
      }))
    }
    
    const notificationDelete = (e) => {
      e.preventDefault();
      console.log(e.target.id,"roz", e.target.value)
      client.post("chatapp/deletenotification",{
        "id":e.target.value
      })
      
      const updatedItems = [...notifications];
      console.log(updatedItems)
      updatedItems.splice(e.target.id, 1);
      console.log(updatedItems)
      updateNotifications(updatedItems);
  }
  



    return(
    <nav className='navbar'>
      <div className='navbar-inner' >
        <a href="/" style={leftstyle} >VelvoChat</a>
      </div>
      <div className='navbar-inner-search'>
        <input type="text" id="getsearch" name="lname" placeholder="Search..."  value={search} onChange={e => setSearch(e.target.value)}/><button onClick={searchRedirect}>→</button>
        
      </div>
      <div className='navbar-inner'>
        <a href={"/profile/"+username+'/'} style={leftstyle} >👤<p style={minimalFont}>{username}</p></a>
        
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-button-style">
        🔔<p style={minimalFont}>({notifications.length})</p>
        </Dropdown.Toggle>

        <Dropdown.Menu className="Dropdown-items-holder">
          {notifications.map(item=>{
            currentId++;
            return(
            <div className="Noti" value={item.id}><p>{item.text}</p><button value={item.id} id={currentId} onClick={notificationDelete}>X</button></div>)
          }
          )}
        </Dropdown.Menu>
      </Dropdown>


        <a href="/allchats" style={leftstyle} >💬<p style={minimalFont}>Chats</p></a>
        
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-button-style">
          ...
        </Dropdown.Toggle>

        <Dropdown.Menu className="Dropdown-items-holder">
          <Dropdown.Item href="#">📙 Help and FAQ</Dropdown.Item>
          <Dropdown.Item href={"/allfriends/"+username}>👥Friends</Dropdown.Item>
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