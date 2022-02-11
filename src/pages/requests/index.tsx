import { Route, Routes } from "react-router-dom";

import RequestsAdd from "./add";
import RequestEdit from "./edit";
import RequestsList from "./list";
import RequestDetail from "./detail";
import { endpoints } from "common/config";

const Requests = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<RequestsList />} />
        <Route path={endpoints.admin.requests.add} element={<RequestsAdd />} />
        <Route path={endpoints.admin.requests.edit} element={<RequestEdit />} />
        <Route
          path={endpoints.admin.requests.detail}
          element={<RequestDetail />}
        />
      </Routes>
    </>
  );
};

export default Requests;
