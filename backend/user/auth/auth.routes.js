import express from 'express';
import catchAsyncErrorsMiddleware from '../../middleware/catchAsyncErrors.middleware.js';
import { activateUser, createUser, forgotPassword, login, logout, newActivationCode, refreshToken, resetPassword } from "./auth.controller.js";

const router = express.Router();

router
  .post(`/signup`, catchAsyncErrorsMiddleware(createUser))
  .post("/login", catchAsyncErrorsMiddleware(login))
  .post("/logout", catchAsyncErrorsMiddleware(logout))
  .post("/refresh", catchAsyncErrorsMiddleware(refreshToken))
  .post("/activate", catchAsyncErrorsMiddleware(activateUser))
  .post("/new-activation-code", catchAsyncErrorsMiddleware(newActivationCode))
  .post("/forgot-password", catchAsyncErrorsMiddleware(forgotPassword))
  .post("/reset-password", catchAsyncErrorsMiddleware(resetPassword));

export default router;

