import { Route, Routes } from "react-router-dom";

import RequestsAdd from "./add";
import RequestsList from "./list";
import { endpoints } from "common/config";

const Requests = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<RequestsList />} />
        <Route path={endpoints.admin.requests.add} element={<RequestsAdd />} />
      </Routes>
    </>
  );
};

export default Requests;
