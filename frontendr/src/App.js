
import React from 'react';
import './App.css';
import {BrowserRouter as Router,
Routes,
Route,
useNavigate,
useLocation
} from "react-router-dom"
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import RequestsPage from './components/RequestsPage';
import EditProfilePage from './components/EditProfilePage';
import ChatsPage from './components/AllChatsPage';
import SingleChatPage from './components/SingleChatPage';
import AllFriendsPage from './components/AllFriendsPage';
import CreateGroupPage from './components/CreateGroupPage';
import EditGroupPage from './components/EditGroupPage';
import SearchResultPage from './components/searchResults';
import NavBar from './components/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';


function App(props) {
  


  const [loggedUser, setLoggedUser] = useState([])
  const [loggedUserProfile, setLoggedUserProfile] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    }
  , []);

  useEffect(() => {
    getProfile();
    }
  , [loggedUser]);
  
  function checkLoginStatus(){
    
    console.log('acc no')
    return axios.get("http://127.0.0.1:8000/accounts/user").then(response => {
      setLoggedUser(response.data.user);
      console.log(response.data)
      }).catch(error => {
        console.error("error!", error)
        setDataLoaded(true);
      })
      
    }
  function getProfile(){
    
    if (loggedUser.username!=undefined){
    return axios.get("http://127.0.0.1:8000/accounts/profileinfo/"+loggedUser.username).then(response => {
      setLoggedUserProfile(response.data.profile)
      setDataLoaded(true);
    })
    }
  }

    
    if (!dataLoaded) {
      return <div>Loading...</div>; // Możesz wyrenderować komunikat lub spinner ładowania
    }
    
  
  return (
    <Router>
      <NavBar loggedUser={loggedUser} loggedUserProfile={loggedUserProfile} />
      <Routes>
        
        <Route path="/" Component={() => (<HomePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/register" Component={RegisterPage}></Route>
        <Route path="/settings" Component={SettingsPage}></Route>
        <Route path="/profile/:username_prof" Component={() => (<ProfilePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        <Route path="/requests" Component={RequestsPage}></Route>
        <Route path="/editprofile" Component={() => (<EditProfilePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        <Route path="/allchats" Component={ChatsPage}></Route>
        
        <Route path="/chat/:chat_id" Component={() => (<SingleChatPage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        
        <Route path="/allfriends/:username_prof" Component={() => (<AllFriendsPage/>)}></Route>
        <Route path="/creategroup" Component={() => (<CreateGroupPage/>)}></Route>
        <Route path="/editgroup/:chat_id" Component={() => (<EditGroupPage/>)}></Route>
        <Route path="/searchresult/:search" Component={() => (<SearchResultPage/>)}></Route>
      </Routes>
    </Router>

  );
}

export default App;
