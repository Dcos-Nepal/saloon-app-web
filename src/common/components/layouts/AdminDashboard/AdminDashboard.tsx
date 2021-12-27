import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import Schedules from "pages/schedules";
import Dashboard from "pages/dashboard";
import ClientsList from "pages/clients/list";

interface IProps {
  location?: any;
}

const AdminDashboard: FC<IProps> = (): JSX.Element => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/clients" element={<ClientsList />} />
      </Routes>
    </main>
  );
};

export default AdminDashboard;
