import React from 'react'
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  AboutPage,
  SignInPage,
  SignUpPage,
  ProfilePage,
  PrivatePage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VotingPage,
  VoteResultPage,
  NotFoundPage,
  AdminSignUpPage,
  AdminPrivatePage,
  CandidatePage,
  UsersPage,
  ActivateTokenPage,
  LoginTokenPage,
  CapturePage,
} from "./Routes";

const socket = io('http://localhost:4001');
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/capture/:email" element={<CapturePage/>}/>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:email/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/activation/:email" element={<ActivateTokenPage />} />
        <Route path="/sign-in/:email" element={<LoginTokenPage />} />
        <Route element={<PrivatePage />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vote" element={<VotingPage socket={socket} />} />
        </Route>

        <Route path="/admin/sign-up" element={<AdminSignUpPage />} />
        <Route path="/admin" element={<AdminPrivatePage />}>
          <Route
            path="/admin/result"
            element={<VoteResultPage socket={socket} />}
          />
          <Route path="/admin/candidates" element={<CandidatePage />} />
          <Route path="/admin/users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App