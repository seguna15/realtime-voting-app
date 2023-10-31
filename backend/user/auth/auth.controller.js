import Joi from "joi";
import User from "../user.model.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendToken } from "../../utils/SendToken.js";
import { sendAuthCookie } from "../../utils/createAuthCookie.js";
import { createMFAOTPAndSave, createOTPAndSaveUser, createResetToken, verifyHackedUser, verifyRefreshToken } from "./auth.service.js";
import { sendMail } from "../../utils/sendMail.js";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import {
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import {storage} from "../../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

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

      const newUser = new User({
        username,
        email,
        role,
        password,
      });
      
      await newUser.save();

      return res.status(201).json({ success: true, activation:"Next", email: newUser.email});
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
}


export const imageUpload = async (req, res, next) => {
  /*
   * 1. retrieve email, filename. 2. validate 3. fetchuser, 4. upload image, 5, if image uploaded, set profile url, 5. send activation token
   */
  try {
    const {email, image} = req.body;

    const foundUser = await User.findOne({email});
    if(!foundUser) return next(new ErrorHandler('User not found.', 404));
    const dateTime = new Date().getTime();

    const filename = `voters/${dateTime}-${uuidv4()}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadString(
      storageRef,
      image,
      "data_url"
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    if(!downloadURL) return next(new ErrorHandle('Upload failed', 504));
    
    foundUser.profilePicture = downloadURL;

    await createOTPAndSaveUser(foundUser);

    return res
      .status(201)
      .json({ success: true, activation: "Next", email: foundUser.email });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};


export const activateUser = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    if (!email || !otp) return next( new ErrorHandler('Some error occurred...', 400));

    const foundUser = await User.findOne({email});

    if(!foundUser)  return next(new ErrorHandler('User not found', 404));
    const userOTP = foundUser.activationToken.activationOTP;
    const compareOTP = await argon2.verify(userOTP, otp);

    if(!compareOTP){
      foundUser.activationToken = {};
      await foundUser.save();
      return next(new ErrorHandler("OTP does not match", 404));
    } 

    const checkExpiration = Date.now() > foundUser.activationToken.expirationTime;

    if(checkExpiration){
      foundUser.activationToken = {};
      return next(new ErrorHandler("OTP has expired", 403));
    } 

    foundUser.activationStatus = true;

    foundUser.activationToken = {}

    await foundUser.save();

    return res.status(200).json({success: true, message: "User activated successfully"});
    
  } catch (error) { 
    return next(new ErrorHandler(error.message, 500));
  }
}

export const newActivationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if(!email) return next(new ErrorHandler('Something went wrong!', 400));

    const foundUser = await User.findOne({email});

    if(!foundUser) return next(new ErrorHandler('User not found.', 404));
    
    await createOTPAndSaveUser(foundUser);

    return res
      .status(200)
      .json({ success: true, message: "Kindly check your mail for the activation code" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export const login = async (req, res, next) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandler("Username and password are required.", 400));

    const validUser = await User.findOne({ email });
    if (!validUser) return next(new ErrorHandler("User not found", 404));

    if (validUser.activationStatus === false) {
      await createOTPAndSaveUser(validUser);
      return res.status(200).json({
        success: false,
        status: "pending",
        email: validUser.email,
      });
    }

    await createMFAOTPAndSave(validUser);

    return res.status(200).json({
      success: true,
      status: "activated",
      email: validUser.email,
    });
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export const twoFactorLogin = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { email, otp } = req.body;
    if (!email || !otp)
      return next(new ErrorHandler("Some error occurred...", 400));

    const validUser = await User.findOne({ email });

    if (!validUser) return next(new ErrorHandler("User not found", 404));

    if (validUser.activationStatus === false) {
      await createOTPAndSaveUser(validUser);
      return res.status(200).json({
        success: false,
        status: "pending",
        email: validUser.email,
      });
    }

    const userOTP = validUser.mfaToken.mfaOTP;
    const compareOTP = await argon2.verify(userOTP, otp);

    if (!compareOTP){
      validUser.mfaToken = {};
      await validUser.save();
      return next(new ErrorHandler("MFA code does not match", 403));
    } 

    const checkExpiration =
      Date.now() > validUser.mfaToken.expirationTime;

    if (checkExpiration) {
      validUser.mfaToken = {};
      return next(new ErrorHandler("OTP has expired", 403));
    } 

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

export const newMFACode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Something went wrong!", 400));

    const foundUser = await User.findOne({ email });

    if (!foundUser) return next(new ErrorHandler("User not found.", 404));

    await createMFAOTPAndSave(foundUser);

    return res
      .status(200)
      .json({
        success: true,
        message: "Kindly check your mail for the MFA code",
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};


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
      subject: "Reset your password",
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



