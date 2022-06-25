import { connect } from 'react-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from 'common/components/atoms/Loader';
import * as workersActions from 'store/actions/workers.actions';
import { CheckCircleIcon, PencilIcon, StopIcon } from '@primer/octicons-react';
import { approveWorkerApi } from 'services/users.service';
import { toast } from 'react-toastify';
import { getCurrentUser } from 'utils';
import { DateTime } from 'luxon';

interface IProps {
  actions: {
    fetchWorker: (id: string) => void;
  };
  id?: string;
  isWorkersLoading: boolean;
  currentWorker?: any;
}

const WorkerDetail: FC<IProps> = ({ actions, currentWorker, isWorkersLoading }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);
  const currentUser: { role: string; id: string } = getCurrentUser();

  /**
   * Approve Worker if its not already approved
   * @param id String
   * @return void
   */
  const approveWorker = async (id: string | undefined) => {
    if (!id) {
      throw new Error('Function not implemented.');
    }

    // Call User update API to update the isApproved property
    try {
      setIsApproving(true);
      const {data}: any = await approveWorkerApi(id);

      if (data?.data?.success === true) {
        // Fetch Worker details
        actions.fetchWorker(id);
        // Display success message
        toast.success('Worker approved successfully.');
        return setIsApproving(false);
      }
      
      toast.error('Error approving the Worker');
      setIsApproving(false);
    } catch (error) {
      console.log(error);
      toast.error('Error approving the Worker');
      setIsApproving(false);
    }
  }

  useEffect(() => {
    if (id) {
      actions.fetchWorker(id);
    }
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
        <Loader isLoading={isWorkersLoading} />
        {currentWorker ? (
          <div>
            <div className="d-flex flex-row riw">
              <div className="col">
                <h3 className="txt-bold extra mt-2">{currentWorker.fullName || `${currentWorker.firstName} ${currentWorker.lastName}`}</h3>
              </div>
              <div className="col">
                {(!currentWorker?.userData?.isApproved && currentUser.role === 'ADMIN') ? (
                  <button onClick={() => approveWorker(id)} type="button" className="btn btn-success d-flex float-end me-2">
                    {isApproving ? <span className="spinner-border spinner-border-sm mt-1" role="status" /> : <CheckCircleIcon className="mt-1" />}&nbsp;Approve Worker
                  </button>
                ) : null}
                <button onClick={() => id && navigate(`edit`)} type="button" className="pt-2 btn btn-primary d-flex float-end me-2">
                  <PencilIcon className="mt-1" />
                  &nbsp; Edit Worker
                </button>
              </div>
            </div>
            <div className="row m-1">
              <div className="col card me-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Worker Info</h5>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Worker Code</div>
                    <div className="txt-orange">
                      <strong>{currentWorker?.userCode || '-'}</strong>
                    </div>
                  </div>
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Full name</div>
                    <div className="">{`${currentWorker.firstName} ${currentWorker.lastName}`}</div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Email</div>
                    <div className="">{currentWorker.email}</div>
                  </div>
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Phone</div>
                    <div className="">{currentWorker.phoneNumber}</div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Working Hours</div>
                    <div className="">Start Time: {DateTime.fromISO(currentWorker?.userData?.workingHours?.start).toFormat('h:mm a') || '-'}</div>
                    <div className="">End Time: {DateTime.fromISO(currentWorker?.userData?.workingHours?.end).toFormat('h:mm a') || '-'}</div>
                  </div>
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Working Days</div>
                    <div className="">{currentWorker?.userData?.workingDays.join(', ') || '-'}</div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Services</div>
                    <div className="">
                      {currentWorker?.userData?.services.length
                        ? currentWorker?.userData?.services.map((service: string) => (
                            <><span key={service} className="badge rounded-pill bg-secondary p-2 mr-3">{service}</span>&nbsp;</>
                          ))
                        : 'No services added yet.'}
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Address</h5>
                  </div>
                </div>
                {currentWorker.address ? (
                  <>
                    <div className="row mb-4 border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Street 1</div>
                        <div className="">{currentWorker.address.street1}</div>
                      </div>
                    </div>
                    <div className="row mb-4 border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Street 2</div>
                        <div className="">{currentWorker.address.street2}</div>
                      </div>
                    </div>
                    <div className="row border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">City</div>
                        <div className="">{currentWorker.address.city}</div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">State</div>
                        <div className="">{currentWorker.address.state}</div>
                      </div>
                    </div>
                    <div className="row border-bottom mb-3">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Post code</div>
                        <div className="">{currentWorker.address.postalCode}</div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Country</div>
                        <div className="">{currentWorker.address.country}</div>
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
              </div>
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Worker Documents</h5>
                  </div>
                  <div className="txt-info">
                    <StopIcon size={16} /> Click on the each document to download/view the document.
                  </div>
                </div>
                {currentWorker.userData?.documents && Object.keys(currentWorker?.userData?.documents).length ? (
                  Object.keys(currentWorker?.userData?.documents).map((key) => (
                    <div key={key+'~'} className="row mt-3">
                      <div className="col p-1 ps-4">
                        <div className="txt-grey mb-2">{currentWorker.userData.documents[key]?.type?.split('_').join(' ')}:</div>
                        {currentWorker.userData.documents[key]?.key ? (
                          <a
                            className="mt-3 txt-orange text-decoration-none"
                            target="_blank"
                            href={currentWorker.userData.documents[key]?.url}
                            rel="noreferrer"
                          >
                            <img width="200" height="200" src={currentWorker.userData.documents[key]?.url} className="rounded float-start" alt="" />
                          </a>
                        ) : (
                          <div className="txt-grey pt-2">
                            <StopIcon size={16} /> Not document added yet!.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="row border-bottom mb-3">
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">No documents</div>
                    </div>
                  </div>
                )}
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
    isWorkersLoading: state.workers.isLoading,
    currentWorker: state.workers.currentUser
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchWorker: (id: string) => {
      dispatch(workersActions.fetchWorker(id));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetail);
