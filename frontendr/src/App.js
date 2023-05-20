import logo from './logo.svg';
import React, { Component }  from 'react';
import './App.css';
import {BrowserRouter as Router,
Routes,
Route,
Link,
Redirect,
} from "react-router-dom"
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import { useState } from 'react';

function App(props) {
  console.log(props,'props')
  


  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/register" Component={RegisterPage}></Route>
        <Route path="/settings" Component={SettingsPage}></Route>
        <Route path="/profile/:username" Component={ProfilePage}></Route>
      </Routes>
    </Router>

  );
}

export default App;
