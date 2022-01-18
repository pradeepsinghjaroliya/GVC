import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import React, { useState } from 'react';
import axios from 'axios';


const appId = "acd56b28c24642e0b303cb5d5fbdd6dd"
const token="006acd56b28c24642e0b303cb5d5fbdd6ddIABFZdy2RpQwi4CU13xgQQInNZmTI4NcdV7SitebR+lNhcqFUwsAAAAAEABLPQ3JTgPoYQEAAQBbA+hh"

export const Settings=(props)=> {
    //required item channelname,username.pass
    const username = props.username;
	const channelname = props.channelname;
	const pass = props.pass;
    // const tok = async () =>{
    //     await axios.get(`http://localhost:5000/access_token?channelName=${channelname}`)
    //                 .then( res => {
    //                     const tk=res.data.token;
    //                     console.log("token:");
    //                     console.log(tk);
    //                     return tk;
    //                 })
    // } 
    //gettoken();

        /** call backend server on path /access_token 
         * with req containing channelName
         * uid,expireTime,role to be added
         * in res token
         */
    //token= tok;
    //return ;
}
//to use this setting call Settings(6);


export const config = {mode: "rtc", codec: "vp8", appId: appId, token: token};
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "temp";