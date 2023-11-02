import ErrorHandler from "../utils/ErrorHandler.js"
import { findUserVoteAndDelete } from "../votes/vote.service.js";
import User from "./user.model.js";
import {ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase.js";

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(new ErrorHandler("You can only update your own account", 403));
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            }, 
            {new: true}
        )
        const {password,refreshToken, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const deleteUser = async (req, res, next) => {
   const {id} = req.params;
    try{
         if (req.user.id === id || req.user.role === "Admin") {
            const foundUser = await User.findById(id);
            if(!foundUser) return next (new ErrorHandler('User not found', 404));
            
            const desertRef = ref(storage, foundUser.profilePicture);
            
             // Delete the file
            await deleteObject(desertRef);
           
            
            await User.findByIdAndDelete(req.params.id);
            await findUserVoteAndDelete(req.params.id);
            return res.status(200).json("User has been deleted...");
         }
         return next(
           new ErrorHandler("You can only delete your own account", 403)
         );
        
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}

export const getAllUsers =  async (req, res, next) => {
    try{
         const {role} = req.user;
         if (!role || (role !== "Admin")) return next(new ErrorHandler("Unauthorized user"));
         const users = await User.find({ role: { $ne: "Admin" } }).select(
           "username email profilePicture activationStatus"
         );
         if(!users) return next(new ErrorHandler('No users found'), 404);
         return res.status(200).send(users);
    }catch(error) {
        return next(new ErrorHandler(error.message, 500))
    }
}
