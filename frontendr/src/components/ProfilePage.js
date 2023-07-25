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
    const [isFriend, setUserFriend] = useState(false)    
    const [addTo, setAddTo] = useState(false)


    useEffect(() => {
        GetProfileDetails();
      }, [username_prof]);
   
    useEffect(() =>{

    }, [isFriend]);

    function addToFriends(){
        console.log(user, username_prof, 'tried')
    };


    

    
    function GetProfileDetails(){
        if (username_prof!=undefined){
           
            return fetch("/accounts/profileinfo/"+username_prof).then(response =>
                response.json().then((data) => {
                setImg(data.profile.image)
                
                setUserActive(data.user.is_active)
                const DB=data.user
                
                let imgLink='http://127.0.0.1:8000'+data.profile.image
                setImg(imgLink)
                setUserTrue(true)
                setUserOwner(props.loggedUser.username == username_prof)
                
                const friends=data.profile.friends
                
                setUserFriend((props.loggedUserProfile.id != data.profile.id) && (friends.includes(props.loggedUserProfile.id)))
                
                return DB;
                
                }, (error) => {
                    if (error) {
                    console.log('user doesnt exist')
                    setUserTrue(false)
                    }
                }
          ))};
    }
    const showStyle={
        fontSize:'16px',
        color:'aqua',
        marginBottom:'16px',
        marginLeft:'12px'
    }
    const handleClick = (e) => {
        e.preventDefault();
        console.log('The link was clicked.');
        console.log(user, username_prof, 'sends:', props.loggedUserProfile)
        client.post(
            "chatapp/addtofriends",
            {
              who_send: props.loggedUserProfile.id,
              who_received: username_prof
            }
            );

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
                                <></>
                        )}
                        </div>
                        <p style={{marginBottom:'4px'}}>Last time active: 6h ago</p>
                        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', textAlign:'center'}}>
                        <p>Friends: 91 - </p><a href="#" style={showStyle}>Show</a>
                        </div>
                        {isOwner ? (
                           <></>
                            ) : (
                                
                                isFriend ? (

                                        <a href="#" className='friends-interaction' style={{backgroundColor:"red"}}>Remove from friends</a>
                                     ) : (
                                        
                                            <a className='friends-interaction' href="#" onClick={handleClick}>Add to friends</a>
                                        
                                )
                                
                                
                        )}
                        
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