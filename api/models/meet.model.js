import mongoose from 'mongoose';

const meetSchema = new mongoose.Schema({
  channelname: { type: String, required: true,minlength: 3 },
  pass: { type: String, required: true, minlength: 3 },
  expiry: { type: String },
  name: { type: String },
  email: { type: String },
  token: { type: String },
});


const Meet = mongoose.model("meet", meetSchema);
export default Meet;