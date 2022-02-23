import { Route, Routes } from 'react-router-dom';

import RequestsAdd from './add';
import RequestEdit from './edit';
import RequestsList from './list';
import RequestDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Requests = () => {
  return (
    <>
      <SideNavbar active="Requests" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<RequestsList />} />
          <Route path={endpoints.admin.requests.add} element={<RequestsAdd />} />
          <Route path={endpoints.admin.requests.edit} element={<RequestEdit />} />
          <Route path={endpoints.admin.requests.detail} element={<RequestDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Requests;
