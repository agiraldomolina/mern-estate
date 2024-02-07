import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {errorHandler} from  '../utils/error.js';
import { catchAsync } from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password:hashedPassword  });
  await newUser.save();
  res.status(201).json('User created successfully');    
})

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!email || !password)  return next(errorHandler(404, 'Please provide email and password'));  
  if(!validUser || !await validUser.correctPassword(password,validUser.password)) return next(errorHandler (404, 'Invalid credentials')) ;
  const token = jwt.sign({ _id: validUser._id }, process.env.JWT_SECRET);
  const {password: pass, ...rest} = validUser._doc;
  res.cookie('access_token', token, {httpOnly: true})
  .status(200)
  .json(rest); 
})

export const google = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }); 
  if (user) {
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
    const {password: pass,...rest} = user._doc;
    res
    .cookie('access_token', token, {httpOnly: true})
    .status(200)
    .json(rest);
  }else {
    const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    const newUser = new User({ username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password:hashedPassword, avatar: req.body.photo });
    await newUser.save();
    const token = jwt.sign({ _id: newUser._id}, process.env.JWT_SECRET);
    const {password: pass,...rest} = newUser._doc;
    res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
  }  
})

export const signOut = catchAsync(async (req, res, next) => {
  res.clearCookie('access_token');
  res.status(200).json('User has been logged out!');      
})