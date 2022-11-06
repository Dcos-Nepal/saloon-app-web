import { Route, Routes } from 'react-router-dom';

import OrdersList from './list';
import ClientQuoteAdd from './add';
import ClientQuoteDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Orders = () => {
  return (
    <>
      <SideNavbar active="Orders" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<OrdersList />} />
          <Route path={endpoints.admin.order.add} element={<ClientQuoteAdd />} />
          <Route path={endpoints.admin.order.edit} element={<ClientQuoteAdd />} />
          <Route path={endpoints.admin.order.detail} element={<ClientQuoteDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Orders;
