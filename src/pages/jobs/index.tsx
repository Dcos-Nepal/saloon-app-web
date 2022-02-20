import { Route, Routes } from 'react-router-dom';

import JobEdit from './edit';
import JobsList from './JobList';
import ClientJobAdd from './add';
import ClientJobDetail from './detail';
import { endpoints } from 'common/config';

const Jobs = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<JobsList />} />
        <Route path={endpoints.admin.jobs.add} element={<ClientJobAdd />} />
        <Route path={endpoints.admin.jobs.edit} element={<JobEdit />} />
        <Route path={endpoints.admin.jobs.detail} element={<ClientJobDetail />} />
      </Routes>
    </>
  );
};

export default Jobs;
