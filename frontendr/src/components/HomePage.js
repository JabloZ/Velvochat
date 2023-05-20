import React, {Component, useState} from "react";
import './HomePage.css';
import Dropdown from 'react-bootstrap/Dropdown';
import NavBar from './Navbar'

import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

  function HomePage(){
    const [username, setUsername]=useState('')
    CheckLoggedIn().then(function myfunc(DB){
      
      setUsername(DB.username)
      const username=DB.username
      console.log(username,'fasfasfas')
      return username

    })
    
    
    return (
      
      <div className="App">
        <NavBar LoggedUserUsername={username}></NavBar>
        <SideBar></SideBar>
        <ChatDisplay></ChatDisplay>
        
      </div>
    )
  }
  
  function CheckLoggedIn(){
    const navigate = useNavigate();
    return fetch("accounts/user").then(response =>
      response.json().then((data) => {
        console.log(data.user,'fasasgagasg')
        if (data.user==undefined){
          navigate("/login")
        }
        const DB=data.user
        
        return DB;
        
      }
    ));
  }
  
  
  function SideBar() {
  
    const friendsstyle={
      
      minHeight:'40vh',
      maxHeight:'40vh',
      backgroundColor: '#2d3d5c'
    }
    const groupsstyle={
      
      minHeight:'40vh',
      maxHeight:'40vh',
      backgroundColor: '#384358'
    }
    const socialcontainer={
      
      minHeight:'100%'
    }
    return(
    <nav className="sidebar">
  
      <div className="socialBar" style={friendsstyle}>
        
        <h4 style={{color:"white"}}>Friends</h4>
        <div className='friendscontainer' style={socialcontainer}>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
        </div>
      </div>
      <div className="socialBar" style={groupsstyle}>
      <h4 style={{color:"white"}}>Groups</h4>
      <div className='friendscontainer' style={socialcontainer}>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          <div className='socCon'>
            <SocialDisplay></SocialDisplay>
          </div>
          
        </div>
      </div>
    </nav>
    )
  }
  
  function SocialDisplay(){
    const onlinestyle={
      color:'#888888',
      fontSize:'10px',
      border:'none',
      padding:'6px'
    }
    return(
      <div className="Socialdisplay">
       <div className='square' ><div className="imageinsquare"></div></div><p style={{fontSize:'14px'}}>your friend<p1 style={onlinestyle}>35min ago</p1></p><p style={{textAlign:'left', fontSize:'12px'}}>X: Maybe</p>
        
      </div>
    )
  }
  
  function ChatDisplay(){
    const downbarStyle={
      maxHeight:'10vh',
      backgroundColor:'#353c55'
    }
    return(
      <div className='chatdiv'>
        <div className='chatAssist'>
          <div className='chatOpened'>
            <div className='chatNavbar' style={downbarStyle}>
              <div className='usimContainer' >
                <div className='square' >
                  <div className="imageinsquare">
                  </div>
                </div><p>Chatting with: 'username' </p></div>
                <div className='chatRight'>
                  <a href="#" style={{backgroundColor:'#a1a8b3'}}>Settings</a>
                  <a href="#" style={{backgroundColor:'#a01c1c'}}>Exit</a>
                </div>
            </div>
            <div className='chatInside'>
              <ChatMessage messageText='Yeah i would like'></ChatMessage>
              <ChatMessage messageText='nie mam juz nic do oddania'></ChatMessage>
            </div>
            <div className='chatDownbar' style={downbarStyle}>
              <form>
                <div className='chatInputHolder'><textarea style={{resize:'none', fontSize:'14px'}}id="msg" name="msg" rows="5" cols="50"></textarea><button className='sendMessageButton'>Send</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  function ChatMessage(props){
    
    return(
      <div className='message'>
        
          <p>{props.messageText}</p>
        
      </div>
    )
  }
export default HomePage