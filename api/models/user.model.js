import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:  { 
        type: String,
        required: [true, 'Please provide your username'],
        unique: true,
     },
     email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
     },
     password: {
        type: String,
        required: [true, 'Please provide your password'],
     }
   
});

const User = mongoose.model("User", userSchema);

export default User;