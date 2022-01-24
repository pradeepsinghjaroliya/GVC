import {createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { createClient } from "agora-rtc-react";


const appId = "acd56b28c24642e0b303cb5d5fbdd6dd"
//const tik ="006acd56b28c24642e0b303cb5d5fbdd6ddIADHuvPVbkRrIUnRPaY6Fypkmlp39N5xpj6zjY34khk4g8qFUwsAAAAAEABLPQ3JrPjtYQEAAQC7+O1h"
//var tk="";
// export function Settings(props){
//     //required item channelname,username.pass
//         /** call backend server on path /access_token 
//          * with req containing channelName
//          * uid,expireTime,role to be added
//          * in res token
//          */
//     return tk ;
// }



export const config = {mode: "rtc", codec: "vp8", appId: appId};
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();