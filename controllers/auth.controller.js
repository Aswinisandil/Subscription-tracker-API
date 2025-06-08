import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN } from '../config/env.js';

const generateAccessToken = (userId) => {
  return jwt.sign({userId}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN})
}

const generateRefreshToken = (userId) => {
    return jwt.sign({userId}, REFRESH_TOKEN, { expiresIn: REFRESH_TOKEN_EXPIRES_IN})
  }

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        console.log('Body:', req.body);
        console.log('name:', name, 'email:', email, 'password:', password);

        //check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User doesnot exist')
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Password is not Valid');
            error.statusCode = 401; //Unauthorized
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken,{
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,})
        .status(200)
        .json({
            success: true,
            message: 'User Signed in successfully',
            data: {
                token,
                user,
            }
        })
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async(req, res, next) => {
    try{
      const token = req.cookies.refreshToken;
      if(!token) throw new Error('No refresh token');

      const payload = jwt.verify(token, REFRESH_TOKEN);
      const user = await User.findById(payload.userId);
      if(!user || user.refreshToken !== token) throw new Error('Invalid refresh token');

      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;

      await user.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,})
        .json({ accessToken: newAccessToken})

    } catch(error){
        res.clearCookie('refreshToken');
        next(error)
    }
}


export const signOut = async (req, res, next) => {
   try{
    const token = req.cookies.refreshToken;
    if(token){
        const payload = jwt.verify(token, REFRESH_TOKEN);
        const user = await User.findById(payload.userId);
        if(user){
            user.refreshToken = null;
            await user.save();
        }
    }
    res.clearCookie('refreshToken').status(200).json({
        success:true,
        message: 'User signed out successfully'
    })
   } catch(error){
    next(error);
   }
};