import './RegisterPage.css'

function RegisterPage(){
    return(
        <div className="CentralDiv">
        <div className="LoginDiv">
            <div className="login-top">
                <h1 style={{padding:'16px', textAlign:'center'}}>Register</h1>
            </div>

            <form style={{minWidth:'80%', padding:'12px'}}>
                <div className="form-group">
                    
                    <div className="input-holder">
                        <button>👤</button><input type="text" id="fname" name="fname" placeholder="Username"/>
                    </div>
                    <div className="input-holder">
                        <button>✉️</button><input type="text" id="fname" name="fname" placeholder="E-mail"/>
                    </div>
                    <div className="input-holder">
                    
                        <button>🔒</button><input type="text" id="lname" name="lname" placeholder="Password"/>
                    </div>
                    <div className="input-holder">
                    
                        <button>🔒</button><input type="text" id="lname" name="lname" placeholder="Confirm Password"/>
                    </div>
                    <div className="login-button-holder"><button className="login-button">Create Account</button></div>
                </div>
                
            </form>
           
            <p>Already have an account? <a href='/login'>Login</a></p>
            <a href='#' className="sample-acc">Sample account</a>
        </div>
    </div>
    )
}

export default RegisterPage