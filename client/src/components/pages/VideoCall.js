import { useState, useEffect, useContext, useRef } from "react";
import {
	config,
	useClient,
	usessClient,
	mclient,
	useMicrophoneAndCameraTracks,
} from "./Settings.js";
import AgoraRTM from 'agora-rtm-sdk';
import { Grid } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Video from "./Video";
import Controls from "./Controls";
import { Context } from "../../context/Context.js";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function VideoCall(props) {
	const [inCall, setInCall] = useContext(Context);
	const username = props.username;
	const channelname = props.channelname;
	const pass = props.pass;
	const channel = channelname + pass;
	const token = props.token;
	const mtoken = props.mtoken;
	//const callsettings = Settings({username:username, channelname:channelname, pass:pass});
	const [users, setUsers] = useState([]);
	const [start, setStart] = useState(false);
	const client = useClient();
	const ss_client = usessClient();
	const { ready, tracks } = useMicrophoneAndCameraTracks();
	const [txt, setTxt] = useState("");
	const [currentmsg, setCurrentmsg] = useState();
	const [msg, setMsg] = useState([]);
	const [trackState, setTrackState] = useState({ video: true, audio: true });
	const [sshare,setSshare] = useState(false);
	let options = {
		uid: username,
		token: mtoken,
	};
	const mchannel = useRef(mclient.createChannel(channel)).current;

	const mSubmit = async (e) => {
		e.preventDefault();
		try {
			if(mclient.connectionState!="CONNECTED"){
				console.log("time to join again...");
				try{
					await mclient.login(options);
				}
				finally{
					await mchannel.join();
				}
			}
			let cmsg = txt.toString();
			await mchannel
				.sendMessage({ text: cmsg })
				.then(() => {
					console.log("sending msg...");
					console.log("(" + username + "): " + cmsg);
					setCurrentmsg({
						user: { name: "You" },
						message: cmsg,
					});
				})
				.catch((err) => console.log(err));
			setTxt("");
		} catch (err) {
			console.log(err);
		}
	};

	const screenshare = async() =>{
		if(!sshare){
			const ss_uid=username+"_screen";
			const joinRoom = { channelname, pass };
      		const Response = await axios.post("http://localhost:5000/meet/join",
        		joinRoom
      		)
      		console.log(Response.data.token);
			const ss_token=Response.data.token;
			const ss_audioTrack = AgoraRTC.createMicrophoneAudioTrack();
			const ss_screenTrack = await AgoraRTC.createScreenVideoTrack({
				encoderConfig: {
				  framerate: 15,
				  height: 720,
				  width: 1280
				}
			  }, "auto")
			const ss_tracks = [ss_screenTrack];
			console.log("starting ss");
			console.log(ss_uid);
			await ss_client.join(config.appId, channel, ss_token, ss_uid);
			console.log("joined ss");
			await ss_client.publish([ss_screenTrack[1],ss_screenTrack[0]]);
			console.log("publishing ss");
			  setSshare(true);
		}
		else{
			await ss_client.leave();
			setSshare(false);
		}
	}
	

	useEffect(() => {
		if (currentmsg) setMsg([...msg, currentmsg]);
	}, [currentmsg]);

	useEffect(() => {
		let init = async (name, username) => {
			mchannel.on("ChannelMessage", async (message, username) => {
				console.log("(" + username + "): " + message.text);
				const newMsg = { user: { name: username }, message: message.text };
				setCurrentmsg(newMsg);
			});
			// if(sshare){
			// 	AgoraRTC.ss_screenTrack.on('track-ended', () =>{
			// 		console.log("stopping screen share..")
			// 	})
			// }
			client.on("user-published", async (user, mediaType) => {
				console.log(user);
				await client.subscribe(user, mediaType);
				//console.log(user);
				if (mediaType === "video") {
					setUsers((prevUsers) => {
						return prevUsers.filter((User) => User.uid !== user.uid);
					});
					setUsers((prevUsers) => {
						return [...prevUsers, user];
					});
				}
				if (mediaType === "audio") {
					user.audioTrack.play();
				}
			});

			client.on("user-unpublished", (user, mediaType) => {
				if (mediaType === "audio") {
					if (user.audioTrack) user.audioTrack.stop();
				}
				if (mediaType === "video") {
					/*setUsers((prevUsers) => {
						return prevUsers.filter((User) => User.uid !== user.uid);
					});*/
					if (user.videoTrack) user.videoTrack.stop();
				}
			});

			client.on("user-left", async (user) => {
				setUsers((prevUsers) => {
					return prevUsers.filter((User) => User.uid !== user.uid);
				});

				await mchannel.leave();
				console.log("Channel leave");

				console.log("logging out");
				await mclient
					.logout()
					.then(() => {
						console.log("Client logged out.");
					})
					.catch(() => {
						console.log("log out failed");
					});
			});

			try {
				//using token
				await client.join(config.appId, name, token, props.username);
				//using rtm
				await mclient.login(options);
				console.log("logged in");
				await mchannel.join();
				console.log("joinned");
			} catch (error) {
				console.log("error");
			}

			if (tracks) await client.publish([tracks[0], tracks[1]]);
			setStart(true);
		};

		if (ready && tracks) {
			try {
				//Settings({username:username, channelname:channelname, pass:pass});
				init(channel, username);
			} catch (error) {
				console.log(error);
			}
		}
	}, [channel, client, ready, tracks, token, mtoken]);

	return (
		<Context.Provider
			value={{
				ustate: [users, setUsers],
				tstate: [trackState, setTrackState],
				sInCall: [inCall, setInCall],
			}}
		>
			<div className="videocall-cont" style={{ display: "flex" }}>
				<Grid
					container
					direction="column"
					style={{ height: "100%", minHeight: "90vh", width: "75vw" }}
				>
					<Grid item style={{ height: "95%" }}>
						{start && tracks && <Video tracks={tracks} />}
						{console.log(users)}
					</Grid>
					<Grid item style={{ height: "5%", backgroundColor: "whitesmoke" }}>
						{ready && tracks && (
							<Controls tracks={tracks} setStart={setStart} />
						)}
					</Grid>
				</Grid>
				<div
					className="msg-cont"
					style={{
						width: "25vw",
						backgroundColor: "#e9ecef",
						height: "92.5vh",
						display:"flex",
						flexDirection:"column",
					}}
				>
					<h3>Messages</h3>
					<div
						style={{
							height: "74.5vh",
							backgroundColor: "ghostwhite",
							border: "1px solid",
							overflowY: "scroll",
						}}
					>
						{msg.map((data, index) => {
							return (
								<div
									className="row"
									key={`chat${index + 1}`}
									style={{ margin: "0px", padding: "0px" }}
								>
									{console.log(data)}
									<h6
										style={{ margin: "0px", padding: "0px" }}
									>{`${data.user.name} :`}</h6>
									<p
										style={{ margin: "0px", padding: "0px" }}
									>{` ${data.message}`}</p>
								</div>
							);
						})}
					</div>
					<form
						onSubmit={mSubmit}
						style={{ height: "40px", display: "flex", alignItems: "center" }}
					>
						<textarea
							type="text"
							placeholder="Send message to everyone"
							id="channelMessage"
							onChange={(e) => setTxt(e.target.value)}
							value={txt}
							style={{
								flex: "1",
								height: "40px",
								overflow: "hidden",
								fontSize: "13px",
							}}
						/>
						<button
							type="submit"
							id="send_channel_message"
							style={{
								height: "40px",
								width: "40px",
								backgroundColor: "#3f51b5",
								color: "white",
								border: "none",
							}}
						>
							<SendIcon />
						</button>
					</form>


					<div className="extra-btn" style={{display:"flex",height:"7.4vh",width:"25vw",justifyContent:"space-around",alignItems:"center"}}>
						<button
							type="button"
							id="screen_share"
							onClick={screenshare}
							style={{
								height: "45px",
								width: "45px",
								backgroundColor: "#3f51b5",
								color: "white",
								border: "1px black",
								borderRadius:"20px",

							}}
						>
							{(sshare)?  <StopScreenShareIcon />: <ScreenShareIcon /> }
						</button>
						<button
							type="button"
							id="start_recording"
							//onClick={}
							style={{
								height: "40px",
								width: "40px",
								backgroundColor: "#3f51b5",
								color: "white",
								border: "none",
							}}
						>
							<RecordVoiceOverIcon />
						</button>
					</div>
				</div>
			</div>
		</Context.Provider>
	);
}
