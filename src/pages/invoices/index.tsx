import { Route, Routes } from 'react-router-dom';

import InvoiceList from './InvoiceList';
import InvoiceAdd from './add';
import InvoiceEdit from './edit';
import InvoiceDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Invoices = () => {
  return (
    <>
      <SideNavbar active="Invoices" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<InvoiceList isEditable={true} />} />
          <Route path={endpoints.admin.invoices.add} element={<InvoiceAdd />} />
          <Route path={endpoints.admin.invoices.edit} element={<InvoiceEdit />} />
          <Route path={endpoints.admin.invoices.detail} element={<InvoiceDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Invoices;
