import { FC } from 'react';
import { endpoints } from 'common/config';
import { Route, Routes } from 'react-router-dom';

import ClientAdd from './add';
import ClientEdit from './edit';
import ClientsList from './list';
import ClientDetail from './detail';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Clients: FC<any> = (props) => {
  return (
    <>
      <SideNavbar active="Clients" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <Routes>
          <Route path="/" element={<ClientsList />} />
          <Route path={endpoints.admin.client.add} element={<ClientAdd />} />
          <Route path={endpoints.admin.client.edit} element={<ClientEdit {...props} />} />
          <Route path={endpoints.admin.client.detail} element={<ClientDetail {...props} />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default Clients;
