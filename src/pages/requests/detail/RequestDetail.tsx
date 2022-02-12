import { FC, useEffect } from "react";
import { connect } from "react-redux";
import pinterpolate from "pinterpolate";
import { useNavigate, useParams } from "react-router-dom";

import { IRequest } from "common/types/request";
import { Loader } from "common/components/atoms/Loader";
import * as requestsActions from "store/actions/job-requests.actions";
import { endpoints } from "common/config";

interface IProps {
  actions: {
    fetchRequest: (id: string) => void;
  };
  id?: string;
  isRequestsLoading: boolean;
  currentRequest: IRequest;
}

const RequestDetail: FC<IProps> = ({ actions, currentRequest }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) actions.fetchRequest(id);
  }, [id, actions]);

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        {currentRequest ? (
          <div>
            <div className="d-flex flex-row row">
              <div className="col">
                <h3 className="txt-bold">Job Request details</h3>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-secondary d-flex float-end"
                  data-bs-toggle="modal"
                  data-bs-target="#quick-job-request-form"
                >
                  Convert to Quote
                </button>
                <button
                  onClick={() => id && navigate(`edit`)}
                  type="button"
                  className="btn btn-primary d-flex float-end me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#job-request-form"
                >
                  Edit Job Request
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Job Detail</h5>
                  </div>
                  <div className="col">
                    <span className="status status-blue d-flex float-end">
                      {currentRequest.status}
                    </span>
                  </div>
                </div>
                <div className="txt-bold mb-3 mt-3 txt-grey">
                  {currentRequest.name}
                </div>

                <div className="row mb-3 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Job type</div>
                    <div className="">{currentRequest.type}</div>
                  </div>
                </div>
                <div className="row mb-3 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Job description</div>
                    <div className="">{currentRequest.description}</div>
                  </div>
                </div>
              </div>
              <div className="col card ms-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Contact info</h5>
                  </div>
                </div>
                {currentRequest.client ? (
                  <>
                    <div className="row border-bottom mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Primary contact</div>
                        <div className="">
                          {currentRequest.client.firstName}
                        </div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Phone number</div>
                        <div className="">
                          {currentRequest.client.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Email</div>
                        <div className="">{currentRequest.client.email}</div>
                      </div>
                    </div>
                    <div className="txt-bold mt-3 txt-grey">Property -1</div>
                    {currentRequest.client.address ? (
                      <>
                        <div className="row mb-4 border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Street 1</div>
                            <div className="">
                              {currentRequest.client.address.street1}
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4 border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Street 2</div>
                            <div className="">
                              {currentRequest.client.address.street2}
                            </div>
                          </div>
                        </div>
                        <div className="row border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">City</div>
                            <div className="">
                              {currentRequest.client.address.city}
                            </div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">State</div>
                            <div className="">
                              {currentRequest.client.address.state}
                            </div>
                          </div>
                        </div>
                        <div className="row border-bottom mb-3">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Post code</div>
                            <div className="">
                              {currentRequest.client.address.postalCode}
                            </div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Country</div>
                            <div className="">
                              {currentRequest.client.address.country}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="row border-bottom mb-3">
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">No address data</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
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
    isRequestsLoading: state.jobRequests.isLoading,
    currentRequest: state.jobRequests.currentItem,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchRequest: (id: string) => {
      dispatch(requestsActions.fetchJobRequest(id));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetail);
