import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import Booking from "pages/booking";
import Signin from "pages/auth/signin";
import Dashboard from "pages/dashboard";
import { endpoints } from "common/config";
import ResetPassword from "pages/auth/resetPassword";
import ChangePassword from "pages/auth/changePassword";
import { Signup, VerifyEmail } from "pages/auth/signup";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path={endpoints.auth.signin} element={<Signin />} />
        <Route path={endpoints.auth.signup} element={<Signup />} />
        <Route
          path={endpoints.auth.changePassword}
          element={<ChangePassword />}
        />
        <Route
          path={endpoints.auth.resetPassword}
          element={<ResetPassword />}
        />
        <Route path={endpoints.auth.verifyEmail} element={<VerifyEmail />} />
        <Route path={endpoints.booking.add} element={<Booking />} />
        <Route path={endpoints.admin.home + "/*"} element={<Dashboard />} />
        <Route path="*" element={<div>Page not found!</div>} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
