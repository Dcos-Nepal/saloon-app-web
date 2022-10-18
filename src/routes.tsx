import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Signin from 'pages/signin';
import Dashboard from 'pages/dashboard';
import { endpoints } from 'common/config';
import PageNotFound from 'pages/NotFound';
import ConnectionError from 'pages/ConnectionError';

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path={endpoints.auth.signIn} element={<Signin />} />
        <Route path={endpoints.admin.home + '/*'} element={<Dashboard />} />
        <Route path="/connection-error" element={<ConnectionError />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
