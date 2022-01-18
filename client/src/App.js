import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useState,useEffect} from 'react';
import axios from "axios";
import Navbar from "./components/layout/Navbar";
import Aboutus from "./components/pages/Aboutus";
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import UserContext from './context/userContext';

function App() {
  const [ userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if(token === null){
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post('http://localhost:5000/users/tokenIsValid', null, {headers: {"x-auth-token": token}});
      if (tokenResponse.data) {
        const userRes = await axios.get("http://localhost:5000/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    }

    checkLoggedIn();
  }, []);


  return (
    <div className="main-box">
      <UserContext.Provider value={{ userData, setUserData }}>
      <BrowserRouter >
        <Navbar />
        <div className='main-cont'><Routes >
          <Route path={'/'} exact element={<Home />} />
          <Route path={'/register'} element={<Register />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/about-us'} element={<Aboutus />} />
        </Routes></div>
      </BrowserRouter>
    </UserContext.Provider>
    </div>
  );
}

export default App;