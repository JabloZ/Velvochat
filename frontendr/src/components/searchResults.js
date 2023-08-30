import './AllFriendsPage.css'
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, useNavigate, useParams } from "react-router-dom";
import NavBar from './Navbar.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


function SearchResultPage(){
    
    let { search } = useParams();
    const [friends, setFriends] = useState([]);
    
    useEffect(()=>{
        GetAllFriends();
    },[search]);
    function GetAllFriends(){
        console.log(search)
        return fetch("/chatapp/searchresults/"+search).then(response =>
        response.json().then((data) => {
            console.log(response.data)
            const RL=data.results          
            setFriends(RL)
            console.log(friends)
            
        }, (error) => {
            if (error) {
            console.log('user doesnt exist')
            }
        }
  ))
}


    return(
        
        <div className="CentralDiv">
            
                <div className="FriendsContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
                <p style={{fontSize: "28px",color: "white", textAlign: "center"}}>Results: {friends.length}</p>
                        {friends.map(item => (
                            <div className='socCon'>
                                <SocialDisplay obj={item} key={item.username} social_name={item.username} social_picture={item.image} tohref={"/profile/"+item.username} last_ac={item.last_activity}/>
                            </div>
                        ))} 
                    
                    
                </div>
                
        </div>
    )
    function SocialDisplay(props){
        const onlinestyle={
          color:'#888888',
          fontSize:'10px',
          border:'none',
          padding:'6px'
        }
        return(
            <div className="SocialdisplayAF">
        
            <div className='square' ><a href={props.tohref}><div className="imageinsquare"><img src={'http://127.0.0.1:8000'+props.social_picture}></img></div></a></div>
            <p><a href={props.tohref} style={{fontSize:'14px'}}>{props.social_name}</a><p1 style={onlinestyle}>{props.last_ac}</p1></p>
            
           </div>
           
        )
      }                        
   
   
}

export default SearchResultPage