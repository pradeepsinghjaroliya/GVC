//import
import express, { response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from "./routes/users.js";
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
//api routes            
app.use("/users", Users);
//app.use("/todos", Todo);

//listen
app.listen(port,() => console.log(`Server listening on localhost: ${port}...`))