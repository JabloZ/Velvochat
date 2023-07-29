import logo from './logo.svg';
import React, { Component }  from 'react';
import './App.css';
import {BrowserRouter as Router,
Routes,
Route,
Link,
Redirect,
useNavigate
} from "react-router-dom"
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import RequestsPage from './components/RequestsPage';
import EditProfilePage from './components/EditProfilePage';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useRef } from 'react';

function App(props) {
  const [loggedUser, setLoggedUser] = useState([])
  const [loggedUserProfile, setLoggedUserProfile] = useState([])
  
  useEffect(() => {
    checkLoginStatus();
    }
  , []);

  useEffect(() => {
    getProfile();
    }
  , [loggedUser]);
  
  function checkLoginStatus(){
    return axios.get("http://127.0.0.1:8000/accounts/user").then(response => {
      setLoggedUser(response.data.user);
      })
      
    }
  function getProfile(){
    
    if (loggedUser.username!=undefined){
    return axios.get("http://127.0.0.1:8000/accounts/profileinfo/"+loggedUser.username).then(response => {
      setLoggedUserProfile(response.data.profile)
    })
    }
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" Component={() => (<HomePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/register" Component={RegisterPage}></Route>
        <Route path="/settings" Component={SettingsPage}></Route>
        <Route path="/profile/:username_prof" Component={() => (<ProfilePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
        <Route path="/requests" Component={RequestsPage}></Route>
        <Route path="/editprofile" Component={() => (<EditProfilePage loggedUser={loggedUser} loggedUserProfile={loggedUserProfile}/>)}></Route>
      </Routes>
    </Router>

  );
}

export default App;
