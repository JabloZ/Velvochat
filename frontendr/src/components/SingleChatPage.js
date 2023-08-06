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
    const chatSocketRef = useRef(null)
   
   
  
    const navigate=useNavigate();
    const [usernameS, setUsernameS]=useState('');
    const message = useRef(null);
    const invited = useRef(null);
    const [messages, updateMessages]=useState([]);
    const [name, updateName]=useState([]);
    const [image, updateImage]=useState([]);
    const [members, setMembers]=useState([]);
    const [files, setFiles]=useState([]);
    const [membersVisible, setMembersVisible] = useState(false);
    const [filesVisible, setFilesVisible] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [fileId, setFileId] = useState(0)
    const [filesUrl, setFilesUrl] = useState([])
    
    
    useEffect(()=>{
        catchGroupInfo();
        catchGroupMessages();
        setUsernameS(props.loggedUser.username)
        chatSocketRef.current = initializeWebSocket();
        
    },[])
    function initializeWebSocket(){
        let url=`ws://${window.location.host}/ws/socket-server/chat/${chat_id}/`
        const chatSocket = new WebSocket(url)
        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
                if (data.type=="chat"){
                    updateMessages(current => [...current, {author: data.author, text: data.message, date: data.date, files:data.files}])
                }
                else if(data.type=="members"){
                    if (data.action=="delete"){
                        setMembers(prevMembers => prevMembers.filter(item => item.username !== data.user.username))
                        

                    }
                    else if(data.action=="add"){
                        setMembers(prevMembers => [
                            ...prevMembers,
                            { username: data.user.username, image: data.user.image, isAdmin: data.user.isAdmin }
                          ]);

                    }
                }
            
        };
        return chatSocket;
    }
    
    useEffect(()=>{
        messagesEndRef.current.scrollIntoView()
    },[messages, membersVisible, files, members, filesVisible]);
  
    

    function sendMessage(e) {
        e.preventDefault();
        
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        console.log(files, 'fasfasfasgasgcvxc')
        client.post(
            "/chatapp/sendmessage/"+chat_id,
            {
                "text":message.current.value,
                "author":props.loggedUser.username,
                "date":formattedToday,
                "files":files
            },{
                headers: {
                  'content-type': 'multipart/form-data'
                }
            }
        ).then(response => {
            // Odczytaj dane jako obiekt JSON
            return response.data;
          })
          .then(data => {
            // Odczytaj files_url z obiektu data
            const files_url = data.files;
            
            console.log(files_url);
            sendChatMessage(files_url);
            
          })
          .catch(error => {
            // Obsługa błędów
            console.error('Błąd przy przetwarzaniu odpowiedzi:', error);
          });

      };
      function sendChatMessage(files_url) {
        
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        chatSocketRef.current.send(JSON.stringify({
          "message": message.current.value,
          "author": props.loggedUser.username,
          "date": formattedToday,
          "action_type": "message",
          "files": files_url
        }));
        message.current.value=null
        setFiles([])
      }

    function catchGroupInfo(){
        return fetch("/chatapp/chatinfo/"+chat_id).then(response =>
            response.json().then((data)=>{
                updateName(data.group.name)
                if (data.group.image != ''){
                    updateImage(data.group.image)
                }
                setMembers(data.group.members)
                console.log(data.group.members)
                
                if (data.group.admin=="yes"){
                    setUserIsAdmin(true)
                }
                else{
                    setUserIsAdmin(false)
                }
                
            })
            )
    };

    function catchGroupMessages(){
        return fetch("/chatapp/chatmessages/"+chat_id).then(response =>
            response.json().then((data)=>{
                updateMessages(data.group_messages)
            }), messagesEndRef.current.scrollIntoView()
            
            )
            
    };
    const UserKicked = e =>{
        e.preventDefault();
        client.post(
            "chatapp/deletefromgroup",
            {
                "group":chat_id,
                "username":e.target.dataset.username
            }
        ).then(response=>{
            chatSocketRef.current.send(JSON.stringify({
                "action_type":"members",
                "user":e.target.dataset.username,
                "action":"delete"
    
            }));
            
        })

        
    }
    const changePicture = (e) => {
        setFiles(current => [...current, e.target.files[0]])
        
    }
    const deleteFile = (e) => {
        e.preventDefault();
        const updatedItems = [...files];
        updatedItems.splice(e.target.id, 1);
        setFiles(updatedItems);
    }


    function InviteUser(e){
        e.preventDefault();
        client.post(
            "chatapp/addtogroup/"+chat_id,
            {
                "user":invited.current.value
            }
        ).then(
            response =>{
                alert(response.data.info)
                console.log(response.data.info)
            },
            chatSocketRef.current.send(JSON.stringify({
                "action_type":"members",
                "user":invited.current.value,
                "action":"add"
    
            }))
            )
        invited=""
    }
    function UserLeavesGroup(){
        client.post(
            "chatapp/leavegroup/"+chat_id,
            {
            
            }
        ).then(
            navigate("/allchats")
        )
    }
    const CloseClicked=(e)=>{
        setMembersVisible(false)
        
    }
    const MembersClicked=(e)=>{
        setMembersVisible(true)
        
    }

    const CloseFilesClicked=(e)=>{
        setFilesVisible(false)
        
    }
    const FilesClicked=(e)=>{
        setFilesVisible(true)
        
    }

    return(
        <div className="central-div">
            <NavBar/>    
            <ChatDisplay name={name} image={image}/>
        </div>
        );

        

    function ChatDisplay(props){
        const downbarStyle={
            maxHeight:'10vh',
            minHeight:'10vh',
            backgroundColor:'#353c55',
            display: "flex"
            }
        return(
            
        <div className='chatdiv'>
           
            <div className='chatAssist'>

                {membersVisible?( <div className="membersdiv">
                    <div className="membersdivtop">
                        <a href="#" onClick={CloseClicked}>Close</a>
                        <p>All chat members</p>
                    </div>
                    <div className="membersinside">
                    {members.map(item=>(
                    <MemberPannel username={item.username} image={item.image} isAdmin={item.admin}/>
                        ))}
                    </div>
                </div>):(<></>)}


                {filesVisible?(<div className="filesdiv">
                    <div className="filesdivtop">
                        <a href="#" onClick={CloseFilesClicked}>Close</a>
                        <p>Manage files</p>
                    </div>
                    <div className="filesinside">
                    {files.map((item, index)=>(
                    <ShowFile url={item} id={index}/>
                        ))}
                    </div>
                </div>):(<></>)}       
            
            <div className='chatOpened'>
                
                <div className='chatNavbar' style={downbarStyle}>
                    <div className='usimContainer' >
                        <div className='square' >
                        <div className="imageinsquare">
                            {image ? (<img src={props.image}></img>):(<></>)}
                            
                        </div>
                        
                        </div><p>{props.name}</p></div>
                        <div className='chatRight'>
                        {userIsAdmin ? (
                            <>
                            <input placeholder="Add your friend to group" ref={invited} style={{minHeight:'5vh'}}/><a href="#" className="byinput" onClick={e => InviteUser(e)} style={{backgroundColor:"rgb(45 137 48)",marginLeft:"0px",borderTopLeftRadius:'0',borderBottomLeftRadius:'0'}}>Invite</a>
                            </>
                        ):(
                            <></>
                        )}
                        <a href="#" style={{backgroundColor:'#81a2db'}} onClick={MembersClicked}>Members</a>

                        <a href={"/editgroup/"+chat_id} style={{backgroundColor:'#a1a8b3'}} >Settings</a>
                        
                        <a href="#" style={{backgroundColor:'#a01c1c'}} onClick={UserLeavesGroup}>Leave</a>
                    </div>
                </div>
                <div className='chatInside' id="messages">
                    
                {messages.map(item => (
                    
                    <ChatMessage text={item.text} author={item.author} date={item.date} files={item.files}/>
                    
                ))}     
                
                <div className='scroll-to' ref={messagesEndRef}></div>
                </div>
                <div className='chatDownbar' style={downbarStyle}>
                <form onSubmit={e => sendMessage(e)} id="mes-form" className="mes-form">  
                    
                        
                                                                                                                                    
                    <div className='chatInputHolder'>
                        <a href="#" style={{backgroundColor:'#81a2db', margin:"12px", padding:"16px"}} onClick={FilesClicked}>Files to add</a>

                        <input  className="inputfilebut" type="file" id="myFile" name="filename" accept="image/png, image/jpeg" onChange={e => changePicture(e)}></input><br></br><br></br>
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
    function ShowFile(props){
        console.log(props.url)
        return(
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <p>{props.url.name}</p>
            <a href="#" id={props.id} onClick={deleteFile} style={{backgroundColor:"rgb(133 13 13)"}}>Delete</a>
        </div>
        )}   

    function ChatMessage(props){
        const [areFiles, setAreFiles] = useState(false)
        useEffect(()=>{
            if (props.files===[]){
                setAreFiles(false)
            }
            else{
                setAreFiles(true)
            }
        })
        if(props.author==usernameS)
        {
        return(
            <div className='message' style={{float:"right", backgroundColor:"#6582b7"}}>
                <a target="_blank" href={"/profile/"+props.author}>{props.author}</a><p className="date-show">{props.date}</p>
                <p>{props.text}</p>
                {areFiles? (props.files.map(imageSrc => (
                    <img src={"http://127.0.0.1:8000"+imageSrc} />
                ))):(<></>)}
               
            
            </div>
            )
        }
        else{
            return(
            <div className='message' style={{float:"left"}}>
                <a target="_blank" href={"/profile/"+props.author}>{props.author}</a><p className="date-show">{props.date}</p>
                <p>{props.text}</p>
                {areFiles? (props.files.map(imageSrc => (
                    <img src={"http://127.0.0.1:8000"+imageSrc} />
                ))):(<></>)}
            </div>
            )
        }
    }
    function MemberPannel(propsM){
        const [isAdmin, setIsAdmin] = useState([])
        const [isUser, setIsUser] = useState([])
        useEffect(()=>{
            if (propsM.username==props.loggedUser.username){
                setIsUser(true)
            }
            else{
                setIsUser(false)
            }
            if (propsM.isAdmin=="yes"){
                setIsAdmin(true)
            }
            else{
                setIsAdmin(false)
            }
        });
        return(
            
            <div className="divMember" id={propsM.username}>
                
                <a href={"/profile/"+propsM.username} target="_blank"><img src={propsM.image}></img></a>
                <a href={"/profile/"+propsM.username} target="_blank">{propsM.username}</a>
                {   
                    isAdmin ? (
                        <p style={{border: "1px dashed rgb(92, 212, 245)"}}>Admin</p>
                    ):(
                        isUser ? (
                            <p style={{border: "1px dashed rgb(220, 241, 247)"}}>Member</p>
                        ):(
                            userIsAdmin ? ( <>
                                <p style={{border: "1px dashed rgb(220, 241, 247)"}}>Member</p>
                                <a className="KickButton" href="#" onClick={UserKicked} data-username={propsM.username}>Kick user</a>
                            </>):( <>
                                <p style={{border: "1px dashed rgb(220, 241, 247)"}}>Member</p>
                                
                            </>)

                        )
                        
                    )
                }
                

            </div>
        )
    }
}
export default SingleChatPage