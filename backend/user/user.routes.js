import express from "express";
import { updateUser, deleteUser, getAllUsers } from "./user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import catchAsyncErrorsMiddleware from "../middleware/catchAsyncErrors.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";


const router = express.Router();

router
    .get("/", [verifyToken, isAdmin], catchAsyncErrorsMiddleware(getAllUsers))
    .put("/:id", verifyToken, catchAsyncErrorsMiddleware(updateUser))
    .delete("/:id", verifyToken, catchAsyncErrorsMiddleware(deleteUser))


export default router;