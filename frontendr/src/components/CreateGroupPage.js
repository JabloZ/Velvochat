
import React, {useState} from "react";
import './CreateGroupPage.css'
import axios from 'axios';
import {useNavigate } from "react-router-dom";
import NavBar from './Navbar.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function CreateGroupPage(props){
    const [name, setName]=useState('')
    const [imageChanged, setImageChanged]=useState('')
    const navigate = useNavigate();
    const SubmitGroupCreation = (e) => {
      e.preventDefault();
      
      client.post(
        "chatapp/creategroup",
        {
        "name":name,
        "image":imageChanged
        },{
        headers: {
          'content-type': 'multipart/form-data'
        }
        }
      ).then(
        response =>{
            console.log(response, response.data, response.data.group)
            navigate('/chat/'+response.data.group)
        })
        
      
      
    };
  
    return(
        
      <div className="CentralDiv">
        
          <div className="EditProfileContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
            <form class="editprofileform" enctype="multipart/form-data" onSubmit={e => SubmitGroupCreation(e)}> 
            <p style={{fontSize:"32px"}}>Your bio:</p>
              <label className="biochanger">        
                <textarea type="text" cols="60" rows="5" maxlength="50" value={name} onChange={e => setName(e.target.value)} />          
                    <div className="avatar-holder">
                      <img src={imageChanged} alt=""></img>
                    </div>
                </label>
                <label className="fileinput">       
                    <input  className="inputfilebut" type="file" id="myFile" name="filename" accept="image/png, image/jpeg" onChange={e => setImageChanged(e.target.files[0])}></input><br></br><br></br>
                    <input className="submitfilebut" type="submit" value="Submit" />
                </label>
            </form>

           
          </div>
      </div>
    )};

export default CreateGroupPage