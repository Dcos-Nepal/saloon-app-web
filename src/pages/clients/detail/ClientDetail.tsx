import { connect } from 'react-redux';
import pinterpolate from 'pinterpolate';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCurrentUser, formatAddress } from 'utils';
import { IClient } from 'common/types/client';
import { Loader } from 'common/components/atoms/Loader';
import * as jobsActions from 'store/actions/job.actions';
import * as quotesActions from 'store/actions/quotes.actions';
import * as clientsActions from 'store/actions/clients.actions';
import * as invoicesActions from 'store/actions/invoices.actions';
import * as jobReqActions from 'store/actions/job-requests.actions';
import * as propertiesActions from 'store/actions/properties.actions';
import { PencilIcon } from '@primer/octicons-react';

interface IRequest {
  id: string;
  name: string;
  description: string;
  requestDate: string;
  contact: string;
  status: string;
}

interface IQuote {
  id: string;
  title: string;
  description: string;
  quoteFor: any;
  property: any;
  lineItems: any[];
  status: { status: string; reason: string; updatedAt: string };
  total: string;
  createdAt: string;
  updatedAt: string;
}

interface IInvoice {
  id: string;
  subject: string;
  message: string;
  dueOnReceipt: boolean;
  isPaid: boolean;
  isIssued: boolean;
  invoiceFor: any;
  refJob?: any;
  refVisit?: any;
  refProperty?: any;
  lineItems: any[];
  total: string;
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  actions: {
    fetchJobs: (query: any) => any;
    fetchQuotes: (query: any) => any;
    fetchClient: (id: string) => void;
    fetchInvoices: (filter: any) => void;
    fetchJobRequests: (query: any) => any;
    updateClient: (data: IClient) => void;
    fetchProperties: (filter: any) => void;
  };
  id?: string;
  jobs: any[];
  quotes: IQuote[];
  properties: any[];
  invoices: IInvoice[];
  requests: IRequest[];
  isClientsLoading: boolean;
  currentClient: IClient;
}

