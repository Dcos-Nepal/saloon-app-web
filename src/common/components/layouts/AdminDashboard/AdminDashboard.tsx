import React, { FC, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { endpoints } from "common/config";
import { Loader } from "common/components/atoms/Loader";

// Lazy loading the component
const Summary = React.lazy(() => import("pages/dashboard/Summary"));
const Schedules = React.lazy(() => import("pages/schedules"));
const Clients = React.lazy(() => import("pages/clients/index"));
const Workers = React.lazy(() => import("pages/workers/index"));
const Jobs = React.lazy(() => import("pages/jobs/index"));
const Invoices = React.lazy(() => import("pages/invoices/index"));
const ReferralProgram = React.lazy(() => import("pages/referral"));
const Requests = React.lazy(() => import("pages/requests"));
const Quotes = React.lazy(() => import("pages/quotes"));

interface IProps {
  location?: any;
}

const AdminDashboard: FC<IProps> = (): JSX.Element => {
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
          path={endpoints.admin.schedules.calendar}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Schedules />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.client.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Clients />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.worker.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Workers />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.jobs.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Jobs />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.quotes.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Quotes />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.referral.program}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <ReferralProgram />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.requests.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Requests />
            </Suspense>
          }
        />
        <Route
          path={endpoints.admin.invoices.list + "/*"}
          element={
            <Suspense fallback={<Loader isLoading={true} />}>
              <Invoices />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};

export default AdminDashboard;
