import React, {Component, useState, useEffect} from "react";
import './AllChatsPage.css'
import { useParams } from "react-router-dom";
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";
import NavBar from './Navbar.js'



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;


const client=axios.create({
    baseURL:"http://127.0.0.1:8000"
})

function ChatsPage(){
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        GetAllGroups();
    }, []);

    function GetAllGroups(){
        return fetch("/chatapp/allusergroups").then(response => 
            response.json().then((data) => {
                console.log(data.groups)
                setGroups(data.groups)
            }))
    }
    return(
        
        <div className="CentralDiv">
            <NavBar/>
                <div className="RequestsContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
                    {groups.map(item => (
                        <GroupBox obj={item} name={item.name} image={item.image} id={item.id}/> 
                    ))} 
                    
                </div>
                
        </div>
    )
}
function GroupBox(props){
    const onlinestyle={
        color:'#888888',
        fontSize:'10px',
        border:'none',
        padding:'6px'
      }
      return(
        <div className="Socialdisplay">
         <div className='square' ><a href={"/chat/"+props.id}><div className="imageinsquare"><img src={'http://127.0.0.1:8000'+props.image}></img></div></a></div><p><a href={"/chat/"+props.id}>{props.name}</a><p1 style={onlinestyle}>35min ago</p1></p><p style={{textAlign:'left', fontSize:'12px'}}>X: Maybe</p>
          
        </div>
      )
}
export default ChatsPage