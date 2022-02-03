import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { IClient } from "common/types/client";
import * as clientsActions from "store/actions/clients.actions";
import { Loader } from "common/components/atoms/Loader";

interface IProps {
  actions: {
    fetchClient: (id: string) => void;
    updateClient: (data: IClient) => void;
  };
  id?: string;
  isClientsLoading: boolean;
  currentClient: IClient;
}

const ClientDetail: FC<IProps> = ({ actions, currentClient }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const Tabs = {
    ActiveWork: "ActiveWork",
    Requests: "Requests",
    Quotes: "Quotes",
    Jobs: "Jobs",
    Invoices: "Invoices",
  };

  const [tab, setTab] = useState(Tabs.ActiveWork);

  useEffect(() => {
    if (id) actions.fetchClient(id);
  }, [id, actions]);

  const TabContent = () => {
    switch (tab) {
      case Tabs.ActiveWork:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">No active work</div>
              <div className="">
                No active jobs, invoices or quotes for this client yet
              </div>
            </div>
          </div>
        );
      case Tabs.Invoices:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">No invoices</div>
              <div className="">
                No active jobs, invoices or quotes for this client yet
              </div>
            </div>
          </div>
        );
      case Tabs.Jobs:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">No jobs</div>
              <div className="">
                No active jobs, invoices or quotes for this client yet
              </div>
            </div>
          </div>
        );
      case Tabs.Quotes:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">No quotes</div>
              <div className="">
                No active jobs, invoices or quotes for this client yet
              </div>
            </div>
          </div>
        );

      case Tabs.Requests:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">No requests</div>
              <div className="">
                No active jobs, invoices or quotes for this client yet
              </div>
            </div>
          </div>
        );

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
            <div className="d-flex flex-row">
              <h3 className="txt-bold">
                {currentClient.fullName ||
                  `${currentClient.firstName} ${currentClient.lastName}`}
              </h3>
            </div>
            <div className="row">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Properties</h5>
                  </div>
                  <div className="col">
                    <button className="btn btn-primary d-flex float-end">
                      New property
                    </button>
                  </div>
                </div>
                <div className="row mt-4 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Property address</div>
                    <div className="">
                      8 Creswell Court, Gilberton, South Australia 5081
                    </div>
                  </div>
                  <div className="col-2 mt-2">
                    <button className="btn btn-secondary d-flex float-end">
                      <box-icon name="map" color="#EC7100" />
                    </button>
                  </div>
                </div>
                <div className="row mt-4 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey"></div>
                    <div className="">Tax rate GST (10%) Default</div>
                  </div>
                </div>
              </div>
              <div className="col card ms-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Contact info</h5>
                  </div>
                </div>
                <div className="row mt-4 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Primary contact</div>
                    <div className="">{currentClient.firstName}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Phone</div>
                    <div className="">{currentClient.phoneNumber}</div>
                  </div>
                </div>
                <div className="row mt-4 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Email</div>
                    <div className="">{currentClient.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row card">
              <div className="row">
                <div className="col d-flex flex-row">
                  <h5 className="txt-bold">Overview</h5>
                </div>
                <div className="col">
                  <button className="btn btn-primary d-flex float-end">
                    New
                  </button>
                </div>
              </div>
              <div className="">
                <div className="row mt-3">
                  <div
                    className={`col tab me-1 ${
                      tab === Tabs.ActiveWork ? "active-tab" : ""
                    }`}
                    onClick={() => setTab(Tabs.ActiveWork)}
                  >
                    Active work
                  </div>
                  <div
                    className={`col tab me-1 ${
                      tab === Tabs.Requests ? "active-tab" : ""
                    }`}
                    onClick={() => setTab(Tabs.Requests)}
                  >
                    Requests
                  </div>
                  <div
                    className={`col tab me-1 ${
                      tab === Tabs.Quotes ? "active-tab" : ""
                    }`}
                    onClick={() => setTab(Tabs.Quotes)}
                  >
                    Quotes
                  </div>
                  <div
                    className={`col tab me-1 ${
                      tab === Tabs.Jobs ? "active-tab" : ""
                    }`}
                    onClick={() => setTab(Tabs.Jobs)}
                  >
                    Jobs
                  </div>
                  <div
                    className={`col tab me-1 ${
                      tab === Tabs.Invoices ? "active-tab" : ""
                    }`}
                    onClick={() => setTab(Tabs.Invoices)}
                  >
                    Invoices
                  </div>
                </div>
              </div>
              {<TabContent />}
            </div>

            <div className="row">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Schedule</h5>
                  </div>
                  <div className="col">
                    <button className="btn btn-primary d-flex float-end">
                      New
                    </button>
                  </div>
                </div>
                <div className="row mt-2 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">No scheduling items</div>
                    <div className="">
                      Nothing is scheduled for this client yet
                    </div>
                  </div>
                </div>
              </div>
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Billing history</h5>
                  </div>
                </div>
                <div className="row mt-2 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">No billing history</div>
                    <div className="">This client has not been billed yet</div>
                  </div>
                </div>
              </div>
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
    isClientsLoading: state.clients.isLoading,
    currentClient: state.clients.currentUser,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClient: (id: string) => {
      dispatch(clientsActions.fetchClient(id));
    },
    updateClient: (data: IClient) => {
      dispatch(clientsActions.updateClient(data));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);
