import React from 'react';
import { Routes, Route } from 'react-router-dom';


import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';



export function SignRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

