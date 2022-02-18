import { Route, Routes } from "react-router-dom";

import InvoiceList from "./InvoiceList";
import InvoiceAdd from "./add";
import InvoiceDetail from "./detail";
import { endpoints } from "common/config";

const Jobs = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path={endpoints.admin.invoices.add} element={<InvoiceAdd />} />
        <Route path={endpoints.admin.invoices.edit} element={<InvoiceAdd />} />
        <Route
          path={endpoints.admin.invoices.detail}
          element={<InvoiceDetail />}
        />
      </Routes>
    </>
  );
};

export default Jobs;
