import express from "express";
import catchAsyncErrorsMiddleware from "../middleware/catchAsyncErrors.middleware.js";
import { createVote, getAllVotes, validateVote, voteStats} from "./votes.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router
    .post("/", verifyToken ,catchAsyncErrorsMiddleware(createVote))
    .post("/validate", verifyToken, catchAsyncErrorsMiddleware(validateVote))
    .get("/", catchAsyncErrorsMiddleware(getAllVotes))
    .get("/stats", catchAsyncErrorsMiddleware(voteStats))



export default router;