import { AgoraVideoPlayer } from "agora-rtc-react"
import { Grid } from "@material-ui/core"
import { useState, useEffect, useContext, useMemo } from "react"
import { Context } from "../../context/Context.js"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"
import MicOffIcon from "@material-ui/icons/MicOff"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import "./Video.css"

export default function Video(props) {
  //taking props
  const { tracks } = props
  //storing context states
  const { ustate, tstate } = useContext(Context)
  //adding states separately
  const [trackState, setTrackState] = tstate
  const [users, setUsers] = ustate
  //storing users in separate state for operation
  const [lusers, setLusers] = useState([])
  //for grid spacing
  const [gridSpacing, setGridSpacing] = useState(12)

  const data = useMemo(() => {
    return [...users]
  }, [users])

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (lusers.length + 1)), 4))

    setLusers(data)
  }, [tracks, trackState, lusers, data])

  return (
    <Grid container style={{ height: "100%", minHeight: "85vh" }} spacing={2}>
      <Grid item xs={gridSpacing}>
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
          <AgoraVideoPlayer
            videoTrack={tracks[1]}
            style={{ height: "100%", width: "100%" }}
          >
            {console.log(tracks)}
            <p
              className="align-items-end"
              style={{
                position: "absolute",
                color: "red",
                zIndex: "1",
              }}
            >
              You {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}{" "}
              {trackState.audio ? <MoreHorizIcon /> : <MicOffIcon />}{" "}
            </p>
          </AgoraVideoPlayer>
        </div>
      </Grid>
      {lusers.length > 0 &&
        lusers.map((user) => {
          {
            console.log(user)
          }
          if (user.videoTrack) {
            return (
              <Grid
                key={user.uid}
                item
                xs={gridSpacing}
                style={{ backgroundColor: "dimgrey" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    id="videoTracks"
                    key={user.uid}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <p
                      style={{
                        position: "absolute",
                        color: "lightgrey",
                        zIndex: "1",
                      }}
                    >
                      {user.uid}
                      {user.videoTrack ? (
                        <VideocamIcon />
                      ) : (
                        <VideocamOffIcon />
                      )}{" "}
                      {user.audioTrack ? <MoreHorizIcon /> : <MicOffIcon />}
                    </p>
                  </AgoraVideoPlayer>
                </div>
              </Grid>
            )
          } else {
            return (
              <Grid
                key={user.uid}
                item
                xs={gridSpacing}
                style={{ backgroundColor: "dimgrey" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      width: "100%",
                      position: "absolute",
                      color: "lightgrey",
                      zIndex: "1",
                    }}
                  >
                    {user.uid}
                    {user.videoTrack ? (
                      <VideocamIcon />
                    ) : (
                      <VideocamOffIcon />
                    )}{" "}
                    {user.audioTrack ? <MoreHorizIcon /> : <MicOffIcon />}
                  </p>
                </div>
              </Grid>
            )
          }
        })}
    </Grid>
  )
}
