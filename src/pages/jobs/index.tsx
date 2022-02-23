import { Route, Routes } from 'react-router-dom';

import JobsList from './JobList';
import ClientJobAdd from './add';
import EditJob from './edit/JobEdit';
import ClientJobDetail from './detail';
import { endpoints } from 'common/config';

const Jobs = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<JobsList />} />
        <Route path={endpoints.admin.jobs.add} element={<ClientJobAdd />} />
        <Route path={endpoints.admin.jobs.edit} element={<EditJob />} />
        <Route path={endpoints.admin.jobs.detail} element={<ClientJobDetail />} />
      </Routes>
    </>
  );
};

export default Jobs;
