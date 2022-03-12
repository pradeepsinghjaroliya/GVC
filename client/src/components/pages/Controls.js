import { useState, useContext } from "react"
import { Context } from "../../context/Context.js"
import { useClient, mclient } from "./Settings"
import { Grid, Button } from "@material-ui/core"
import MicIcon from "@material-ui/icons/Mic"
import MicOffIcon from "@material-ui/icons/MicOff"
import VideocamIcon from "@material-ui/icons/Videocam"
import VideocamOffIcon from "@material-ui/icons/VideocamOff"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"

export default function Controls(props) {
  const client = useClient()
  const { tracks, setStart } = props
  const { ustate, tstate, sInCall } = useContext(Context)
  const [trackState, setTrackState] = tstate
  const [inCall, setInCall] = sInCall

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio)
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio }
      })
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video)
      setTrackState((ps) => {
        return { ...ps, video: !ps.video }
      })
    }
  }

  const leaveChannel = async () => {
    await client.leave()
    await mclient
      .logout()
      .then(() => {
        console.log("Client logged out.")
      })
      .catch(() => {
        console.log("log out failed")
      })
    client.removeAllListeners()
    tracks[0].close()
    tracks[1].close()
    setStart(false)
    setInCall(false)
  }

  return (
    <>
      {/* mic camera leave btn */}
      <div
        className="d-flex pt-5 px-4 my-3 fixed-bottom"
        style={{ width: "70vw" }}
      >
        <Grid
          container
          spacing={1}
          alignItems="center"
          style={{ width: "100%", margin: "0px" }}
        >
          <div className="flex-grow-1">
            <div className="btn px-2 mx-2">
              <Grid item>
                <Button
                  variant="contained"
                  color={trackState.audio ? "primary" : "secondary"}
                  onClick={() => mute("audio")}
                >
                  {trackState.audio ? <MicIcon /> : <MicOffIcon />}
                </Button>
              </Grid>
            </div>
            <div className="btn px-2 mx-2">
              <Grid item>
                <Button
                  variant="contained"
                  color={trackState.video ? "primary" : "secondary"}
                  onClick={() => mute("video")}
                >
                  {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
                </Button>
              </Grid>
            </div>
          </div>
          <div>
            <Grid item>
              <Button
                variant="contained"
                color="default"
                onClick={() => leaveChannel()}
              >
                Leave
                <ExitToAppIcon />
              </Button>
            </Grid>
          </div>
        </Grid>
      </div>
      {/* mic camera leave btn */}
    </>
  )
}
