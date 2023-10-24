import User from "../user.model.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendToken } from "../../utils/SendToken.js";

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