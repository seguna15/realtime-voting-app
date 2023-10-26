import express from "express";
import catchAsyncErrorsMiddleware from "../middleware/catchAsyncErrors.middleware.js";
import { createCandidate, deleteCandidate, getAllCandidates, getCandidate, updateCandidate } from "./candidate.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.middleware.js";

const router = express.Router();

router
    .get("/", catchAsyncErrorsMiddleware(getAllCandidates))
    .get("/:id", [verifyToken, isAdmin], catchAsyncErrorsMiddleware(getCandidate))
    .post("/",[verifyToken, isAdmin], catchAsyncErrorsMiddleware(createCandidate))
    .put("/:id", [verifyToken, isAdmin], catchAsyncErrorsMiddleware(updateCandidate))
    .delete("/:id",[verifyToken, isAdmin], catchAsyncErrorsMiddleware(deleteCandidate))

export default router;
