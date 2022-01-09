import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import Signup from "pages/signup";
import Signin from "pages/signin";
import { endpoints } from "common/config";
import ResetPassword from "pages/resetPassword";
import ChangePassword from "pages/changePassword";
import AdminDashboard from "common/components/layouts/AdminDashboard";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={endpoints.auth.signup} element={<Signup />} />
        <Route path={endpoints.auth.signin} element={<Signin />} />
        <Route
          path={endpoints.auth.resetPassword}
          element={<ResetPassword />}
        />
        <Route
          path={endpoints.auth.changePassword}
          element={<ChangePassword />}
        />
        <Route path="/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
