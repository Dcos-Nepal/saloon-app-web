import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Booking from 'pages/booking';
import Signin from 'pages/auth/signin';
import Dashboard from 'pages/dashboard';
import { endpoints } from 'common/config';
import ResetPassword from 'pages/auth/resetPassword';
import ChangePassword from 'pages/auth/changePassword';
import { SignUp, VerifyEmail } from 'pages/auth/signup';
import PrivacyPolicy from 'pages/privacy-policy';
import PageNotFound from 'pages/NotFound';
import ConnectionError from 'pages/ConnectionError';

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path={endpoints.auth.signIn} element={<Signin />} />
        <Route path={endpoints.auth.signUp} element={<SignUp />} />
        <Route path={endpoints.auth.changePassword} element={<ChangePassword />} />
        <Route path={endpoints.auth.resetPassword} element={<ResetPassword />} />
        <Route path={endpoints.auth.verifyEmail} element={<VerifyEmail />} />
        <Route path={endpoints.booking.add} element={<Booking />} />
        <Route path={endpoints.admin.home + '/*'} element={<Dashboard />} />
        <Route path="/connection-error" element={<ConnectionError />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
