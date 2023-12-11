import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        typeof: String,
        required: true,
        unique: true,
    },
    email: {
        typeof: String,
        required: true,
        unique: true,
    },
    password: {
        typeof: String,
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;