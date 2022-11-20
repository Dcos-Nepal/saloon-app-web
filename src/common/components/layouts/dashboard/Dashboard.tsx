import React, { FC, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { endpoints } from 'common/config';
import { Loader } from 'common/components/atoms/Loader';
import PageNotFound from 'pages/NotFound';
import Appointments from 'pages/appointments/list/Appointments';
import Orders from 'pages/orders';

// Lazy loading the component
const Summary = React.lazy(() => import('pages/dashboard/Summary'));
const Visits = React.lazy(() => import('pages/dashboard/Visits'));
const Clients = React.lazy(() => import('pages/clients/index'));
const LineItems = React.lazy(() => import('pages/lineItems'));
const Profile = React.lazy(() => import('pages/profile'));
const Setting = React.lazy(() => import('pages/setting'));
const Bookings = React.lazy(() => import('pages/bookings/Bookings'));

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
          path={endpoints.admin.quotes.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Appointments />
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
          path={endpoints.admin.visits.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Visits/>
            </Suspense>
          }
        />
         <Route
          path={endpoints.admin.order.list + '/*'}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Orders/>
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
        <Route
          path={endpoints.admin.schedules.calendar}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Bookings />
            </Suspense>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default Dashboard;
