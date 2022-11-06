import { FC } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { getData } from 'utils/storage';
import { endpoints } from 'common/config';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { KeyIcon, PencilIcon, StopIcon } from '@primer/octicons-react';

interface IProps {
  actions: {};
  properties: any[];
}

const Profile: FC<IProps> = ({ properties }) => {
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
                <div className="row border-bottom">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Address</div>
                    <div className="">{currentUser?.address}</div>
                  </div>
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

const mapStateToProps = (state: any) => {
  return {
    properties: state.properties.properties || []
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {}
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
