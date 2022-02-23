import { Route, Routes } from 'react-router-dom';

import InvoiceList from './InvoiceList';
import InvoiceAdd from './add';
import InvoiceEdit from './edit';
import InvoiceDetail from './detail';
import { endpoints } from 'common/config';

const Invoices = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path={endpoints.admin.invoices.add} element={<InvoiceAdd />} />
        <Route path={endpoints.admin.invoices.edit} element={<InvoiceEdit />} />
        <Route path={endpoints.admin.invoices.detail} element={<InvoiceDetail />} />
      </Routes>
    </>
  );
};

export default Invoices;
