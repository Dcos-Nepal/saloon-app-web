import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import { SignUp, VerifyEmail } from "pages/auth/signup";
import SignIn from "pages/auth/signin";
import { endpoints } from "common/config";
import ResetPassword from "pages/auth/resetPassword";
import ChangePassword from "pages/auth/changePassword";
import Dashboard from "pages/dashboard";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />}/>
        <Route path={endpoints.auth.signIn} element={<SignIn />} />
        <Route path={endpoints.auth.signUp} element={<SignUp />} />
        <Route path={endpoints.auth.changePassword} element={<ChangePassword />} />
        <Route path={endpoints.auth.resetPassword} element={<ResetPassword />} />
        <Route path={endpoints.auth.verifyEmail} element={<VerifyEmail />} />
        <Route path={endpoints.admin.home + "/*"} element={<Dashboard />} />
        <Route path="*" element={<div>Page not found!</div>} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
