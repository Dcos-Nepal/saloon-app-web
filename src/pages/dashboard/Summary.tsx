import { useEffect, useState } from 'react';
import ReactRRuleGenerator, { translations } from 'common/components/rrule-form';
import { getJobsSummaryApi } from 'services/jobs.service';
import { useNavigate } from 'react-router-dom';
import { getJobRequestsSummaryApi } from 'services/job-requests.service';
import { getQuotesSummaryApi } from 'services/quotes.service';
import InvoicesList from 'pages/invoices/InvoiceList';

const Summary = () => {
  const navigate = useNavigate();
  const [jobsSummary, setJobsSummary] = useState({
    activeJobsCount: 0,
    isCompleted: 0
  });
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

  const [rruleStr, setRruleStr] = useState('DTSTART:20220114T035500Z RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=1;UNTIL=20220127T050300Z');
  const getTranslation = () => {
    switch ('en') {
      case 'en':
        return translations.english;
      default:
        return translations.english;
    }
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      const jobsSummaryDataPromise = getJobsSummaryApi().then((response) => response.data);
      const requestsSummaryDataPromise = getJobRequestsSummaryApi().then((response) => response.data);
      const quotesSummaryDataPromise = getQuotesSummaryApi().then((response) => response.data);

      const [jobsSummaryData, requestsSummaryData, quotesSummaryData] = await Promise.all([
        jobsSummaryDataPromise,
        requestsSummaryDataPromise,
        quotesSummaryDataPromise
      ]);

      if (jobsSummaryData?.data?.data) setJobsSummary(jobsSummaryData?.data?.data);
      if (requestsSummaryData?.data?.data) setRequestsSummary(requestsSummaryData?.data?.data);
      if (quotesSummaryData?.data?.data) setQuotesSummary(quotesSummaryData?.data?.data);
    };

    fetchAndSetData();
  }, []);

  const handleChange = (newRRule: any) => {
    setRruleStr(newRRule);
  };

  return (
    <>
      <div className="row">
        <div className="col d-flex flex-row">
          <h1>Home</h1>
        </div>
        <div className="col">
          <button type="button" className="btn btn-primary d-flex float-end">
            Create
          </button>
        </div>
      </div>
      <div className="card bg-white mt-4 p-4">
        <b className="">Today’s Visits</b>
        <div className="row mt-4 mb-4">
          <div className="col row">
            <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-grey">3</div>
            <div className="col dashboard-main-label">
              Total Visits <p className="txt-bold-big mt-2">$0.00</p>
            </div>
          </div>
          <div className="col row">
            <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-red">3</div>
            <div className="col dashboard-main-label">
              To Go Visits <p className="txt-bold-big mt-2">$0.00</p>
            </div>
          </div>
          <div className="col row">
            <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">0</div>
            <div className="col dashboard-main-label">
              Active Visits <p className="txt-bold-big mt-2">$0.00</p>
            </div>
          </div>
          <div className="col row">
            <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-green">0</div>
            <div className="col dashboard-main-label">
              Complete Visits <p className="txt-bold-big mt-2">$0.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
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
                <div className="row p-2">
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
                <div className="row p-2">
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
                      <div className="">{jobsSummary.activeJobsCount - jobsSummary.isCompleted}</div>
                    </div>
                  </div>
                </div>
                <div className="row p-2">
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

      <div className="row mt-5">
        <div className="col">
          <InvoicesList isEditable={false}/>
        </div>
      </div>
    </>
  );
};

export default Summary;
