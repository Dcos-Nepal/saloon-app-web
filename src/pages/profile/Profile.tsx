import { useNavigate } from 'react-router';

import { getData } from 'utils/storage';
import { endpoints } from 'common/config';
import avatar from 'assets/images/Avatar.svg';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';

const Profile = () => {
  const navigate = useNavigate();

  const currentUser = getData('user');

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
            <div className="d-flex flex-row mt-2">
              <h3 className="txt-bold extra">{currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`}</h3>
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
                    <div className="row">
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
                            <div className="">{currentUser.phoneNumber}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4 p-2">
                        <div className="">
                          <img src={avatar} height="120px" alt="Orange" />
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
              </div>
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row">
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
                        <div className="text-capitalize">{currentUser.userData?.workingHours}</div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Working Days</div>
                        <div className="">{currentUser.userData?.workingDays}</div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Services</div>
                        <div className="">{currentUser?.userData?.services.length
                          ? currentUser?.userData?.services.map((service: string) => (<><span key={service} className="badge rounded-pill bg-secondary p-1">{service}</span>&nbsp;</>))
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
              </div>
            </div>
            <div className="row m-1 mt-4">
              <div className="col ms-3">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Change Password</h5>
                  </div>
                </div>
                <div className="mt-2">
                  <button type="button" className="btn btn-primary" onClick={() => navigate('/dashboard/' + endpoints.setting)}>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
