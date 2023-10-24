import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return next(new ErrorHandler("Token is invalid", 401));;

    const token = authHeader.split(' ')[1];
    //verify to return either error or the user
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) return next(new ErrorHandler("Token is invalid...", 401));
      
      req.user = decoded.id
      next();
    });
}