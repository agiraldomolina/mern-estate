import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: 'API route is working!!!'
    });
}

export const updateUser = async (req, res, next) => {
    console.log('user id is:' + req.params.id);
    console.log(req.cookies.access_token);
    
    const token = req.cookies.access_token;
    console.log(token);
    
   console.log('logged in user id is:' + JSON.stringify (req.user));
    // const userId = req.user._id;
    // console.log(userId);

    if(req.user._id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        console.log("datos del body: " +JSON.stringify(req.body) );
        console.log("datos del nombre en body: " +JSON.stringify(req.body.username) );
        const updatedUser= await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });
        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
        console.log("update user: " + JSON.stringify(rest) );
    } catch (error) {
        next(error)
    }
}