import './RequestsPage.css'
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";
import NavBar from './Navbar.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


function RequestPage(){
    const [RequestsList, setRequestsList] = useState([]);

    useEffect(() => {
        GetAllRequests();
      }, []);
    
    return(
        
        <div className="CentralDiv">
            
                <div className="RequestsContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
                    {RequestsList.map(item => (
                        <RequestBox obj={item} key={item.reqId} social_name={item.username} image={item.image} date={item.date} rid={item.reqId}/> 
                    ))} 
                    
                </div>
                
        </div>
    )

    function GetAllRequests(props){
        return fetch("/chatapp/allfriendsrequests").then(response =>
        response.json().then((data) => {
            const RL=data.requests_list
            
            setRequestsList(RL)
            return RL
            
        
        }, (error) => {
            if (error) {
            console.log('user doesnt exist')
            
            }
        }
  ))
}
    function RequestBox(props){
        const onlinestyle={
            color:'#888888',
            fontSize:'10px',
            border:'none',
            padding:'6px'
        }
        const buttonClicked = event => {
            
            console.log(event.currentTarget.id);
            console.log(event.currentTarget.value);
            
            
            client.post(
              "chatapp/responsetofriendsrequest/"+event.currentTarget.id,
              {
                "is_accepted":event.currentTarget.value
              }
            )
            document.getElementById('id'+event.currentTarget.id).remove();

          };
        return(
            <div className="Socialdisplay" id={'id'+props.rid}>
                <div className='square' ><a href={"/profile/"+props.social_name}><div className="imageinsquare"><img src={props.social_picture}></img></div></a></div><p><a href={"/profile/"+props.social_name} style={{fontSize:'24px'}}>{props.social_name}</a><p1 style={onlinestyle}>{props.date}</p1></p>
                <div className='button-holder'><button onClick={buttonClicked} id={props.rid} value="yes" href="#" style={{backgroundColor:"rgb(104, 219, 75)"}}>✓</button><button id="no" onClick={buttonClicked} value={props.rid} style={{backgroundColor:"rgb(165, 44, 44)"}}>X</button></div>
            </div>
        )
        
    }
    
   
}





export default RequestPage