const ClientDetail: FC<IProps> = ({ actions, currentClient, quotes, properties, requests, invoices, jobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const Tabs = {
    ActiveJob: 'ActiveJob',
    Requests: 'Requests',
    Quotes: 'Quotes',
    Jobs: 'Jobs',
    Invoices: 'Invoices'
  };

  const [tab, setTab] = useState(Tabs.ActiveJob);

  useEffect(() => {
    if (id) actions.fetchClient(id);
  }, [id, actions]);

  useEffect(() => {
    const jobQuery: { createdBy?: string; team?: string; jobFor?: string } = {};

    if (currentUser.role === 'WORKER') {
      jobQuery.team = currentUser.id;
    }

    actions.fetchJobs({ ...jobQuery, jobFor: id });

    if (currentUser.role !== 'WORKER') {
      actions.fetchQuotes({ quoteFor: id });
      actions.fetchJobRequests({ client: id });
      actions.fetchInvoices({ invoiceFor: id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, actions]);

  useEffect(() => {
    if (currentClient?._id && id) actions.fetchProperties({ user: currentClient._id });
  }, [id, currentClient?._id, actions]);

  const Quotes = () => {
    return (
      <div className="row mt-4">
        {quotes.length ? (
          <>
            {quotes.map((quote: IQuote) => (
              <div
                onClick={() => navigate(pinterpolate('/dashboard/quotes/:id', { id: quote.id }))}
                key={quote.id}
                className="pointer hover-grey row mb-3 border-bottom"
              >
                <div className="col p-2 ps-4">
                  <div className="txt-grey">{quote.title}</div>
                  <div className="">{quote.description}</div>
                </div>
                <div className="col p-2 ps-4">
                  <span className="d-flex status status-blue float-end">{quote.status?.status}</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col p-2 ps-4">
            <div className="txt-grey">There are no Job Quotes to this client.</div>
          </div>
        )}
      </div>
    );
  };

  const Requests = () => {
    return (
      <div className="row mt-4">
        {requests.length ? (
          <>
            {requests.map((request: IRequest) => (
              <div
                onClick={() => navigate(pinterpolate('/dashboard/requests/:id', { id: request.id }))}
                key={request.id}
                className="pointer hover-grey row mb-3 border-bottom"
              >
                <div className="col p-2 ps-4">
                  <div className="txt-grey">{request.name}</div>
                  <div className="">{request.description}</div>
                </div>
                <div className="col p-2 ps-4">
                  <span className="d-flex status status-blue float-end">{request.status}</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col p-2 ps-4">
            <div className="txt-grey">There are no Job Requests to this client.</div>
          </div>
        )}
      </div>
    );
  };

  const Invoices = () => {
    return (
      <div className="row mt-4">
        {invoices.length ? (
          <>
            {invoices.map((invoice: IInvoice) => (
              <div
                onClick={() => navigate(pinterpolate('/dashboard/invoices/:id', { id: invoice.id }))}
                key={invoice.id}
                className="pointer hover-grey row mb-3 border-bottom"
              >
                <div className="col p-2 ps-4">
                  <div className="txt-grey">{invoice.subject}</div>
                  <div className="">{invoice.message}</div>
                </div>
                <div className="col p-2 ps-4">
                  {invoice.isPaid ? (
                    <span className="d-flex status status-green float-end">Paid</span>
                  ) : (
                    <span className="d-flex status status-blue float-end">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col p-2 ps-4">
            <div className="txt-grey">There are no Invoices assigned to this client.</div>
          </div>
        )}
      </div>
    );
  };

  const Jobs = ({ activeOnly = false }) => {
    let activeTabJobs = jobs;
    if (activeOnly) {
      const nowTime = new Date().getTime();

      activeTabJobs = jobs.filter((job) => {
        return !job.isCompleted && job.startDate && new Date(job.startDate).getTime() < nowTime;
      });
    }

    return (
      <div className="row mt-4">
        {activeTabJobs.length ? (
          <>
            {activeTabJobs.map((job: any) => (
              <div
                onClick={() => navigate(pinterpolate('/dashboard/jobs/:id', { id: job.id }))}
                key={job.id}
                className="pointer hover-grey row mb-3 border-bottom"
              >
                <div className="col p-2 ps-4">
                  <div className="txt-grey">{job.title}</div>
                  <div className="">{job.instruction}</div>
                </div>
                <div className="col p-2 ps-4">
                  <span className="d-flex status status-blue float-end">{job.type}</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col p-2 ps-4">
            <div className="txt-grey">There are no {activeOnly ? ' Active' : ''} Jobs assigned to this client.</div>
          </div>
        )}
      </div>
    );
  };

  const TabContent = () => {
    switch (tab) {
      case Tabs.ActiveJob:
        return <Jobs activeOnly={true} />;
      case Tabs.Invoices:
        return <Invoices />;
      case Tabs.Jobs:
        return <Jobs />;
      case Tabs.Quotes:
        return <Quotes />;
      case Tabs.Requests:
        return <Requests />;

      default:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">Nothing to show here</div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        {currentClient ? (
          <div>
            <div className="d-flex flex-row mt-2">
              <h3 className="txt-bold extra">{currentClient?.fullName || `${currentClient?.firstName} ${currentClient?.lastName}`}</h3>
              <div className="col">
                <button onClick={() => id && navigate(`edit`)} type="button" className="btn btn-primary d-flex float-end me-2">
                  <PencilIcon className='mt-1' /> &nbsp; Edit Client Details
                </button>
              </div>
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Contact info</h5>
                  </div>
                </div>
                <div className="row mt-2">
                  {currentClient.userData?.isCompanyNamePrimary ? (
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">Company Name</div>
                      <div className="">{currentClient.userData?.company || "-"}</div>
                    </div>
                  ) : (
                    <>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">First Name</div>
                        <div className="">{currentClient.firstName}</div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Last Name</div>
                        <div className="">{currentClient.lastName}</div>
                      </div>
                    </>
                  )}
                  
                </div>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Email</div>
                    <div className="">{currentClient.email}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Phone</div>
                    <div className="">{currentClient.phoneNumber}</div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Client's Address</div>
                    <div className="">
                      {currentClient?.address ? formatAddress(currentClient?.address) : null}
                      </div>
                  </div>
                </div>
              </div>
              <div className="col card ms-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Properties</h5>
                  </div>
                </div>
                {properties.length ? (
                  properties.map((property: any, index) => (
                    <div key={property._id + '~'} className={`row ${index === 0 ? 'mt-4' : 'mt-2'}`}>
                      <div className="col-2 mt-2">
                        <button className="btn btn-secondary d-flex float-end">
                          <box-icon name="map" color="#EC7100" />
                        </button>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">{property.name}</div>
                        <div className="">
                          {formatAddress(property)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="row d-flex mt-4 align-items-center">
                    <div className="col-2 mt-2">
                      <button className="btn btn-secondary d-flex float-end">
                        <box-icon name="map" color="#EC7100" />
                      </button>
                    </div>
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">No additional properties added.</div>
                    </div>
                  </div>
                )}
                <div className="row mt-4">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey"></div>
                    <div className="">Tax rate GST (10%) Default</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row card m-1 mt-3">
              <div className="row">
                <div className="col d-flex flex-row">
                  <h5 className="txt-bold">Overview</h5>
                </div>
              </div>
              <div className="">
                <div className="row mt-3">
                  <div className={`col tab me-1 ${tab === Tabs.ActiveJob ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.ActiveJob)}>
                    Active jobs
                  </div>
                  {currentUser.role !== 'WORKER' ? (
                    <>
                      <div className={`col tab me-1 ${tab === Tabs.Requests ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Requests)}>
                        Requests
                      </div>
                      <div className={`col tab me-1 ${tab === Tabs.Quotes ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Quotes)}>
                        Quotes
                      </div>
                      <div className={`col tab me-1 ${tab === Tabs.Invoices ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Invoices)}>
                        Invoices
                      </div>
                    </>
                  ) : null}
                  <div className={`col tab me-1 ${tab === Tabs.Jobs ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Jobs)}>
                    Jobs
                  </div>
                </div>
              </div>
              {<TabContent />}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentClient: state.clients.currentUser,
    isClientsLoading: state.clients.isLoading,
    jobs: state.jobs.jobs?.data?.rows || [],
    properties: state.properties.properties || [],
    quotes: state.quotes.itemList?.data?.rows || [],
    invoices: state.invoices.itemList?.data?.rows || [],
    requests: state.jobRequests.itemList?.data?.rows || []
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchQuotes: (payload: any) => {
      dispatch(quotesActions.fetchQuotes(payload));
    },
    addProperty: (data: any) => {
      dispatch(propertiesActions.addProperty(data));
    },
    fetchProperties: (filter: any) => {
      dispatch(propertiesActions.fetchProperties(filter));
    },
    fetchJobRequests: (payload: any) => {
      dispatch(jobReqActions.fetchJobRequests(payload));
    },
    fetchJobs: (payload: any) => {
      dispatch(jobsActions.fetchJobs(payload));
    },
    fetchClient: (id: string) => {
      dispatch(clientsActions.fetchClient(id));
    },
    fetchInvoices: (payload: any) => {
      dispatch(invoicesActions.fetchInvoices(payload));
    },
    updateClient: (data: IClient) => {
      dispatch(clientsActions.updateClient(data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);
