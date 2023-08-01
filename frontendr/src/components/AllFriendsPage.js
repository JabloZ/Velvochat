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


function AllFriendsPage(){
    let { username_prof } = useParams();
    const [friends, setFriends] = useState([]);
    const [flistlength, setFlistlength] = useState([]);
    useEffect(()=>{
        GetAllFriends();
    },[]);
    function GetAllFriends(){
        return fetch("/chatapp/showuserfriends/"+username_prof).then(response =>
        response.json().then((data) => {
            const RL=data.friends           
            setFriends(RL)
            console.log('wyjebalem sie tu')
            setFlistlength(data.flistlength)
        }, (error) => {
            if (error) {
            console.log('user doesnt exist')
            }
        }
  ))
}


    return(
        
        <div className="CentralDiv">
            <NavBar/>
                <div className="FriendsContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
                <p style={{fontSize: "28px",color: "white", textAlign: "center"}}>Friends: {flistlength}</p>
                        {friends.map(item => (
                            <div className='socCon'>
                                <SocialDisplay obj={item} key={item.name} social_name={item.name} social_picture={item.image}/>
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
           <div className='square' ><a href={"/profile/"+props.social_name}><div className="imageinsquare"><img src={'http://127.0.0.1:8000'+props.social_picture}></img></div></a></div><p><a href={"/profile/"+props.social_name} style={{fontSize:'28px'}}>{props.social_name}</a></p>
            
          </div>
        )
      }                        
   
   
}

export default AllFriendsPage