import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { getData } from 'utils/storage';
import { endpoints } from 'common/config';
import avatar from 'assets/images/Avatar.svg';
import Footer from 'common/components/layouts/footer';
import SideNavbar from 'common/components/layouts/sidebar';
import { KeyIcon, PencilIcon, StopIcon } from '@primer/octicons-react';
import { FC, useEffect, useState } from 'react';
import { getIn, useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from 'common/components/form/Input';
import Modal from 'common/components/atoms/Modal';
import { sendOtpApi, verifyOtpApi } from 'services/users.service';
import { toast } from 'react-toastify';
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialValues = {
    code: ''
  };

  const VerifyPhoneSchema = Yup.object().shape({
    code: Yup.string().required('Please provide an OTP.')
  });

  useEffect(() => {
    if (currentUser?._id) actions.fetchProperties({ user: currentUser._id });
  }, [currentUser?._id, actions]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: async (userData: any) => {
      console.log(userData);
      setIsLoading(true);
      try {
        const { data: response } = await verifyOtpApi(userData);

        if (response.data.success === true) {
          toast.success('Verified OTP!');
          setShowOtpModal(false);
        }
      } catch (ex) {
        console.log(ex);
        toast.error('Failed to verify OTP code');
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: VerifyPhoneSchema
  });

  const handleSendOtp = async (phoneNumber: string) => {
    const { data: response } = await sendOtpApi({ phoneNumber });

    if (response.data.success === true) {
      setShowOtpModal(true);
    } else {
      console.log('Response:', response.data);
      toast.error('Failed to send OTP Code');
    }
  };

  /**
   * Custom Error Message
   * @param param0 Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ formik, name }: any) => {
    if (!name) return <></>;

    const error = getIn(formik.errors, name);
    const touch = getIn(formik.touched, name);

    return (touch && error) || error ? (
      <div className="row txt-red">
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

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
                            {currentUser.auth?.phoneNumber?.verified ? (
                              `(Verified)`
                            ) : (
                              <button className="btn btn-sm btn-primary" onClick={() => handleSendOtp(currentUser.phoneNumber)}>
                                Verify
                              </button>
                            )}
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

                {currentUser.userData?.type === 'CLIENT' ? (
                  <>
                    <div className="row mt-2">
                      <div className="col d-flex flex-row">
                        <h5 className="txt-bold">Properties</h5>
                      </div>
                    </div>
                    {properties.length ? (
                      properties.map((property: any, index) => (
                        <div className={`row mt-1`}>
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
                {currentUser.userData?.type === 'WORKER' ? (
                  <>
                    <div className="row">
                      <div className="col d-flex flex-row">
                        <h5 className="txt-bold">Worker Documents</h5>
                      </div>
                      <div className="txt-info">
                        <StopIcon size={16} /> Click on the each document to download/view the document.
                      </div>
                    </div>
                    {currentUser.userData?.documents && Object.keys(currentUser?.userData?.documents).length ? (
                      <div className="row mt-3" >
                        {Object.keys(currentUser?.userData?.documents).map((key) => (
                          <div className="col p-1 ps-4" key={currentUser?._id}>
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
                <div className="row mt-3">
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
                        <div className="txt-grey">Services</div>
                        <div className="">
                          {currentUser?.userData?.services.length
                            ? currentUser?.userData?.services.map((service: string) => (
                                <>
                                  <span key={service} className="badge rounded-pill bg-secondary p-1">
                                    {service}
                                  </span>
                                  &nbsp;
                                </>
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
              </div>
            </div>
          </div>
        </div>

        {/* Modals Section */}
        <Modal isOpen={showOtpModal} onRequestClose={() => setShowOtpModal(false)}>
          <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog mt-5">
              <div className="modal-content">
                <div className="modal-header row border-bottom">
                  <h5 className="col">Verify Phone Number</h5>
                  <div className="col">
                    <span onClick={() => setShowOtpModal(false)} className="pointer d-flex float-end">
                      <box-icon name="x" />
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <form noValidate onSubmit={formik.handleSubmit}>
                    <div className="col">
                      <InputField
                        label=""
                        placeholder="Enter OTP code sent to your phone number"
                        name="code"
                        helperComponent={<ErrorMessage formik={formik} name="lastName" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.code}
                      />
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                      <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
                        {isLoading ? <span className="spinner-border spinner-border-sm mt-1" role="status" /> : null}
                        &nbsp;Verify
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
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
