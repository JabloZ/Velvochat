import logo from './logo.svg';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage}></Route>
        <Route path="/login" Component={LoginPage}></Route>
        <Route path="/register" Component={RegisterPage}></Route>
      </Routes>
    </Router>

  );
}

export default App;
