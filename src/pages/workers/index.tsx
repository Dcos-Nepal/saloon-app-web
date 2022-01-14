import { endpoints } from "common/config";
import { Route, Routes } from "react-router-dom";
import ClientAdd from "./add";
import ClientsList from "./list";

const Workers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientsList />} />
        <Route
          path={endpoints.admin.client.add}
          element={<ClientAdd />}
        />
      </Routes>
    </>
  );
};

export default Workers;
