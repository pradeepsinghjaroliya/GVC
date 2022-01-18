import React, { useState, useContext } from "react";
import VideoCall from "./VideoCall.js";
import { Context } from "../../context/Context.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import "./HomeMain.css";

function HomeMain() {
    const [inCall, setInCall] = useState(false);
	const [name, setName] = useState("");
	const [channelname, setChannelname] = useState("");
	const [pass, setPass] = useState("");

	const { userData, setUserData } = useContext(UserContext);
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!userData.user) navigate("/login");
	// }, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setInCall(true);
		if(userData.user){
			setName(userData.user.displayName);
		}
		console.log(`Form submitted...`);
	};

	return (
		<div className="HomeMain" >
			<Context.Provider value={[inCall, setInCall]}>
			{inCall ? (
				<VideoCall username={name} channelname={channelname} pass={pass} />
			) : (
				<div>
					<form onSubmit={handleSubmit}>
						<input
							onChange={(e) => setChannelname(e.target.value)}
							value={channelname}
							placeholder="Enter Channel Name"
						></input>
						<input
							onChange={(e) => setPass(e.target.value)}
							value={pass}
							placeholder="Enter pass"
						></input>
						<button type="submit">Join Call</button>
					</form>
				</div>
			)}
			</Context.Provider>
		</div>
	);
}


export default HomeMain;
