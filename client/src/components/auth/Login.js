import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../../components/misc/ErrorNotice";
import Navbar from "../layout/Navbar";
// import "./Login.css";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginResponse = await axios.post(
        "http://localhost:5000/users/login",
        loginUser
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
        email: loginResponse.data.user.email,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      // navigate("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <>
      <div className="min-vh-100 bg-primary">
      <Navbar />
      {/* login opening */}
      <div className="container-fluid">
        <div className="container">
          <div className="row justify-content-center login-form">
            <div className="col-lg-6  mx-auto">
              <img
                src="./img/secure-login.gif"
                className="img-fluid mx-auto"
                alt="login-video-gif"
              />
            </div>
            <div className="col-lg-4  mx-auto py-5">
              <div className="card right-side ">
                <div className="card-title text-center ">
                  <img
                    src="img/lock-animation.gif"
                    className="img-fluid p-2 "
                    style={{ height: 100 }}
                    alt=""
                  />
                  <h2 className="p-3 text-primary">Login</h2>
                </div>
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <div className="card-body border-top border-primary rounded-3">
                  <form onSubmit={submit}>
                    <label htmlFor="InputEmail" className="text-muted">
                      Email Address
                    </label>
                    <div className="input-group  mb-3 mt-2">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-primary">
                          <i className="bi bi-envelope-fill text-white" />
                        </span>
                      </div>
                      <input
                        type="email"
                        className="form-control"
                        autoComplete="off"
                        // id="InputEmail"
                        id="email" 
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter Your Email"
                        required
                      />
                    </div>
                    <label htmlFor="InputPassword" className="text-muted">
                      Password
                    </label>
                    <div className="input-group mb-3 mt-2">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-primary">
                          <i className="bi bi-key-fill text-white" />
                        </span>
                      </div>
                      <input
                        type="password"
                        className="form-control"
                        autoComplete="off"
                        // id="InputPassword"
                        placeholder="Enter Password"
                        id="password" 
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-3 text-white login-btn"
                      >
                        Login
                      </button>
                      <div className="text-center pt-3 ">
                        Don't have account ? 
                        <Link
                          to={"/register"}
                          className="text-primary px-2 text-decoration-none"
                        >
                          Resigter
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* login closing */}
      </div>
    </>
    // ---------------------------- Pradeep Code -----------------------------------
    // <div className="login">
    //     <h2>Login</h2>
    //     {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
    //     <form className='login-form' onSubmit={submit}>
    //         <label>Email: </label>
    //         <input type="email" id="email" onChange={e => setEmail(e.target.value)}/>
    //         <label>Password: </label>
    //         <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>
    //         <input type="submit" value="Login" className="login-btn" />
    //     </form>
    //     <h4>If you are a new user <Link to={'/register'}>Register</Link></h4>
    // </div>
  );
}

export default Login;
