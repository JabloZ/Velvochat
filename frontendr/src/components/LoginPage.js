import React, {Component} from "react";
import "./LoginPage.css";
function LoginPage(){
    return (
    <div className="CentralDiv">
        <div className="LoginDiv">
            <div className="login-top">
                <h1 style={{padding:'16px', textAlign:'center'}}>Login</h1>
            </div>

            <form style={{minWidth:'80%', padding:'12px'}}>
                <div className="form-group">
                    
                    <div className="input-holder">
                        <button>👤</button><input type="text" id="fname" name="fname" placeholder="Username"/>
                    </div>
                    <div className="input-holder">
                    
                        <button>🔒</button><input type="text" id="lname" name="lname" placeholder="Password"/>
                    </div>
                    <div className="login-button-holder"><button className="login-button">Login</button></div>
                </div>
                
            </form>
           
            <p>Don't have an account? <a href='#'>Signup</a></p>
            <a href='#' className="sample-acc">Sample account</a>
        </div>
    </div>
    
    
    )

}
export default LoginPage