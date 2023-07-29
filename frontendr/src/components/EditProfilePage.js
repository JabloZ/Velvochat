
import React, {Component, useState, useEffect} from "react";
import './EditProfilePage.css'
import axios from 'axios';
import {Route, useNavigate } from "react-router-dom";
import NavBar from './Navbar.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function EditProfilePage(props){
    const [bio, setBio]=useState('')
    const [pimage, setPimage]=useState([])
    const [imageBefore, setImageBefore]=useState(false)
    const [imageChanged, setImageChanged]=useState([])
    useEffect(()=>{
      catchProfileData();
      
    },[])

    function catchProfileData(){
      return fetch('/accounts/editprofile').then(response=>
        response.json().then((data)=>{
          console.log(data)
          setBio(data.profile.bio)
          setPimage(data.profile.image)
          console.log(data.profile.image,'fasfasfas')
          if (data.profile.image!=null){
            setImageBefore(true)
          }
        }))
    }
    const changePicture = (e) => {
      console.log(e.target.files[0])
      setImageChanged(e.target.files[0])
    }

    const SubmitProfileChanges = (e) => {
      e.preventDefault();
    
      client.post(
        "accounts/editprofile",
        {
        "bio":bio,
        "image":imageChanged
        },{
        headers: {
          'content-type': 'multipart/form-data'
        }
        }
      )
      window.location.reload();
    };
  




    const deleteProfileImage=(e)=>{
      e.preventDefault();
      client.post(
        "chatapp/deleteprofilepicture",{
          
        }
      );
      window.location.reload();
    };
    return(
        
      <div className="CentralDiv">
        <NavBar/>
          <div className="EditProfileContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
            
            <form class="editprofileform" enctype="multipart/form-data" onSubmit={e => SubmitProfileChanges(e)}>
            <p style={{fontSize:"32px"}}>Your bio:</p>
              <label className="biochanger">
                
                <textarea type="text" cols="60" rows="5" maxlength="300" value={bio} onChange={e => setBio(e.target.value)} />
                {imageBefore ? (
                    <div className="avatar-holder">

                      <img src={pimage} alt=""></img>
                      <button className="deleteavatarbutton" href="javascript:void(0)" onClick={e => deleteProfileImage(e)}>Delete avatar</button><br></br>
                    </div>
                
                ) : (  
                <></>
                )}
              </label>
              <label className="fileinput">
                
                <input  className="inputfilebut" type="file" id="myFile" name="filename" accept="image/png, image/jpeg" onChange={e => changePicture(e)}></input><br></br><br></br>
                
                <input className="submitfilebut" type="submit" value="Submit" />
              </label>
            </form>

           
          </div>
      </div>
    )
}
export default EditProfilePage