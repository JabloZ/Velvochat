import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <SideBar></SideBar>
    </div>
  );
}
function NavBar() {
  const leftstyle={
    float:"left",
    display:"flex",
    alignItems:"center"
  }
  return(
  <nav className='navbar'>
    <div className='navbar-inner' >
      <a href="#" style={leftstyle} >VelvoChat</a>
    </div>
    <div className='navbar-inner'>
      <a href="#" style={leftstyle} >SEARCH BAR VERY LONG</a>
    </div>
    <div className='navbar-inner'>
      <a href="#" style={leftstyle} >U</a>
      <a href="#" style={leftstyle} >N</a>
      <a href="#" style={leftstyle} >C</a>
      <a href="#" style={leftstyle} >S</a>
    </div>
  </nav>
  )
}

function SideBar() {

  const friendsstyle={
    
    minHeight:'40vh',
    maxHeight:'40vh',
    backgroundColor: '#2d3d5c'
  }
  const groupsstyle={
    
    minHeight:'40vh',
    maxHeight:'40vh',
    backgroundColor: '#384358'
  }
  const socialcontainer={
    
    minHeight:'100%'
  }
  return(
  <nav className="sidebar">

    <div className="socialBar" style={friendsstyle}>
      
      <h4 style={{color:"white"}}>Friends</h4>
      <div className='friendscontainer' style={socialcontainer}>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
      </div>
    </div>
    <div className="socialBar" style={groupsstyle}>
    <h4 style={{color:"white"}}>Groups</h4>
    <div className='friendscontainer' style={socialcontainer}>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
        <div className='socCon'>
          <SocialDisplay></SocialDisplay>
        </div>
      </div>
    </div>
  </nav>
  )
}

function SocialDisplay(){
  const onlinestyle={
    color:'#888888',
    fontSize:'10px',
    border:'none',
    padding:'6px'
  }
  return(
    <div className="Socialdisplay">
     <div className='square' ><div className="imageinsquare"></div></div><p style={{fontSize:'14px'}}>your friend<p1 style={onlinestyle}>35min ago</p1></p><p style={{textAlign:'left', fontSize:'12px'}}>X: Maybe</p>
      
    </div>
  )
}
export default App;
