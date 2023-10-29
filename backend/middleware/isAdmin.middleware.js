import ErrorHandler from "../utils/ErrorHandler.js";

const isAdmin = async (req, res, next) => {
    if(req.user.role !== 'Admin') return next( new ErrorHandler('Unauthorized user.', 403));

    req.user;
    next();
}

export default isAdmin;