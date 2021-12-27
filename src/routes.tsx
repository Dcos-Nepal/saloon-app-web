import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import AdminDashboard from "./common/components/layouts/AdminDashboard";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
