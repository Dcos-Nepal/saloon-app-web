import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import { Signup, VerifyEmail } from "pages/signup";
import Signin from "pages/signin";
import { endpoints } from "common/config";
import ResetPassword from "pages/resetPassword";
import ChangePassword from "pages/changePassword";
import Dashboard from "pages/dashboard";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />}/>
        <Route path={endpoints.auth.signin} element={<Signin />} />
        <Route path={endpoints.auth.signup} element={<Signup />} />
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
