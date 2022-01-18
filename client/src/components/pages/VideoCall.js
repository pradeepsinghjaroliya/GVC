import { useState, useEffect, useContext } from "react";
import {
	config,
	useClient,
	useMicrophoneAndCameraTracks,
	channelName,
	//Settings
} from "./Settings.js";
import { Grid } from "@material-ui/core";
import Video from "./Video";
import Controls from "./Controls";
import { Context } from "../../context/Context.js";


export default function VideoCall(props) {
	const [inCall, setInCall] = useContext(Context);
	const username = props.username;
	const channelname = props.channelname;
	const pass = props.pass;
	//const callsettings = Settings({username:username, channelname:channelname, pass:pass});
	const [users, setUsers] = useState([]);
	const [start, setStart] = useState(false);
	const client = useClient();
	const { ready, tracks } = useMicrophoneAndCameraTracks();
	const [trackState, setTrackState] = useState({ video: true, audio: true });


	useEffect(() => {
		let init = async (name,username) => {
			client.on("user-published", async (user, mediaType) => {
				
				await client.subscribe(user, mediaType);
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

			client.on("user-left", (user) => {
				setUsers((prevUsers) => {
					return prevUsers.filter((User) => User.uid !== user.uid);
				});
			});

			try {
				await client.join(config.appId, name, config.token, props.username);
			} catch (error) {
				console.log("error");
			}

			if (tracks) await client.publish([tracks[0], tracks[1]]);
			setStart(true);
		};

		if (ready && tracks) {
			try {
				//Settings({username:username, channelname:channelname, pass:pass});
				init(channelName,username);
			} catch (error) {
				console.log(error);
			}
		}
	}, [channelName, client, ready, tracks]);

	return (
		<Context.Provider value={{ustate: [users, setUsers] ,tstate:[trackState, setTrackState], sInCall:[inCall, setInCall] }}>
		<Grid container direction="column" style={{ height: "100%", minHeight:"90vh" }}>
			<Grid item style={{ height: "95%" }}>
				{start && tracks && <Video tracks={tracks} />}
				{console.log(users)}
			</Grid>
			<Grid item style={{ height: "5%" }}>
				{ready && tracks && (
					<Controls tracks={tracks} setStart={setStart} />
				)}
			</Grid>
		</Grid>
		</Context.Provider>
	);
}
