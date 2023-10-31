import User from "../user.model.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendToken } from "../../utils/SendToken.js";
import * as argon2 from "argon2";
import { sendMail } from "../../utils/sendMail.js";

export const verifyHackedUser = async(refreshToken, next) => 
{
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      async (err, decoded) => {
        if (err) return next(new ErrorHandler("Token is not valid", 403));

        const hackedUser = await User.findOne({ _id: decoded.id });

        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );
}

export const verifyRefreshToken = (refreshToken, user, newRefreshTokenArray, res, next) => {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (err, decoded) => {
        if(err){
            user.refreshToken = [...newRefreshTokenArray];
            await user.save();
            return next(new ErrorHandler("Token is not valid", 403));
        }
        
        if (err || user._id.toString() !== decoded.id)
          return next(new ErrorHandler("Token is not valid", 403));
        const accessToken = await sendToken(
          user,
          process.env.ACCESS_SECRET_KEY,
          process.env.ACCESS_EXPIRES
        );
        
         return res.status(200).json({ accessToken });

    });
}

export const createResetToken =  (user) => {
  
  const payload = {id: user._id, email: user.email}
  const token = jwt.sign(payload,process.env.RESET_SECRET, {expiresIn: '10m'} );

  return token;
}

export const createActivationToken = (user) => {
  const payload = {id: user._id, email: user.email}
  const token = jwt.sign(payload, process.env.ACTIVATION_SECRET, {expiresIn: '10m'});

  return token
}

//creates a 6 digit OTP
export const createOTP = () => {
  const result = Math.random().toString(36).substring(2, 8);
  return result;
}

export const createOTPAndSaveUser = async (user) => {
  const otp = createOTP();

    const hashedOtp = await argon2.hash(otp, 10);
    
    user.activationToken = {
      activationOTP: hashedOtp,
      timeCreated: Date.now(),
      expirationTime: Date.now() + 1800000,
    };
    
    await user.save();

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `<p style="font-size:20px;">Hello ${user.username}, use the OTP below to activate your account </p> <p style="color: red; font-size:20px;">Kindly note that the OTP expires within 30 minutes.</p> <br> <h1 style="color: #333; font-size: 30px;">${otp}</h1>`,
    }); 
}

export const createMFAOTPAndSave = async (user) => {
    const otp = createOTP();

    const hashedOtp = await argon2.hash(otp, 10);
    
    user.mfaToken = {
      mfaOTP: hashedOtp,
      timeCreated: Date.now(),
      expirationTime: Date.now() + 600000,
    };
    
    await user.save();

    await sendMail({
      email: user.email,
      subject: "Login into your account",
      message: `<p style="font-size:20px;">Hello ${user.username}, use the OTP below to login into your account </p> <p style="color: red; font-size:20px;">Kindly note that the OTP expires within 10 minutes.</p> <br> <h1 style="color: green; font-size: 30px;">${otp}</h1>`,
    }); 
}