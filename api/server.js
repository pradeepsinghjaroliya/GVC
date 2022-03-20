//import
import express, { response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import axios from "axios";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from "./routes/users.js";
import Meet from "./models/meet.model.js";
//import Todo from "./routes/todo.js";
import pkg from 'agora-access-token';
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = pkg;


//app config
dotenv.config();
const app = express();
const port = process.env.PORT||5000 ;


//db config
const uri= process.env.URI;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open',() => {console.log("mongodb connected successfully...")});



//middlewares
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000',
  }));
app.use(express.json());
app.use(cookieParser());

//agora token server code
const APP_ID=process.env.APP_ID;
const APP_CERTIFICATE=process.env.APP_CERTIFICATE;

const nocache = (req,res,next) =>{
  res.header('Cache-Control','private, no-cache, no-store,must-revalidate');
  res.header('Expires','-1');
  res.header('Pragma','no-cache');
  next();
}

const generatemToken = (req,res) =>{
  //res header
  res.header('Acess-Control-Allow-Origin','*');
  //get channel name
  const id = req.query.id;
  if(!id){
    return res.status(500).json({'error':'id is required'});
  }
  //get uid
  let uid=req.query.uid;
  if(!uid || uid==''){
    uid=0;
  }
  //get role
  let role = RtmRole.Rtm_User;
  //get expire time
  let expireTime = req.query.expireTime;
  if(!expireTime || expireTime == ''){
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime,10);
  }
  //calculate privilege expire time
  const currentTime = Math.floor(Date.now() /1000);
  const privilegeExpireTime = currentTime + expireTime;
  //build token
  const token = RtmTokenBuilder.buildToken(APP_ID,APP_CERTIFICATE,id,role,privilegeExpireTime);
  console.log("RTM token:",token);

  //return token
  return res.json({'mtoken':token});
}

const generateAccessToken = (req,res) =>{
  //res header
  res.header('Acess-Control-Allow-Origin','*');
  //get channel name
  const channelName = req.query.channelName;
  if(!channelName){
    return res.status(500).json({'error':'channel is required'});
  }
  //get uid
  let uid=req.query.uid;
  if(!uid || uid==''){
    uid=0;
  }
  //get role
  let role = RtcRole.SUBSCRIBER;
  if(req.query.role == 'publisher'){
    role = RtcRole.PUBLISHER;
  }
  //get expire time
  let expireTime = req.query.expireTime;
  if(!expireTime || expireTime == ''){
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime,10);
  }
  //calculate privilege expire time
  const currentTime = Math.floor(Date.now() /1000);
  const privilegeExpireTime = currentTime + expireTime;
  //build token
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegeExpireTime);
  console.log("token:",token);

  //return token
  return res.json({'token':token});
}
//to use path will be:
//http://localhost:5000/access_token?channelName=test&role=subscriber&uid=psj&expireTime=1800


app.get('/access_token',nocache,generateAccessToken);
app.get('/access_mtoken',nocache,generatemToken);
//api routes            
app.use("/users", Users);
//app.use("/todos", Todo);

//meet routes
//**********************storing a meet**************

app.post('/meet/create',async(req,res) => {
  try{
    let {channelname, pass, expiry, name, email} = req.body;
    if(!channelname || !pass || !email)
      {
        console.log("not all feild entered");
        return res.status(400).json({ msg: "Not all fields have been entered!!!" });
    }
    if(channelname.length < 3 || pass.length <3 )
      {
        console.log("atleast 3 characters long required")
        return res.status(400).json({msg: "The channel name and password must be atleast 3 characters long!!!"});
      }
    const existingMeet = await Meet.findOne({channelname:channelname, pass:pass});
    if(existingMeet)
      {
        console.log("Meet already exists");
        return res.status(400).json({msg: "Meeting already exists!!! Try joining using join meet button."});
      }
    
      let channel = channelname + pass;
      console.log(channel);
      const token = await axios
      .get(`http://localhost:5000/access_token?channelName=${channel}`)
      .then((res) => {
        //setToken(res.data.token);
        //return res.json({'token':token});
        //console.log(res.data.token);
        return res.data.token;
      })
      .catch((err)=>console.log(err));


    const newMeet = new Meet({
      channelname,pass,expiry,name,email,token:token,
    });

    const savedMeet = await newMeet.save();
    res.json(savedMeet);
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }


});
//*********************connecting a meet*********

app.get('/meet/join',async(req,res) =>{
  try{
    console.log(req.query);
    const {channelname, pass } =req.query;
    if(!channelname || !pass){
      return res.status(400).json({ msg: "Not all fields have been entered!!!" });
    }
    const meet = await Meet.findOne({channelName: channelname, pass: pass});
    //console.log(meet.token);
    if(!meet){
      return res.status(400).json({msg:"No active meeting found!!!"});
    }
    
    //*********no need to generate token again, instead fetching from db */

    // const token = await axios
    //   .get(`http://localhost:5000/access_token?channelName=${channelname}`)
    //   .then((res) => {
    //     //setToken(res.data.token);
    //     //return res.json({'token':token});
    //     //console.log(res.data);
    //     return res.data.token;
    //   })
    //   .catch((err)=>console.log(err));

    const token = meet.token;
    console.log("meettoken:",token);
    res.json({
      token,
      meet:{
        channelname:channelname,
        pass: pass,
      }
    });

  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//listen
app.listen(port,() => console.log(`Server listening on localhost: ${port}...`))