import React, { FC, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { endpoints } from 'common/config';
import { Loader } from 'common/components/atoms/Loader';
import PageNotFound from 'pages/NotFound';

// Lazy loading the component
const Summary = React.lazy(() => import('pages/dashboard/Summary'));
const Clients = React.lazy(() => import('pages/clients/index'));
const Quotes = React.lazy(() => import('pages/appointments'));
const LineItems = React.lazy(() => import('pages/lineItems'));
const Profile = React.lazy(() => import('pages/profile'));
const Setting = React.lazy(() => import('pages/setting'));

interface IProps {
  location?: any;
}

const Dashboard: FC<IProps> = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Summary />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.client.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Clients />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.lineItems.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <LineItems />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.quotes.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Quotes />
            </Suspense>
          }
        />
        <Route
          path={endpoints.profile + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path={endpoints.setting + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Setting />
            </Suspense>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default Dashboard;
