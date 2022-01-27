import React, { useState, useContext } from "react";
import VideoCall from "./VideoCall.js";
import { Context } from "../../context/Context.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import Navbar from "../layout/Navbar";
import ErrorNotice from"../../components/misc/ErrorNotice"
import { Button } from "@material-ui/core";
// import "./HomeMain.css";

function HomeMain() {
  const [inCall, setInCall] = useState(false);
  const [name, setName] = useState("");
  const [channelname, setChannelname] = useState("");
  const [pass, setPass] = useState("");
  const [expiry, setExpiry] = useState("");
  const [token,setToken] = useState("");
  const [error, setError] = useState();

  const { userData, setUserData } = useContext(UserContext);
  const email = userData.email;
  const navigate = useNavigate();

//   useEffect(() => {
//   	if (!userData.user) navigate("/login");
//   }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (userData.user) {
      setName(userData.user.displayName);
    }
    //joining room
    try {
      const joinRoom = { channelname, pass };
      const meetResponse = await axios.post("http://localhost:5000/meet/join",
        joinRoom
      )
      console.log(meetResponse.data.token);
      setToken(meetResponse.data.token);
      
    setInCall(true);
    } catch (err) {
      console.log(err);
      err.response.data.msg && setError(err.response.data.msg);
    }

  };

  const handleCreate = async(e) => {
    e.preventDefault();
    if (userData.user) {
      setName(userData.user.displayName);
    }
    //creating room
    try {
      const createRoom = { channelname, pass, expiry, name:userData.user.displayName, email:userData.email };
      await axios.post(
        "http://localhost:5000/meet/create",
        createRoom
      );
      const meetResponse = await axios.post("http://localhost:5000/meet/join",{
        channelname, pass
      })
      console.log(meetResponse.data.token);
      setToken(meetResponse.data.token);

      //room created & token generated
      setInCall(true);
    } catch (err) {
      console.log(err);
      err.response.data.msg && setError(err.response.data.msg);
    }

  };

	//   show hide toggle
	const [createToggle,setCreateToggle] = useState(false);
	const [joinToggle,setJoinToggle] = useState(false);

  return (
    <>
      <div className=" bg-white">
        {/* navbar */}
        <Navbar />
        {/* main-window */}
        <Context.Provider value={[inCall, setInCall]}>
          {inCall ? (
            <VideoCall username={name} channelname={channelname} pass={pass} token={token}/>
          ) : (
            <div className="container home-container">
              <div className="row">
                <div className="col-lg-6 home-left-side">
                  <img src="./img/video-conference.gif" alt="" />
                </div>
                <div className="col-lg-4 mx-auto home-right-side">
                  <div className="card bg-transparent">
                    <div className="card-text text-color display-3 mx-auto">
                      Meeting
                    </div>
                    <div className="text-center text-muted disabled pb-3">
                      You can either create meet using create button or
                      join meet by clicking on join button
                    </div>
                    <hr className="text-primary border-2" />
					 {/* craete and join btn */}
					 <div className="d-flex justify-content-around ">
                      <div
                        className="btn btn-outline-primary btn-lg px-5"
                        style={{ width: "200px" }}
                        id="CreateBtn"
						onClick={()=>{setCreateToggle(!createToggle) ; setJoinToggle(false)}}
                      >
                        Create Call
                      </div>
                      <div
                        className="btn btn-outline-primary btn-lg px-5"
                        style={{ width: "200px" }}
                        id="JoinBtn"
						onClick={()=>{setCreateToggle(false) ; setJoinToggle(!joinToggle)}}
                      >
                        Join Call
                      </div>
                    </div>	
                    {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}

                    {/* create join form */}
                    <div id="form-create-join">
                      {/* create form */}
                      {createToggle?<form 
                      className="py-4" 
                      onSubmit={handleCreate}
                      id="Create-Form-Toggle">
                        <input
                          type="text"
                          className="form-control my-2"
                          onChange={(e) => setChannelname(e.target.value)}
                          value={channelname}
                          placeholder="Create Channel Name"
                          required
                        />
                        <input
                          type="text"
                          className="form-control my-2"
                          placeholder="Create Password"
                          onChange={(e) => setPass(e.target.value)}
                          value={pass}
                          required
                        />
                        <input
                          type="text"
                          className="form-control my-2"
                          onChange={(e) => setExpiry(e.target.value)}
                          value={expiry}
                          placeholder="Expire Time hh/mm/ss"
                          required
                        />
                        {/* submit button */}
                        <div className="text-center">
                          <button
                            className="btn bg-color text-white btn-lg"
                            type="submit"
                          >
                            Create
                          </button>
                        </div>
                      </form>:null}
                      {/* join form */}
                      {joinToggle?<form
                        className="py-4"
                        id="Join-Form-Toggle"
                        onSubmit={handleSubmit}
                      >
                        {/* <input type="text" class="form-control my-2" placeholder="Enter Join ID"> */}
                        <input
                          type="text"
                          className="form-control my-2"
                          placeholder="Enter Channel Name"
                          onChange={(e) => setChannelname(e.target.value)}
                          value={channelname}
                          required
                        />
                        <input
                          type="text"
                          className="form-control my-2"
                          placeholder="Enter Password"
                          onChange={(e) => setPass(e.target.value)}
                          value={pass}
                          required
                        />
                        {/* submit button */}
                        <div className="text-center">
                          <button
                            className="btn bg-color text-white btn-lg"
                            type="submit"
                          >
                            {" "}
                            Join
                          </button>
                        </div>
                      </form>:null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Context.Provider>
      </div>
    </>
    // ______________________________Pradeep Code_______________________________
    // <div className="HomeMain" >
    // <Context.Provider value={[inCall, setInCall]}>
    // {inCall ? (
    // 	<VideoCall username={name} channelname={channelname} pass={pass} />
    // ) : (
    // 		<div>
    // 			<form onSubmit={handleSubmit}>
    // 				<input
    // 					onChange={(e) => setChannelname(e.target.value)}
    // 					value={channelname}
    // 					placeholder="Enter Channel Name"
    // 				></input>
    // 				<input
    // 					onChange={(e) => setPass(e.target.value)}
    // 					value={pass}
    // 					placeholder="Enter pass"
    // 				></input>
    // 				<button type="submit">Join Call</button>
    // 			</form>
    // 		</div>
    // )}
    // </Context.Provider>
    // </div>
  );
}

export default HomeMain;
