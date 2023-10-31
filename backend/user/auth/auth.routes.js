import express from 'express';
import catchAsyncErrorsMiddleware from '../../middleware/catchAsyncErrors.middleware.js';
import { activateUser, createUser, forgotPassword, imageUpload, login, logout, newActivationCode, newMFACode, refreshToken, resetPassword, twoFactorLogin } from "./auth.controller.js";
const router = express.Router();
;

router
  .post(`/signup`, catchAsyncErrorsMiddleware(createUser))
  .post("/login", catchAsyncErrorsMiddleware(login))
  .post("/mfa-login", catchAsyncErrorsMiddleware(twoFactorLogin))
  .post("/logout", catchAsyncErrorsMiddleware(logout))
  .post("/refresh", catchAsyncErrorsMiddleware(refreshToken))
  .post("/activate", catchAsyncErrorsMiddleware(activateUser))
  .post("/new-activation-code", catchAsyncErrorsMiddleware(newActivationCode))
  .post("/new-mfa-code", catchAsyncErrorsMiddleware(newMFACode))
  .post("/forgot-password", catchAsyncErrorsMiddleware(forgotPassword))
  .post("/reset-password", catchAsyncErrorsMiddleware(resetPassword))
  .post("/addPicture", catchAsyncErrorsMiddleware(imageUpload))


export default router;