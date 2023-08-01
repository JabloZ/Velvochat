import React, {Component, useEffect, useState, useRef } from "react";
import './SingleChatPage.css';
import Dropdown from 'react-bootstrap/Dropdown';
import NavBar from './Navbar'
import { useParams } from "react-router-dom";
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function SingleChatPage(props){
    let {chat_id} = useParams();

    const messagesEndRef = React.createRef();

    let url=`ws://${window.location.host}/ws/socket-server/chat/${chat_id}/`
    const chatSocket = new WebSocket(url)
   
  

    const [usernameS, setUsernameS]=useState('');
    const message = useRef(null);
    const [messages, updateMessages]=useState([]);
    const [name, updateName]=useState([]);
    const [image, updateImage]=useState([]);


    useEffect(()=>{
        
        setUsernameS(props.loggedUser.username)
        catchGroupInfo();
        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
            console.log('Data:', data)
           
                updateMessages(current => [...current, {author: data.author, text: data.message, date: data.date}])
            
        };
    },[]);

   
    useEffect(()=>{
        catchGroupMessages();
    },[]);
    useEffect(()=>{
        messagesEndRef.current.scrollIntoView()
    },[messages]);
    

    function sendMessage(e) {
        e.preventDefault();
        
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;


        client.post(
            "/chatapp/sendmessage/"+chat_id,
            {
                "text":message.current.value,
                "author":props.loggedUser.username,
                "date":formattedToday,
            }
        );
        
        chatSocket.send(JSON.stringify({
            "message":message.current.value,
            "author":props.loggedUser.username,
            "date":formattedToday,
        }))
    

        

        message.current.value=null
      };


    function catchGroupInfo(){
        return fetch("/chatapp/chatinfo/"+chat_id).then(response =>
            response.json().then((data)=>{
                updateName(data.group.name)
                if (data.group.image != ''){
                    updateImage(data.group.image)
                }
               
            })
            )
    };

    function catchGroupMessages(){
        return fetch("/chatapp/chatmessages/"+chat_id).then(response =>
            response.json().then((data)=>{
                updateMessages(data.group_messages)
            })
            )
    };

    
   

    return(
        <div className="central-div">
            <NavBar/>    
            <ChatDisplay name={name} image={image}/>
        </div>
        );

        

    function ChatDisplay(props){
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
                            {image ? (<img src={props.image}></img>):(<></>)}
                            
                        </div>
                        </div><p>{props.name}</p></div>
                        <div className='chatRight'>
                        <a href="#" style={{backgroundColor:'#a1a8b3'}}>Settings</a>
                        <a href="#" style={{backgroundColor:'#a01c1c'}}>Exit</a>
                    </div>
                </div>
                <div className='chatInside' id="messages">
                    
                {messages.map(item => (
                    
                    <ChatMessage text={item.text} author={item.author} date={item.date}/>
                    
                ))}     
                
                <div className='scroll-to' ref={messagesEndRef}></div>
                </div>
                <div className='chatDownbar' style={downbarStyle}>
                <form onSubmit={e => sendMessage(e)} id="mes-form">                                                                                                                   
                    <div className='chatInputHolder'>
                        <textarea style={{resize:'none', fontSize:'14px'}} type="text" id="lname" name="lname" ref={message}/>
                        <button className='sendMessageButton'>Send</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
        )
    }
    function ChatMessage(props){
        if(props.author==usernameS)
        {
        return(
            <div className='message' style={{float:"right", backgroundColor:"#6582b7"}}>
                <a target="_blank" href={"/profile/"+props.author}>{props.author}</a><p className="date-show">{props.date}</p>
                <p>{props.text}</p>
            </div>
            )
        }
        else{
            return(
            <div className='message' style={{float:"left"}}>
                <a target="_blank" href={"/profile/"+props.author}>{props.author}</a><p className="date-show">{props.date}</p>
                <p>{props.text}</p>
            </div>
            )
        }
    }
}
export default SingleChatPage