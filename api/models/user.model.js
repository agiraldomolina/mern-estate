import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
   console.log(candidatePassword, userPassword);
   return await bcrypt.compare(candidatePassword, userPassword);
 };
 

const User = mongoose.model("User", userSchema);

export default User;