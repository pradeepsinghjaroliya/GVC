import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../../components/misc/ErrorNotice";
import Navbar from "../layout/Navbar";

// import "./Register.css";

function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = { email, password, passwordCheck, displayName };
      await axios.post("http://localhost:5000/users/register", newUser);
      const loginResponse = await axios.post(
        "http://localhost:5000/users/login",
        {
          email,
          password,
        }
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
        email: loginResponse.data.user.email,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      navigate("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <>
      <div className="min-vh-100 bg-primary">
        {/* navbar */}
        <Navbar />
        {/* register form */}
        <div className="container-fluid">
          <div className="container  ">
            <div className="row justify-content-center  register-form">
              <div className="col-lg-6 mx-auto">
                <img
                  src="./img/welcoming-illustration.gif"
                  className="img-fluid mx-auto w-100 py-5 my-auto"
                  alt="login-video-gif"
                />
              </div>
              <div className="col-lg-4 mx-auto">
                <div className="card right-side ">
                  <div className="card-title text-center pt-5">
                    <img
                      src="./img/register1.gif"
                      className="img-fluid "
                      style={{ height: 150 }}
                      alt
                    />
                    <h2 className="text-primary">Register</h2>
                  </div>
                  {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                  <div className="card-body border-top border-primary rounded-3">
                    <form action="#" onSubmit={submit}>
                      <label htmlFor="InputUsername" className="text-muted">
                        Username
                      </label>
                      <div className="input-group  mb-3 mt-2">
                        <div className="input-group-prepend ">
                          <span className="input-group-text bg-primary">
                            <i className="text-white bi bi-person-circle" />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          id="InputUsername"
                          onChange={e => setDisplayName(e.target.value)}
                          placeholder="Enter Username"
                          required
                        />
                      </div>
                      <label htmlFor="InputPassword" className="text-muted">
                        Password
                      </label>
                      <div className="input-group mb-3 mt-2">
                        <div className="input-group-prepend ">
                          <span className="input-group-text bg-primary">
                            <i className="text-white bi bi-key-fill" />
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          autoComplete="off"
                          id="InputPassword"
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Enter Password"
                          required
                        />
                      </div>
                      <label
                        htmlFor="InputConfirmPassword"
                        className="text-muted"
                      >
                        Confirm Password
                      </label>
                      <div className="input-group mb-3 mt-2">
                        <div className="input-group-prepend ">
                          <span className="input-group-text bg-primary">
                            <i className="text-white bi bi-key" />
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          autoComplete="off"
                          id="InputConfirmPassword"
                          onChange={e => setPasswordCheck(e.target.value)}
                          placeholder="Enter Confirm Password"
                          required
                        />
                      </div>
                      <label htmlFor="InputEmail" className="text-muted">
                        Email Address
                      </label>
                      <div className="input-group  mb-3 mt-2">
                        <div className="input-group-prepend ">
                          <span className="input-group-text bg-primary">
                            <i className="text-white bi bi-envelope-fill" />
                          </span>
                        </div>
                        <input
                          type="email"
                          className="form-control"
                          autoComplete="off"
                          id="InputEmail"
                          placeholder="Enter Your Email"
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="d-grid my-5">
                        <button
                          type="submit"
                          id="basicAlert"
                          className="btn btn-primary text-white login-btn"
                        >
                          Create Account
                        </button>
                        <div className="text-center pt-3 ">
                          Already have an account?
                          <Link
                            to={'/login'}
                            className="text-primary mx-2 text-decoration-none font-weight-bold "
                          >
                            Login
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
      </div>
    </>
    // <div className="register">
    //     <h2>Register</h2>
    //     {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
    //     <form className='register-form' onSubmit={submit}>
    //         <label>Email: </label>
    //         <input type="email" id="email" onChange={e => setEmail(e.target.value)}/>
    //         <label>Password: </label>
    //         <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>
    //         <input type="password" placeholder="Confirm password" onChange={e => setPasswordCheck(e.target.value)}/>
    //         <label>Display name: </label>
    //         <input type="text" id="dsplay-name" onChange={e => setDisplayName(e.target.value)}/>
    //         <input type="submit" value="Register" className="register-btn" />
    //     </form>
    //     <h4>Already have an account?<Link to={'/login'}>Login</Link></h4>
    // </div>
  );
}

export default Register;
