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

  function HomePage(props){

    const DB=props.loggedUser
    const UP=props.loggedUserProfile
    const username=DB.username
    const friends=UP.friends
    return (
      
      <div className="App">
        <NavBar LoggedUserUsername={username}></NavBar>
        <SideBar UserFriends={friends}></SideBar>
        <ChatDisplay></ChatDisplay>
        
      </div>
    )
  }
  
  
  
  function SideBar(props) {
  
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
    

    if (props.UserFriends!=undefined){
      console.log(props.UserFriends,'fas')
    return(
    
    <nav className="sidebar">
  
      <div className="socialBar" style={friendsstyle}>
        
        <h4 style={{color:"white"}}>Friends</h4>
        <div className='friendscontainer' style={socialcontainer}>
          
          
          
        {props.UserFriends.map(item => (
          <div className='socCon'>
            <SocialDisplay obj={item} key={item.username} social_name={item.username} social_picture={item.image}/>
          </div>
        ))} 
          
        </div>
      </div>
      <div className="socialBar" style={groupsstyle}>
      <h4 style={{color:"white"}}>Groups</h4>
      <div className='friendscontainer' style={socialcontainer}>
          
          
        </div>
      </div>
    </nav>
    )
  }}
  
  function SocialDisplay(props){
    const onlinestyle={
      color:'#888888',
      fontSize:'10px',
      border:'none',
      padding:'6px'
    }
    return(
      <div className="Socialdisplay">
       <div className='square' ><a href={"/profile/"+props.social_name}><div className="imageinsquare"><img src={'http://127.0.0.1:8000'+props.social_picture}></img></div></a></div><p><a href={"/profile/"+props.social_name} style={{fontSize:'14px'}}>{props.social_name}</a><p1 style={onlinestyle}>35min ago</p1></p><p style={{textAlign:'left', fontSize:'12px'}}>X: Maybe</p>
        
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