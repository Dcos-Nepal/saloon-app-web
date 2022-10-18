import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { getData } from 'utils/storage';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { KeyIcon, PencilIcon, StopIcon } from '@primer/octicons-react';
import { FC, useEffect } from 'react';
import * as propertiesActions from 'store/actions/properties.actions';

interface IProps {
  actions: {
    fetchProperties: (filter: any) => void;
  };
  properties: any[];
}

const Profile: FC<IProps> = ({ actions, properties }) => {
  const navigate = useNavigate();
  const currentUser = getData('user');

  useEffect(() => {
    if (currentUser?._id) actions.fetchProperties({ user: currentUser._id });
  }, [currentUser?._id, actions]);

  return (
    <>
      <SideNavbar active="Profile" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="txt-orange pointer" onClick={() => navigate(-1)}>
            <span className="col me-1">
              <box-icon name="arrow-back" size="xs" color="#EC7100" />
            </span>
            <span className="col">Back to previous</span>
          </div>
          <div>
            <div className="d-flex flex-row row mt-2">
              <div className="col-7 d-flex flex-row">
                <h3 className="txt-bold extra">{currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`}</h3>
              </div>
              <div className="col-5">
                <div className="row">
                  <div className="col">
                    <div className="btn btn-primary d-flex flex-end" onClick={() => navigate('/dashboard/' + endpoints.setting)}>
                      <PencilIcon className="mt-1" />
                      &nbsp; Edit Profile
                    </div>
                  </div>
                  <div className="col">
                    <div className="btn btn-primary d-flex" onClick={() => navigate('/dashboard/' + endpoints.setting)}>
                      <KeyIcon className="mt-1" />
                      &nbsp; Change Password
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Profile</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="row d-flex align-items-center">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">User Ref Code</div>
                        <div className="">{<h5 className="txt-bold txt-orange">{currentUser?.userCode || 'XXXXX'}</h5>}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="row mt-2">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">First Name</div>
                            <div className="">{currentUser.firstName}</div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Last Name</div>
                            <div className="">{currentUser.lastName}</div>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Email</div>
                            <div className="">{currentUser.email}</div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Phone</div>
                            <div className="">
                              {currentUser.phoneNumber} &nbsp;&nbsp;
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col card ms-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Address</h5>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Street 1</div>
                    <div className="">{currentUser?.address?.street1}</div>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Street 2</div>
                    <div className="">{currentUser?.address?.street2}</div>
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">City</div>
                    <div className="">{currentUser?.address?.city}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">State</div>
                    <div className="">{currentUser?.address?.state}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Post code</div>
                    <div className="">{currentUser?.address?.postalCode}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Country</div>
                    <div className="">{currentUser?.address?.country}</div>
                  </div>
                </div>

                {currentUser.userData?.type === 'CLIENT' ? (
                  <>
                    <div className="row mt-2">
                      <div className="col d-flex flex-row">
                        <h5 className="txt-bold">Properties</h5>
                      </div>
                    </div>
                    {properties.length ? (
                      properties.map((property: any, index) => (
                        <div key={property._id + index} className={`row mt-1`}>
                          <div className="col-2 mt-2">
                            <button className="btn btn-secondary d-flex float-end">
                              <box-icon name="map" color="#EC7100" />
                            </button>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">{property.name}</div>
                            <div className="">
                              {property.street1}, {property.city}, {property.country} {property.postalCode}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="row mt-4">
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">No property address</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row mt-1">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Other Information</h5>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">User Type</div>
                    <div className="text-capitalize">{currentUser.userData?.type}</div>
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Referral Code</div>
                    <div className="">{currentUser.userData?.referralCode}</div>
                  </div>
                </div>
                {currentUser.userData?.type === 'WORKER' ? (
                  <>
                    <div className="row mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Working Hours</div>
                        <div className="text-capitalize">
                          {currentUser.userData?.workingHours
                            ? `${currentUser.userData?.workingHours?.start} - ${currentUser.userData?.workingHours?.end}`
                            : 'No working hours set.'}
                        </div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Working Days</div>
                        <div className="">{currentUser.userData?.workingDays?.length ? currentUser.userData?.workingDays.join(', ') : 'No working days set.'}</div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Services Offered</div>
                        <div className="">
                          {currentUser?.userData?.services.length
                            ? currentUser?.userData?.services.map((service: string, index: number) => (
                                <span key={service + index}>
                                  <span className="badge rounded-pill bg-secondary p-2 px-3">
                                    {service}
                                  </span>
                                  &nbsp;
                                </span>
                              ))
                            : 'No services added yet.'}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                {currentUser.userData?.type === 'CLIENT' ? (
                  <div className="row mt-2">
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">Company</div>
                      <div className="text-capitalize">{currentUser.userData?.company || 'XXXXX-XXXXXX'}</div>
                    </div>
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">Preferred Time</div>
                      <div className="">{currentUser.userData?.preferredTime || 'XXXXX-XXXXX'}</div>
                    </div>
                  </div>
                ) : null}
                {currentUser.userData?.type === 'WORKER' ? (
                  <>
                    <div className="row mt-3">
                      <div className="col d-flex flex-row">
                        <h5 className="txt-bold">Worker Documents</h5>
                      </div>
                      <div className="txt-info">
                        <StopIcon size={16} /> Click on the each document to download/view the document.
                      </div>
                    </div>
                    {currentUser.userData?.documents && Object.keys(currentUser?.userData?.documents).length ? (
                      <div className="row mt-3" >
                        {Object.keys(currentUser?.userData?.documents).map((key, index) => (
                          <div className="col p-1 ps-4" key={currentUser?._id + index}>
                            <div className="txt-grey mb-2">{currentUser.userData.documents[key]?.type?.split('_').join(' ')}:</div>
                            {currentUser.userData.documents[key]?.key ? (
                              <a
                                className="mt-3 txt-orange text-decoration-none"
                                target="_blank"
                                href={currentUser.userData.documents[key]?.url}
                                rel="noreferrer"
                              >
                                <img height="200" width="200" src={currentUser.userData.documents[key]?.url} className="rounded float-start" alt="" />
                              </a>
                            ) : (
                              <div className="txt-grey pt-2">
                                <StopIcon size={16} /> Not document added yet!.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="row border-bottom mb-3">
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">No documents</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    properties: state.properties.properties || []
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchProperties: (filter: any) => {
      dispatch(propertiesActions.fetchProperties(filter));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
