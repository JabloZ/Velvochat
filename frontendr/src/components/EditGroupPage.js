
import React, {Component, useState, useEffect} from "react";
import './EditGroupPage.css'
import axios from 'axios';
import {Route, useNavigate, useParams } from "react-router-dom";
import NavBar from './Navbar.js'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function EditGroupPage(props){
    let {chat_id} = useParams()
    const [name, setName]=useState()
    const [pimage, setPimage]=useState([])
    const [imageBefore, setImageBefore]=useState(false)
    const [imageChanged, setImageChanged]=useState()
    const navigate = useNavigate();

    useEffect(()=>{
        loadGroupData();
    },[])
    function loadGroupData(){
        return fetch('/chatapp/editgroup/'+chat_id).then(response=>
            response.json().then((data)=>{
              
            if (response.data.authorized=="no"){
                navigate('/chat/'+response.data.group)
                }


              setName(data.name)
              setPimage(data.image)
              if (data.image!=null){
                setImageBefore(true)
              }
            }))
    }
    const deleteGroupImage=(e)=>{
        e.preventDefault();
        client.post(
          "chatapp/deletegrouppicture/"+chat_id,{
            
          }
        );
        window.location.reload();
      };
    const changePicture = (e) => {
        setImageChanged(e.target.files[0])
      }
    const SubmitGroupEdit = (e) => {
      e.preventDefault();
      
      client.post(
        "chatapp/editgroup/"+chat_id,
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
           
            navigate('/chat/'+response.data.group)
        })
        
      
      
    };
  
    return(
        
      <div className="CentralDiv">
        <NavBar/>
          <div className="EditProfileContainer" style={{backgroundColor:"rgb(81 88 117)"}}>
            <form class="editprofileform" enctype="multipart/form-data" onSubmit={e => SubmitGroupEdit(e)}> 
            <p style={{fontSize:"32px"}}>Your bio:</p>
              <label className="biochanger">        
                <textarea type="text" cols="60" rows="5" maxlength="50" value={name} onChange={e => setName(e.target.value)} />          
                {imageBefore ? (
                    <div className="avatar-holder">

                      <img src={pimage} alt=""></img>
                      <button className="deleteavatarbutton" href="javascript:void(0)" onClick={e => deleteGroupImage(e)}>Delete avatar</button><br></br>
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
    )};

export default EditGroupPage