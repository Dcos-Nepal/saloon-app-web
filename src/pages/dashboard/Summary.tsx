import { useEffect, useState } from 'react';
import { getJobsSummaryApi } from 'services/jobs.service';
import { useNavigate } from 'react-router-dom';
import { getJobRequestsSummaryApi } from 'services/job-requests.service';
import { getQuotesSummaryApi } from 'services/quotes.service';
import InvoicesList from 'pages/invoices/InvoiceList';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { getVisitsSummaryApi } from 'services/visits.service';
import { Loader } from 'common/components/atoms/Loader';
import { getCurrentUser } from 'utils';
import { getUsersSummaryApi } from 'services/users.service';

const Summary = () => {
  const navigate = useNavigate();
  const currUser = getCurrentUser();
  const [usersSummary, setUsersSummary] = useState({
    clientCount: 0,
    total: 0,
    workerCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [jobsSummary, setJobsSummary] = useState({
    activeJobsCount: 0,
    isCompleted: 0
  });
  const [visitsSummary, setVisitsSummary] = useState<
    {
      status: string;
      startTime: any;
      totalPrice: number;
      visitDate: string;
    }[]
  >([]);

  const [quotesSummary, setQuotesSummary] = useState({
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0
  });
  const [requestsSummary, setRequestsSummary] = useState({
    activeCount: 0,
    inActiveCount: 0,
    inProgressCount: 0,
    pendingCount: 0
  });

  useEffect(() => {
    const jobQuery: { createdBy?: string; team?: string; jobFor?: string } = {};
    const visitQuery: { team?: string; visitFor?: string } = {};
    const jobReqQuery: { CLIENT?: string } = {};
    const quotesQuery: { quoteFor?: string } = {};

    if (currUser.role === 'WORKER') {
      jobQuery.team = currUser.id;
      visitQuery.team = currUser.id;
    }

    if (currUser.role === 'CLIENT') {
      jobQuery.jobFor = currUser.id;
      visitQuery.visitFor = currUser.id;
      jobReqQuery.CLIENT = currUser.id;
      quotesQuery.quoteFor = currUser.id;
    }

    const fetchAndSetData = async () => {
      setIsLoading(true);

      const jobsSummaryDataPromise = getJobsSummaryApi({ ...jobQuery }).then((response) => response.data);
      const quotesSummaryDataPromise =
        (currUser.role === 'CLIENT' || currUser.role === 'ADMIN')  ? getQuotesSummaryApi({ ...quotesQuery }).then((response) => response.data) : Promise.resolve(null);
      const requestsSummaryDataPromise =
        (currUser.role === 'CLIENT' || currUser.role === 'ADMIN') ? getJobRequestsSummaryApi({ ...jobReqQuery }).then((response) => response.data) : Promise.resolve(null);
      const visitsSummaryDataPromise = getVisitsSummaryApi({
        ...visitQuery,
        startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      }).then((response) => response.data);
      const usersSummaryDataPromise = getUsersSummaryApi().then((response) => response.data);

      const [jobsSummaryData, usersSummaryData, visitsSummaryData, requestsSummaryData, quotesSummaryData] = await Promise.all([
        jobsSummaryDataPromise,
        usersSummaryDataPromise,
        visitsSummaryDataPromise,
        requestsSummaryDataPromise,
        quotesSummaryDataPromise
      ]);

      if (jobsSummaryData?.data?.data) setJobsSummary(jobsSummaryData?.data?.data);
      if (requestsSummaryData?.data?.data) setRequestsSummary(requestsSummaryData?.data?.data);
      if (quotesSummaryData?.data?.data) setQuotesSummary(quotesSummaryData?.data?.data);
      if (visitsSummaryData?.data?.data) setVisitsSummary(visitsSummaryData?.data?.data);
      if (usersSummaryData?.data?.data) setUsersSummary(usersSummaryData.data.data);

      setIsLoading(false);
    };

    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nowTime = new Date().getTime();

  const toGoVisits = visitsSummary.filter((visit) => {
    return visit.visitDate && new Date(visit.visitDate).getTime() > nowTime;
  });

  const completeVisits = visitsSummary.filter((visit) => {
    return visit.status && visit.status === 'COMPLETED';
  });

  const activeVisits = visitsSummary.filter((visit) => {
    return visit.status && visit.visitDate && new Date(visit.visitDate).getTime() < nowTime && visit.status !== 'COMPLETED';
  });

  return (
    <>
      <SideNavbar active="Overview" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="col d-flex flex-row">
            <h1>Home</h1>
          </div>
        </div>
        <Loader isLoading={isLoading} />
        <div className="card bg-white mt-4 p-4">
          <b className="">Today’s appointments</b>
          <div className="row mt-4 mb-4">
            <div className="col row">
              <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-grey">{visitsSummary.length}</div>
              <div className="col dashboard-main-label">
                Total <p className="txt-bold-big mt-2">${`${visitsSummary.reduce((prevSum, visit) => prevSum + visit.totalPrice, 0).toFixed(2)}`}</p>
              </div>
            </div>
            <div className="col row">
              <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-red">{toGoVisits.length}</div>
              <div className="col dashboard-main-label">
                To Go <p className="txt-bold-big mt-2">${`${toGoVisits.reduce((prevSum, visit) => prevSum + visit.totalPrice, 0).toFixed(2)}`}</p>
              </div>
            </div>
            <div className="col row">
              <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">{activeVisits.length}</div>
              <div className="col dashboard-main-label">
                Active <p className="txt-bold-big mt-2">${`${activeVisits.reduce((prevSum, visit) => prevSum + visit.totalPrice, 0).toFixed(2)}`}</p>
              </div>
            </div>
            <div className="col row">
              <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-green">{completeVisits.length}</div>
              <div className="col dashboard-main-label">
                Complete <p className="txt-bold-big mt-2">${`${completeVisits.reduce((prevSum, visit) => prevSum + visit.totalPrice, 0).toFixed(2)}`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 pb-3">
          {currUser.role === 'ADMIN' || currUser.role === 'CLIENT' ? (
            <div className="col">
              <div className="card full-height">
                <div className="row d-flex flex-row">
                  <div className="col ">
                    <h5 className="">Job Request</h5>
                  </div>
                  <div className="col d-flex flex-row align-items-center justify-content-end">
                    <button onClick={() => navigate('/dashboard/requests/add')} type="button" className="btn btn-primary d-flex float-end">
                      New Request
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col mt-2 p-2 txt-bold">
                    <div className="row border-bottom p-2">
                      <div className="">
                        Active
                        <div className="d-flex float-end">
                          <div className="">{requestsSummary.activeCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom p-2">
                      <div className="">
                        In Progress
                        <div className="d-flex float-end">
                          <div className="">{requestsSummary.inProgressCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom p-2">
                      <div className="">
                        InActive
                        <div className="d-flex float-end">
                          <div className="">{requestsSummary.inActiveCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom p-2">
                      <div className="">
                        Pending
                        <div className="d-flex float-end">
                          <div className="">{requestsSummary.pendingCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {currUser.role === 'ADMIN' || currUser.role === 'CLIENT' ? (
            <div className="col">
              <div className="card full-height">
                <div className="row d-flex flex-row">
                  <div className="col ">
                    <h5 className="">Quotes</h5>
                  </div>
                  <div className="col d-flex flex-row align-items-center justify-content-end">
                    <button onClick={() => navigate('/dashboard/quotes/add')} type="button" className="btn btn-primary d-flex float-end">
                      New Quote
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col mt-2 p-2 txt-bold">
                    <div className="row border-bottom p-2">
                      <div className="">
                        Approved
                        <div className="d-flex float-end">
                          <div className="">{quotesSummary.acceptedCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom p-2">
                      <div className="">
                        Change Requested
                        <div className="d-flex float-end">
                          <div className="">{quotesSummary.rejectedCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom p-2">
                      <div className="">
                        Draft
                        <div className="d-flex float-end">
                          <div className="">{quotesSummary.pendingCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="col">
            <div className="card full-height">
              <div className="row d-flex flex-row">
                <div className="col ">
                  <h5 className="">Jobs</h5>
                </div>
                <div className="col d-flex flex-row align-items-center justify-content-end">
                  <button onClick={() => navigate('/dashboard/jobs/add')} type="button" className="btn btn-primary d-flex float-end">
                    New Job
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col mt-2 p-2 txt-bold">
                  <div className="row border-bottom p-2">
                    <div className="">
                      Active
                      <div className="d-flex float-end">
                        <div className="">{jobsSummary.activeJobsCount}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row border-bottom p-2">
                    <div className="">
                      In Progress
                      <div className="d-flex float-end">
                        <div className="">
                          {jobsSummary.activeJobsCount > jobsSummary.isCompleted ? jobsSummary.activeJobsCount - jobsSummary.isCompleted : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row border-bottom p-2">
                    <div className="">
                      Completed
                      <div className="d-flex float-end">
                        <div className="">{jobsSummary.isCompleted}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {currUser.role === 'ADMIN' ? (
          <div className="card bg-white mt-4 p-4">
            <b className="">Users Summary</b>
            <div className="row mt-4 mb-4">
              <div className="col row">
                <div className="col ms-4 p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">{usersSummary.total}</div>
                <div className="col-4 dashboard-main-label mt-3">
                  Total <p className="txt-bold-big mt-1">Users</p>
                </div>
              </div>
              <div className="col row">
                <div className="col ms-4 p-3-4 text-center dashboard-h1 rounded-radius bg-light-green">{usersSummary.clientCount}</div>
                <div className="col-4 dashboard-main-label mt-3">
                  Happy <p className="txt-bold-big mt-1">Clients</p>
                </div>
              </div>
              <div className="col row">
                <div className="col ms-4 p-3-4 text-center dashboard-h1 rounded-radius bg-grey">{usersSummary.workerCount}</div>
                <div className="col-4 dashboard-main-label mt-3">
                  Active <p className="txt-bold-big mt-1">Workers</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {currUser.role === 'ADMIN' || currUser.role === 'CLIENT' ? (
          <div className="card">
            <InvoicesList />
          </div>
        ) : null}
        <Footer />
      </div>
    </>
  );
};

export default Summary;
