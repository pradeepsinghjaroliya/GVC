import React from "react"
// import "./ErrorNotice.css"
// import CloseIcon from "@mui/icons-material/Close"

function ErrorNotice(props) {
  return (
    <>
      {/* <div className="error-notice-cont">
        <p className="error-notice-msg">{props.message}</p>
        <button className="error-notice-btn" onClick={props.clearError}>
          <CloseIcon />
        </button>
      </div> */}
      <div class="d-flex justify-content-between alert alert-danger py-1 my-2">
        {props.message}
        <button className="btn" onClick={props.clearError}>
          <span className="text-danger">X</span>
        </button>
      </div>
    </>
  )
}

export default ErrorNotice
