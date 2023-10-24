import ErrorHandler from "../utils/ErrorHandler.js"
import User from "./user.model.js";

export const updateUser = async (req, res, next) => {
    if(req.user !== req.params.id) return next(new ErrorHandler("You can only update your own account", 403));
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
    if(req.user !== req.params.id) return next(new ErrorHandler("You can only delete your own account", 403));

    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}
