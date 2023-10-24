import React from 'react'
import io from "socket.io-client";
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
} from "./Routes";

const socket = io('http://localhost:4000');
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:email/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/result" element={<VoteResultPage socket={socket} />} />
        <Route element={<PrivatePage />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vote" element={<VotingPage socket={socket} />} />
        </Route>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App