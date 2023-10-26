import express from "express";
import { updateUser, deleteUser } from "./user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import catchAsyncErrorsMiddleware from "../middleware/catchAsyncErrors.middleware.js";


const router = express.Router();

router
    .put("/:id", verifyToken, catchAsyncErrorsMiddleware(updateUser))
    .delete("/:id", verifyToken, catchAsyncErrorsMiddleware(deleteUser))


export default router;