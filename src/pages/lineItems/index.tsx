import { Route, Routes } from 'react-router-dom';

import JobsList from './list/LineItemsList';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Jobs = () => {
  return (
    <>
      <SideNavbar active="LineItems" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<JobsList />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Jobs;
