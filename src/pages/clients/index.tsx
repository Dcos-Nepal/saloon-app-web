import { FC } from "react";
import { endpoints } from "common/config";
import { Route, Routes } from "react-router-dom";

import ClientAdd from "./add";
import ClientEdit from "./edit";
import ClientsList from "./list";
import ClientDetail from "./detail";

const Clients: FC<any> = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientsList />} />
        <Route path={endpoints.admin.client.add} element={<ClientAdd />} />
        <Route
          path={endpoints.admin.client.edit}
          element={<ClientEdit {...props} />}
        />
        <Route
          path={endpoints.admin.client.detail}
          element={<ClientDetail {...props} />}
        />
      </Routes>
    </>
  );
};

export default Clients;
