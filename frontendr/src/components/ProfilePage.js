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

    let { username_prof } = useParams();
    const [img, setImg] = useState([]);
    const [user, setUserTrue] = useState([])
    const [active, setUserActive] = useState([])
    const [isOwner, setUserOwner] = useState([])
    const [isFriend, setUserFriend] = useState([])    



    useEffect(() => {
        GetProfileDetails();
      }, []);
      
    function GetProfileDetails(){
        return fetch("/accounts/profileinfo/"+username_prof).then(response =>
            response.json().then((data) => {
              setImg(data.profile.image)
              
              setUserActive(data.user.is_active)
              const DB=data.user
                console.log(data.profile.friends)
              let imgLink='http://127.0.0.1:8000'+data.profile.image
              setImg(imgLink)
              setUserTrue(true)
              setUserOwner(props.loggedUser.username == username_prof)
              setUserFriend((props.loggedUserProfile.id != data.profile.id) && !(props.loggedUserProfile.id in data.profile.friends))
              console.log(props.loggedUserProfile.id, data.profile.id)
              
              return DB;
              
            }, (error) => {
                if (error) {
                  console.log('user doesnt exist')
                  setUserTrue(false)
                }
              }
          ));
    }
    const showStyle={
        fontSize:'16px',
        color:'aqua',
        marginBottom:'16px',
        marginLeft:'12px'
    }
    if (isOwner===false){
        if (isFriend===false){
            console.log('potem seria z requestami')
        }
        else{
            console.log('mozesz usunac ze znaj')
        }
    }
    else{
        console.log('owner')
    }
    if (user===true){
    return(
       
        <div className="CentralDiv">
            <NavBar/>

            <div className="ProfileOverlay">
                <div className="profile-top">
                    <div className="img-div">
                        <img alt='profile' src={img} />
                    </div>
                    <div className="main-info-container">
                        <div>
                        <h1 className="usernameShow">{username_prof}</h1>
                        {isOwner ? (
                            <a href="#" style={{backgroundColor:"rgb(55 65 86)", padding:'6px', borderRadius:'6px'}}>Edit profile</a>
                            ) : (
                                <p>nie</p>
                        )}
                        </div>
                        <p style={{marginBottom:'4px'}}>Last time active: 6h ago</p>
                        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', textAlign:'center'}}>
                        <p>Friends: 91 - </p><a href="#" style={showStyle}>Show</a>
                        </div>
                        <a href="#" className='friends-interaction'>Add to friends</a>
                    </div>
                </div>
                <div className="profile-middle">
                    
                </div>
                <div className='profile-bottom'>

                    <h4 style={{marginTop:'20px'}}>{username_prof}'s bio:</h4>
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
    else{
        return(
            
        <div className="CentralDiv">
        <NavBar/>
            <h4>This user doesnt exist!</h4>
        </div>
        )
    }
}
export default ProfilePage