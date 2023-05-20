import React, {Component, useState, useEffect} from "react";
import './ProfilePage.css'
import { useParams } from "react-router-dom";
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";
import NavBar from './Navbar.js'



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function ProfilePage(props) {
    let { username } = useParams();
    const [img, setImg] = useState([]);

    
    useEffect(() => {
        GetProfileDetails();
      }, []);
      
    function GetProfileDetails(){
        return fetch("/accounts/profileinfo/"+username).then(response =>
            response.json().then((data) => {
              setImg(data.profile.image)
              
              const DB=data.user
              console.log(DB)
              let imgLink='http://127.0.0.1:8000'+data.profile.image
              setImg(imgLink)
              return DB;
              
            }
          ));
    }
    
    return(
       
        <div className="CentralDiv">
            <NavBar LoggedUserUsername={username}/>

            <div className="ProfileOverlay">
                <div className="profile-top">
                    <div className="img-div">
                        <img alt='profile' src={img} />
                    </div>
                    <div className="main-info-container">
                        <div>
                        <h1 className="usernameShow">{username}</h1>
                        
                        </div>
                        <p style={{marginBottom:'4px'}}>Last time active: 6h ago</p>
                        <p>Friends: 91</p>
                        <a href="#" className='friends-interaction'>Add to friends</a>
                    </div>
                </div>
                <div className="profile-middle">

                </div>
                <div className='profile-bottom'>

                    <h4 style={{marginTop:'20px'}}>{username}'s bio:</h4>
                    <div className="Bio-div">
                        <p>I DONT HAVE ANYTHING TO SAY SLAAAAAAAAAAAAAAAAvasvasvasvasvasvasvasvasvasvasvasAAAAAAAAAAAAAAAAAAAAAAAAAY</p>
                    </div>
                </div>
                <div className="outer-profile">

                </div>
            </div>
        </div>
    )
}
export default ProfilePage