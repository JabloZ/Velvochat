import React, {Component} from "react";
import './SettingsPage.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function SettingsPage(){
    return(
        <div className="CentralDiv">
            <h1>Settings</h1>
            
        </div>
    )
}
export default SettingsPage