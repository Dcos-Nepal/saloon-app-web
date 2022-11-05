import { Route, Routes } from 'react-router-dom';

import OrderDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { OrderList } from './list';

const Quotes = () => {
  return (
    <>
      <SideNavbar active="Quotes" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<OrderList isToday={true} />} />
          {/* <Route path={endpoints.admin.quotes.add} element={<ClientQuoteAdd />} /> */}
          {/* <Route path={endpoints.admin.quotes.edit} element={<ClientQuoteAdd />} /> */}
          <Route path={endpoints.admin.quotes.detail} element={<OrderDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Quotes;
