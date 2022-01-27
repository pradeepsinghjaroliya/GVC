import React from 'react';
import "./ErrorNotice.css";
import CloseIcon from "@mui/icons-material/Close";

function ErrorNotice (props) {
    return (
        <div className="error-notice-cont">
            <p className="error-notice-msg">{props.message}</p>
            <button className='error-notice-btn' onClick={props.clearError}><CloseIcon /></button>
        </div>
    );
}

export default ErrorNotice;