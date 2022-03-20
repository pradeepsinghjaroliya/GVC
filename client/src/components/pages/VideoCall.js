import { useState, useEffect, useContext, useRef } from "react"
import {
  config,
  useClient,
  usessClient,
  mclient,
  useMicrophoneAndCameraTracks,
} from "./Settings.js"
import AgoraRTM from "agora-rtm-sdk"
import { Grid } from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
import ScreenShareIcon from "@material-ui/icons/ScreenShare"
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare"
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver"
import ShareIcon from '@material-ui/icons/Share';
import Video from "./Video"
import Controls from "./Controls"
import Sharelink from "./Sharelink"
import { Context } from "../../context/Context.js"
import axios from "axios"
import AgoraRTC from "agora-rtc-sdk-ng"

export default function VideoCall(props) {
  const [inCall, setInCall] = useContext(Context)
  const username = props.username
  const channelname = props.channelname
  const pass = props.pass
  const channel = channelname + pass
  const token = props.token
  const mtoken = props.mtoken
  //const callsettings = Settings({username:username, channelname:channelname, pass:pass});
  const [users, setUsers] = useState([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const ss_client = usessClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()
  const [txt, setTxt] = useState("")
  const [currentmsg, setCurrentmsg] = useState()
  const [msg, setMsg] = useState([])
  const [trackState, setTrackState] = useState({ video: true, audio: true })
  const [shareLink,setShareLink]=useState(false)
  const [sshare, setSshare] = useState(false)
  let options = {
    uid: username,
    token: mtoken,
  }
  const mchannel = useRef(mclient.createChannel(channel)).current

  const mSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mclient.connectionState != "CONNECTED") {
        console.log("time to join again...")
        try {
          await mclient.login(options)
        } finally {
          await mchannel.join()
        }
      }
      let cmsg = txt.toString()
      await mchannel
        .sendMessage({ text: cmsg })
        .then(() => {
          console.log("sending msg...")
          console.log("(" + username + "): " + cmsg)
          setCurrentmsg({
            user: { name: "You" },
            message: cmsg,
          })
        })
        .catch((err) => console.log(err))
      setTxt("")
    } catch (err) {
      console.log(err)
    }
  }

  const screenshare = async () => {
    if (!sshare) {
      const ss_uid = username + "_screen"
      const joinRoom = { channelname, pass }
      const Response = await axios.get(
        'http://localhost:5000/meet/join',
        {params:{ channelname:channelname, pass:pass }}
      )
      console.log(Response.data.token)
      const ss_token = Response.data.token
      const ss_audioTrack = AgoraRTC.createMicrophoneAudioTrack()
      const ss_screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: {
            framerate: 15,
            height: 720,
            width: 1280,
          },
        },
        "auto"
      )
      const ss_tracks = [ss_screenTrack]
      console.log("starting ss")
      console.log(ss_uid)
      await ss_client.join(config.appId, channel, ss_token, ss_uid)
      console.log("joined ss")
      await ss_client.publish([ss_screenTrack[1], ss_screenTrack[0]])
      console.log("publishing ss")
      setSshare(true)
    } else {
      await ss_client.leave()
      setSshare(false)
    }
  }

  const togglePopup = () => {
    setShareLink(!shareLink);
  }

  useEffect(() => {
    if (currentmsg) setMsg([...msg, currentmsg])
  }, [currentmsg])

  useEffect(() => {
    let init = async (name, username) => {
      mchannel.on("ChannelMessage", async (message, username) => {
        console.log("(" + username + "): " + message.text)
        const newMsg = { user: { name: username }, message: message.text }
        setCurrentmsg(newMsg)
      })
      // if(sshare){
      // 	AgoraRTC.ss_screenTrack.on('track-ended', () =>{
      // 		console.log("stopping screen share..")
      // 	})
      // }
      client.on("user-published", async (user, mediaType) => {
        console.log(user)
        await client.subscribe(user, mediaType)
        //console.log(user);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid)
          })
          setUsers((prevUsers) => {
            return [...prevUsers, user]
          })
        }
        if (mediaType === "audio") {
          user.audioTrack.play()
        }
      })

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop()
        }
        if (mediaType === "video") {
          /*setUsers((prevUsers) => {
						return prevUsers.filter((User) => User.uid !== user.uid);
					});*/
          if (user.videoTrack) user.videoTrack.stop()
        }
      })

      client.on("user-left", async (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid)
        })

        await mchannel.leave()
        console.log("Channel leave")

        console.log("logging out")
        await mclient
          .logout()
          .then(() => {
            console.log("Client logged out.")
          })
          .catch(() => {
            console.log("log out failed")
          })
      })

      try {
        //using token
        await client.join(config.appId, name, token, props.username)
        //using rtm
        await mclient.login(options)
        console.log("logged in")
        await mchannel.join()
        console.log("joinned")
      } catch (error) {
        console.log("error")
      }

      if (tracks) await client.publish([tracks[0], tracks[1]])
      setStart(true)
    }

    if (ready && tracks) {
      try {
        //Settings({username:username, channelname:channelname, pass:pass});
        init(channel, username)
      } catch (error) {
        console.log(error)
      }
    }
  }, [channel, client, ready, tracks, token, mtoken])

  return (
    <Context.Provider
      value={{
        ustate: [users, setUsers],
        tstate: [trackState, setTrackState],
        sInCall: [inCall, setInCall],
      }}
    >
      {/* flex-display */}
      <div
        className="row mx-3 my-2"
        style={{ height: "85vh", display: "flex" }}
      >
        {/* grid-window */}
        <div
          className="col-9 col-lg-9 border"
          style={{ width: "75vw !important" }}
        >
          {/* grid */}
          <Grid container direction="column">
            <Grid item style={{ height: "95%" }}>
              {start && tracks && <Video tracks={tracks} />}
              {console.log(users)}
            </Grid>
          </Grid>
        </div>
        {/* grid-window */}
        {/* message-window */}
        <div
          className="col border"
          style={{ width: "25vw !important", marginLeft: "1.3rem" }}
        >
          <h6 className="text-center border h5 py-2 bg-light w-100">
            Messages
          </h6>
          <div style={{ height: "73vh", overflowY: "scroll" }}>
            <div className="px-4">
              {msg.map((data, index) => {
                return (
                  <div
                    className="row py-1"
                    key={`chat${index + 1}`}
                    style={{ margin: "0px", padding: "0px" }}
                  >
                    {console.log(data)}

                    {data.user.name == "You" ?
                      <div
                      className=""
                      style={{ margin: "0px", padding: "0px",color:"#33363b"}}
                    >
                      {`${data.user.name} :`}
                    </div>:<div
                      className="text-dark h6"
                      style={{ margin: "0px", padding: "0px"}}
                    >
                      {`${data.user.name} :`}
                    </div>}
                      
                  
                    <p
                      className="text-secondary  px-1 pb-2 "
                      style={{ margin: "0px", padding: "0px" }}
                    >{` ${data.message}`}</p>
                  </div>
                )
              })}
              {/* <h6>you :</h6>
              <h6 className="text-muted">msg</h6> */}
            </div>
          </div>
          {/* send btn*/}
          <form className="rounded-3 mx-3 my-2" onSubmit={mSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="border shadow-none  form-control "
                placeholder="Send message to everyone"
                id="channelMessage"
                onChange={(e) => setTxt(e.target.value)}
                value={txt}
                autoComplete="off"
              />
              <button
                className="btn shadow-none btn-outline-secondary border-secondary "
                type="submit"
                id="send_channel_message"
              >
                Send
              </button>
            </div>
          </form>
          {/* message-window */}
        </div>
        {/* flex-display */}
        {/* controls */}
        <div className="row">
          <div className="col-lg-9 py-3">
            {/* mic camera leave btn */}
            <Grid item style={{ height: "5%", backgroundColor: "" }}>
              {ready && tracks && (
                <Controls tracks={tracks} setStart={setStart} />
              )}
            </Grid>
          </div>
          <div className="col-lg-3">
            {/* sharing and recording btn */}
            <div className="d-flex  my-3 justify-content-around mx-5 px-5">
              <button
                className="btn btn-outline-secondary shadow-none px-2 "
                type="button"
                id="screen_share"
                onClick={screenshare}
              >
                {sshare ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </button>
              <button
                className="btn btn-outline-secondary shadow-none px-2 "
                type="button"
                id="start_recording"
                //onClick={}
              >
                <RecordVoiceOverIcon />
              </button>
              <button
                className="btn btn-outline-secondary shadow-none px-2"
                type="button"
                id="share_link"
                onClick={togglePopup}
              >
                <ShareIcon />
              </button>
            </div>
            {/* sharing and recording btn */}
          </div>
          {shareLink && <Sharelink
      content={<>
        <h3><b>Meeting Info</b></h3>
        <h4>Share this meeting info with others you want into the meeting</h4>
        <p>channelName: {channelname}</p>
        <p>pass: {pass}</p>
        <button>Copy the Message</button>
        <h4>Or share this link</h4>
        <p>http://localhost:3000//meet/join?channelname={channelname}&pass={pass}</p>
        <button>Copy the URL</button>
      </>}
      handleClose={togglePopup}
    />}
        </div>
        {/* controls */}
      </div>
      {/* pradeep code */}
      {/* <div className="videocall-cont " style={{ display: "flex" }}>
        <Grid
          container
          direction="column"
          style={{
            // height: "90vh",
            height: "100%",
            minHeight: "90vh",
            width: "75vw",
          }}
        >
          <Grid item style={{ height: "95%" }}>
            {start && tracks && <Video tracks={tracks} />}
            {console.log(users)}
          </Grid>
          <Grid item style={{ height: "5%", backgroundColor: "" }}>
            {ready && tracks && (
              <Controls tracks={tracks} setStart={setStart} />
            )}
          </Grid>
        </Grid>
        <div
          className="msg-cont my-3 border rounded-3 ml-2"
          style={{
            width: "23vw",
            // backgroundColor: "#e9ecef",
            height: "90.5vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            className="text-center py-1"
            style={{ backgroundColor: "ghostwhite" }}
          >
            Messages
          </h3>
          <div
            className="px-3 py-2"
            style={{
              height: "74.5vh",
              // backgroundColor: "ghostwhite",
              // border: "1px solid",
              overflowY: "scroll ",
            }}
          >
            {msg.map((data, index) => {
              return (
                <div
                  className="row py-1"
                  key={`chat${index + 1}`}
                  style={{ margin: "0px", padding: "0px" }}
                >
                  {console.log(data)}
                  <h6
                    style={{ margin: "0px", padding: "0px" }}
                  >{`${data.user.name} :`}</h6>
                  <p
                    className="text-muted "
                    style={{ margin: "0px", padding: "0px" }}
                  >{` ${data.message}`}</p>
                </div>
              )
            })}
          </div>
          <form
            className="mt-2 mx-2 border rounded-3"
            onSubmit={mSubmit}
            style={{ height: "35px", display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              className="border"
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

          <div
            className="extra-btn"
            style={{
              display: "flex",
              height: "7.4vh",
              width: "25vw",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
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
                borderRadius: "20px",
              }}
            >
              {sshare ? <StopScreenShareIcon /> : <ScreenShareIcon />}
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
      </div> */}
    </Context.Provider>
  )
}
