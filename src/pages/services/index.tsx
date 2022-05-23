import { Route, Routes } from 'react-router-dom';

import ServicesListList from './list/ServicesList';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const ServicesList = () => {
  return (
    <>
      <SideNavbar active="Services" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<ServicesListList />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default ServicesList;
