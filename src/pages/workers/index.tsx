import { Route, Routes } from "react-router-dom";

import WorkerAdd from "./add";
import WorkerEdit from "./edit";
import WorkersList from "./list";
import WorkerDetail from "./detail";
import { endpoints } from "common/config";

const Workers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WorkersList />} />
        <Route path={endpoints.admin.worker.add} element={<WorkerAdd />} />
        <Route path={endpoints.admin.worker.edit} element={<WorkerEdit />} />
        <Route
          path={endpoints.admin.worker.detail}
          element={<WorkerDetail />}
        />
      </Routes>
    </>
  );
};

export default Workers;
