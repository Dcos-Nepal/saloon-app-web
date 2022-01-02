import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import Schedules from "pages/schedules";
import Dashboard from "pages/dashboard";
import ClientAdd from "pages/clients/add";
import { endpoints } from "common/config";
import ClientsList from "pages/clients/list";
import ReferralProgram from "pages/referral";
import RequestsList from "pages/requests/list/RequestsList";

interface IProps {
  location?: any;
}

const AdminDashboard: FC<IProps> = (): JSX.Element => {
  return (
    <main>
      <Routes>
        <Route path={endpoints.admin.home} element={<Dashboard />} />
        <Route
          path={endpoints.admin.schedules.calendar}
          element={<Schedules />}
        />
        <Route path={endpoints.admin.client.list} element={<ClientsList />} />
        <Route path={endpoints.admin.client.add} element={<ClientAdd />} />
        <Route
          path={endpoints.admin.referral.program}
          element={<ReferralProgram />}
        />
        <Route
          path={endpoints.admin.requests.list}
          element={<RequestsList />}
        />
      </Routes>
    </main>
  );
};

export default AdminDashboard;
