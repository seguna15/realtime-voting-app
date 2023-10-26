import Joi from "joi";
import User from "../user.model.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendToken } from "../../utils/SendToken.js";
import { sendAuthCookie } from "../../utils/createAuthCookie.js";
import { createResetToken, verifyHackedUser, verifyRefreshToken } from "./auth.service.js";
import { sendMail } from "../../utils/sendMail.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      role: Joi.string().min(3).max(30).required(),
      email: Joi.string().min(3).max(200).required().email(),
      password: Joi.string().min(6).max(200).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return next(new ErrorHandler(error.details[0].message, 400)); 
    const {username, email, role, password} = req.body;

    try {
      const existingUsername = await User.findOne({username});
      if (existingUsername)
        return next(new ErrorHandler("Record already exist", 409));
      const existingMail = await User.findOne({ email});
      if (existingMail)
        return next(new ErrorHandler("Record already exist", 409));

      const newUser = new User({username, email, role, password});
      await newUser.save();

      return res.status(201).json({message: "User created successfully"});
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
}


export const login = async (req, res, next) => {
  const cookies = req.cookies;
  const {email, password} = req.body;
   if (!email || !password) return next(new ErrorHandler("Username and password are required.", 400));
  try {
    const validUser = await User.findOne({email});
    if(!validUser) return next( new ErrorHandler('User not found', 404));
    
    const validPassword = await validUser.comparePassword(password);
    if (!validPassword) return next( new ErrorHandler("Wrong credentials", 403));
    
    const newRefreshToken = await sendToken(
      validUser,
      process.env.REFRESH_SECRET_KEY,
      process.env.REFRESH_EXPIRES
    );

    const accessToken = await sendToken(
      validUser,
      process.env.ACCESS_SECRET_KEY,
      process.env.ACCESS_EXPIRES
    );

    //if no cookies keep the refreshTokens but if there is cookies only keep the ones that do not match the cookies
    let newRefreshTokenArray = !cookies?.MERNAuthToken ? validUser.refreshToken : validUser.refreshToken.filter((rt) =>  rt !== cookies.MERNAuthToken)
    
    if(cookies?.MERNAuthToken){
      const refreshToken = cookies.MERNAuthToken;
      const foundToken = await User.findOne({refreshToken});

      if(!foundToken){
        newRefreshTokenArray = [];
      }

      res
        .clearCookie("MERNAuthToken", {httpOnly: true});
        
    }

    validUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await validUser.save();

    const { password: hashedPassword, refreshToken, ...rest } = validUser._doc;

    await sendAuthCookie(newRefreshToken, 201, res);
  
    return res.status(200).json({rest, accessToken});
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if(!cookies?.MERNAuthToken) return next(new ErrorHandler('Unauthenticated user', 403));
  try {
    const refreshToken = cookies.MERNAuthToken;

    const foundUser = await User.findOne({ refreshToken });
    
    //detected reuse
    if (!foundUser) {
      await verifyHackedUser(refreshToken, next);
      return next(new ErrorHandler("Token is not valid", 403));
    }

    const newRefreshArrayToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    await verifyRefreshToken(
      refreshToken,
      foundUser,
      newRefreshArrayToken,
      res,
      next
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
  
}

export const logout = async (req, res, next) => {
  const cookies = req.cookies;
  if(!cookies?.MERNAuthToken) return res.status(204).json({ message: "Logged out successfully" });
  try {
    const refreshToken = cookies.MERNAuthToken;
    const foundUser = await User.findOne({refreshToken});
    if(!foundUser) {
      res.clearCookie("MERNAuthToken")
      return res.status(204).json({ message: "Logged out successfully" });
    } 
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    await foundUser.save();
    res.clearCookie("MERNAuthToken").status(204).json({ message: "Logged out successfully" });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export const forgotPassword = async (req, res, next) => {
  const {email} = req.body;
  if(!email) return next(new ErrorHandler('Kindly enter email', 400));

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(new ErrorHandler("User not found", 404));

    //create token
    const resetToken = createResetToken(validUser);
    validUser.resetToken = resetToken;
    await validUser.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${validUser.email}/${resetToken}`;
    
    await sendMail({
      email: validUser.email,
      subject: "Activate your account",
      message: `Hello ${validUser.username}, click on the link to reset password ${resetUrl}`,
    }); 
    return res.status(201).json({
      success: true,
      message: `Kindly check your email ${validUser.email} to reset password`,
    });
     
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export const resetPassword = async(req, res, next) => {
  const {email, token, password} = req.body;
  
  try {
    const verifyToken = jwt.verify(token, process.env.RESET_SECRET);

    if (!verifyToken) return next(new ErrorHandler("Token is not valid", 403));
   
    const foundToken = await User.findOne({ token });
    if (!foundToken) return next(new ErrorHandler("User does not exist", 404));
  
    //if(!updatedUser) return next(new ErrorHandler("User does not exist", 404));
    const user = await User.findOne({email});
    if (!user) return next(new ErrorHandler("User does not exist", 404));

    user.password = password;
    await user.save();
   
    return res.status(201).json({success: true, message: "Password updated successfully"});
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
  
  
}