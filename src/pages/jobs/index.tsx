import { Route, Routes } from 'react-router-dom';

import JobsList from './JobList';
import ClientJobAdd from './add';
import EditJob from './edit/JobEdit';
import ClientJobDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Jobs = () => {
  return (
    <>
      <SideNavbar active="Jobs" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<JobsList />} />
          <Route path={endpoints.admin.jobs.add} element={<ClientJobAdd />} />
          <Route path={endpoints.admin.jobs.edit} element={<EditJob />} />
          <Route path={endpoints.admin.jobs.detail} element={<ClientJobDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Jobs;
