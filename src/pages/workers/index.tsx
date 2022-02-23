import { Route, Routes } from 'react-router-dom';

import WorkerAdd from './add';
import WorkerEdit from './edit';
import WorkersList from './list';
import WorkerDetail from './detail';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Workers = () => {
  return (
    <>
      <SideNavbar active="Workers" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<WorkersList />} />
          <Route path={endpoints.admin.worker.add} element={<WorkerAdd />} />
          <Route path={endpoints.admin.worker.edit} element={<WorkerEdit />} />
          <Route path={endpoints.admin.worker.detail} element={<WorkerDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Workers;
