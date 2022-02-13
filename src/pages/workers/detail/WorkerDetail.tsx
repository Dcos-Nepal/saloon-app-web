import { connect } from "react-redux";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Loader } from "common/components/atoms/Loader";
import * as workersActions from "store/actions/workers.actions";

interface IProps {
  actions: {
    fetchWorker: (id: string) => void;
  };
  id?: string;
  isWorkersLoading: boolean;
  currentWorker?: any;
}

const WorkerDetail: FC<IProps> = ({ actions, currentWorker }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) actions.fetchWorker(id);
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
        {currentWorker ? (
          <div>
            <div className="d-flex flex-row riw">
              <div className="col">
                <h3 className="txt-bold">
                  {currentWorker.fullName ||
                    `${currentWorker.firstName} ${currentWorker.lastName}`}
                </h3>
              </div>
              <div className="col">
                <button
                  onClick={() => id && navigate(`edit`)}
                  type="button"
                  className="btn btn-primary d-flex float-end me-2"
                >
                  Edit Worker
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col card me-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Worker info</h5>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Full name</div>
                    <div className="">{`${currentWorker.firstName} ${currentWorker.lastName}`}</div>
                  </div>
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Phone</div>
                    <div className="">{currentWorker.phoneNumber}</div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col p-1 ps-4">
                    <div className="txt-grey">Email</div>
                    <div className="">{currentWorker.email}</div>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Worker Documents</h5>
                  </div>
                </div>
                {currentWorker.documents &&
                Object.keys(currentWorker.documents).length ? (
                  Object.keys(currentWorker.documents).map((key) => (
                    <div className="row mt-3">
                      <div className="col p-1 ps-4">
                        <div className="txt-grey">{key}</div>
                        <a href={currentWorker.documents[key]?.url}>
                          {currentWorker.documents[key]?.key}
                        </a>
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
              <div className="col card">
                <div className="row">
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
                        <div className="">
                          {currentWorker.address.postalCode}
                        </div>
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
    currentWorker: state.workers.currentUser,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchWorker: (id: string) => {
      dispatch(workersActions.fetchWorker(id));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetail);
