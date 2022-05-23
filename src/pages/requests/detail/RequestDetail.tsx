import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { IRequest } from "common/types/request";
import { Loader } from "common/components/atoms/Loader";
import * as requestsActions from "store/actions/job-requests.actions";
import { InfoIcon, PencilIcon } from "@primer/octicons-react";
import { getCurrentUser } from "utils";

interface IProps {
  actions: {
    fetchRequest: (id: string) => void;
  };
  id?: string;
  isRequestsLoading: boolean;
  currentRequest: IRequest;
}

const RequestDetail: FC<IProps> = ({ actions, currentRequest, isRequestsLoading }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const property = currentRequest?.property ? currentRequest?.property : currentRequest?.client?.address;

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
        <Loader isLoading={isRequestsLoading} />
        {currentRequest ? (
          <div>
            <div className="d-flex flex-row row">
              <div className="col">
                <h3 className="extra mt-2">Job Request details</h3>
                <p className="text-secondary"><InfoIcon /> Job Request made by a client. This stores the information about type of job, and client's requirements. </p>
              </div>
              {((currentUser.role === 'WORKER' || currentUser.role === 'CLIENT') && currentUser.id === currentRequest?.createdBy) || currentUser.role === 'ADMIN' ? (
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary d-flex float-end me-2"
                    onClick={() => id && navigate(`edit`)}
                  >
                    <PencilIcon className="mt-1"/>&nbsp; Edit Job Request
                  </button>
                </div>
              ) : null}
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Request Details</h5>
                  </div>
                </div>
                <div className="row mb-3 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Ref. Code</div>
                    <div className="txt-orange">#{currentRequest.reqCode}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Request Status</div>
                    <div className="">
                      <span className="status status-blue">
                        {currentRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3 border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Job Title</div>
                    <div className="">{currentRequest.name}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Job type</div>
                    <div className="">{currentRequest.type}</div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Job description</div>
                    <div dangerouslySetInnerHTML={{__html: currentRequest.description}}/>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Working Hours</div>
                    <div className="">Start: {currentRequest.workingHours?.start || '-'} &nbsp;&nbsp;-&nbsp;&nbsp; End: {currentRequest.workingHours?.end || '-'}</div>
                  </div>
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Working Days</div>
                    <div className="">{currentRequest.workingDays?.join(', ') || '-'}</div>
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
                          {currentRequest.client?.firstName}
                        </div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Phone number</div>
                        <div className="">
                          {currentRequest.client?.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Email</div>
                        <div className="">{currentRequest.client.email}</div>
                      </div>
                    </div>
                    <div className="txt-bold mt-3 txt-grey">Property Details</div>
                    {!!property ? (
                      <>
                        <div className="row mb-4 border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Street 1</div>
                            <div className="">
                              {property.street1}
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4 border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Street 2</div>
                            <div className="">
                              {property.street2}
                            </div>
                          </div>
                        </div>
                        <div className="row border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">City</div>
                            <div className="">
                              {property.city}
                            </div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">State</div>
                            <div className="">
                              {property.state}
                            </div>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Post code</div>
                            <div className="">
                              {property.postalCode}
                            </div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Country</div>
                            <div className="">
                              {property.country}
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
