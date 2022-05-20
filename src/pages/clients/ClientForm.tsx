import * as Yup from 'yup';
import { useFormik, getIn } from 'formik';
import React, { Suspense, FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IOption } from 'common/types/form';
import PropertyDetail from './PropertyDetail';
import { IClient } from 'common/types/client';
import { StopIcon } from '@primer/octicons-react';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import SelectField from 'common/components/form/Select';
import * as clientsActions from 'store/actions/clients.actions';
import * as propertiesActions from 'store/actions/properties.actions';
import { COUNTRIES_OPTIONS, DEFAULT_COUNTRY, PREFERRED_TIME_OPTIONS, STATES_OPTIONS } from 'common/constants';
import Modal from 'common/components/atoms/Modal';
import DeleteConfirm from 'common/components/DeleteConfirm';
import SearchLocation from 'common/components/form/SearchLocation';
import { deletePropertyApi } from 'services/properties.service';
import { toast } from 'react-toastify';

const PropertyForm = React.lazy(() => import('./PropertyForm'));

interface IProps {
  actions: {
    addClient: (data: IClient) => void;
    fetchClient: (id: string) => void;
    updateClient: (data: IClient) => void;
    addProperty: (data: any) => void;
    fetchProperties: (filter: any) => void;
    updateProperty: (data: any) => void;
    deleteProperty: (data: any) => void;
  };
  id?: string;
  isClientsLoading: boolean;
  currentClient: IClient;
  isPropertiesLoading: boolean;
  currentProperty: any;
  properties: any[];
}

const ClientForm: FC<IProps> = ({ id, actions, currentClient, properties }) => {
  const navigate = useNavigate();
  const [addProperty, setAddProperty] = useState(false);
  const [editPropertyFor, setEditPropertyFor] = useState<any>(null);
  const [deletePropertyFor, setDeletePropertyFor] = useState<any>(null);

  const [initialValues, setInitialValues] = useState<IClient>({
    firstName: '',
    lastName: '',
    email: '',
    roles: ['CLIENT'],
    phoneNumber: '',
    password: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      postalCode: undefined,
      country: DEFAULT_COUNTRY.value
    },
    userData: {
      type: 'CLIENT',
      company: '',
      preferredTime: '',
      isCompanyNamePrimary: false
    },
    avatar: '',
    
  });

  const ClientSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    email: Yup.string().required(`Email is required`).email('Invalid email'),
    phoneNumber: Yup.string().label('Phone Number')
      .required(`Phone number is required`)
      .matches(
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        "Phone number must be at least 6 numbers to 14 numbers starting with '+'"
      ),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string(),
      city: Yup.string().required(`Suburb is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`)
    }),
    userData: Yup.object().shape({
      type: Yup.string(),
      preferredTime: Yup.string().notRequired(),
      companyName: Yup.string(),
      isCompanyNamePrimary: Yup.boolean().notRequired()
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ClientSchema,
    onSubmit: (data: any) => {
      // Set default password as phone number
      data.password = data.phoneNumber;

      // Update client
      if (id) actions.updateClient(data);
      // Add new client
      else actions.addClient(data);

      // Redirect to previous page
      setTimeout(() => navigate(-1), 600);
    }
  });

  /**
   * Save Property
   * @param data
   */
  const savePropertyHandler = async (data: any) => {
    if (currentClient?._id) {
      await actions.addProperty({ ...data, user: currentClient._id });

      actions.fetchProperties({ user: currentClient._id });
      setAddProperty(false);
    }
  };

  /**
   * Update Property
   * @param data
   */
  const updatePropertyHandler = async (data: any) => {
    if (currentClient?._id) {
      await actions.updateProperty({ ...data, user: currentClient._id });

      actions.fetchProperties({ user: currentClient._id });
      setEditPropertyFor(null);
    }
  };

  /**
   * Deletes the selected property from the list.
   */
  const deletePropertyHandler = async () => {
    try {
      if (!!deletePropertyFor) {
        await deletePropertyApi(deletePropertyFor);
        toast.success('Property deleted successfully');
        actions.deleteProperty(deletePropertyFor);
        setDeletePropertyFor('');
      }
    } catch (ex) {
      toast.error('Failed to delete property');
    }
  };

  /**
   * Custom Error Message
   *
   * @param param Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ name }: any) => {
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

  useEffect(() => {
    if (id) actions.fetchClient(id);

    return () => {
      actions.fetchClient = () => {};
    }
  }, [id, actions]);

  useEffect(() => {
    if (currentClient && id) {
      if (!currentClient.userData) {
        currentClient.userData = { type: 'CLIENT' };
      }
      setInitialValues(currentClient);
    }
  }, [currentClient, id]);

  useEffect(() => {
    if (currentClient?._id && id) actions.fetchProperties({ user: currentClient._id });

    return () => {
      actions.fetchProperties = () => {};
    }
  }, [id, currentClient?._id, actions]);

  return (
    <div className="row">
      <div className="col">
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className={`${currentClient && currentClient._id && id ? '' : 'row'} m-1`}>
            <div className="col card">
              <h5>Client Details</h5>
              <div className="row mt-3">
                <div className="col">
                  <InputField
                    label="First name"
                    value={formik.values.firstName}
                    placeholder="Enter first name"
                    name="firstName"
                    helperComponent={formik.errors.firstName && formik.touched.firstName ? <div className="txt-red">{formik.errors.firstName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="col">
                  <InputField
                    value={formik.values.lastName}
                    label="Last name"
                    placeholder="Enter last name"
                    name="lastName"
                    helperComponent={formik.errors.lastName && formik.touched.lastName ? <div className="txt-red">{formik.errors.lastName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <InputField
                label="Email address"
                value={formik.values.email}
                placeholder="Enter email address"
                type="email"
                name="email"
                helperComponent={formik.errors.email && formik.touched.email ? <div className="txt-red">{formik.errors.email}</div> : null}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="Company Name"
                name="userData.company"
                value={formik.values?.userData?.company || ''}
                placeholder="Enter company name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="mb-3">
                <input className="form-check-input" type="checkbox" checked={formik.values?.userData?.isCompanyNamePrimary} id="flexCheckDefault" name="userData.isCompanyNamePrimary" onChange={formik.handleChange}/>
                <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                  Use company name as the primary name
                </label>
              </div>
              <div className="mb-3">
                <SelectField
                  label="Preferred Time"
                  name="userData.preferredTime"
                  options={PREFERRED_TIME_OPTIONS}
                  helperComponent={<ErrorMessage name="userData.preferredTime" />}
                  value={PREFERRED_TIME_OPTIONS.find((option) => option.value === formik.values.userData.preferredTime)}
                  handleChange={(selectedOption: IOption) => {
                    formik.setFieldValue('userData.preferredTime', selectedOption.value);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className={`${currentClient && currentClient._id && id ? '' : 'ms-2'} col card`}>
              <div className="mb-3">
                <label className="txt-bold mb-2">Contact details</label>
                <div className="row">
                  <div className="col">
                    <InputField
                      label="Phone number"
                      placeholder="Enter phone number"
                      name="phoneNumber"
                      helperComponent={
                        formik.errors.phoneNumber && formik.touched.phoneNumber ? <div className="txt-red">{formik.errors.phoneNumber}</div> : null
                      }
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="txt-bold mt-2 mb-2">Address Section</label>
                  <div className="mb-3">
                    <SearchLocation formikForm={formik} addressPath={"address"}/>
                  </div>

                  <InputField
                    label="Street 1"
                    placeholder="Enter street 1"
                    name="address.street1"
                    helperComponent={<ErrorMessage name="address.street1" />}
                    value={formik.values.address?.street1 || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <InputField
                    label="Street 2"
                    placeholder="Enter street 2"
                    name="address.street2"
                    helperComponent={<ErrorMessage name="address.street2" />}
                    value={formik.values.address?.street2 || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="mb-3 row">
                    <div className="col">
                      <InputField
                        label="Suburb"
                        placeholder="Enter suburb"
                        name="address.city"
                        value={formik.values.address?.city}
                        helperComponent={<ErrorMessage name="address.city" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col">
                      <SelectField
                        label="State"
                        name="address.state"
                        options={STATES_OPTIONS}
                        helperComponent={<ErrorMessage name="address.state" />}
                        value={STATES_OPTIONS.find((option) => option.value === formik.values.address?.state) || null}
                        handleChange={(selectedOption: IOption) => {
                          formik.setFieldValue('address.state', selectedOption.value);
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="txt-red"></div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col">
                      <InputField
                        type="text"
                        label="Post code"
                        placeholder="Enter post code"
                        name="address.postalCode"
                        value={formik.values.address?.postalCode || ''}
                        helperComponent={<ErrorMessage name="address.postalCode" />}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col">
                      <SelectField
                        label="Country"
                        name="address.country"
                        options={COUNTRIES_OPTIONS}
                        helperComponent={<ErrorMessage name="address.country" />}
                        value={COUNTRIES_OPTIONS.find((option) => option.value === formik.values.address?.country)}
                        handleChange={(selectedOption: IOption) => {
                          formik.setFieldValue('address.country', selectedOption.value);
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 mt-2 m-1">
            <button
              type="submit"
              className="btn btn-primary"
            >
              {(id ? "Update" : "Save")} Client Info
            </button>
            <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {currentClient && currentClient._id && id ? (
        <div className="col pt-3">
          <div className="row">
            <div className="col card ms-3">
              <h5>{properties.length ? 'Listed Properties' : 'Properties'}</h5>
              {properties.length
                ? properties.map((property) => <PropertyDetail key={property?._id} setEditPropertyFor={setEditPropertyFor} setDeletePropertyFor={setDeletePropertyFor} property={property} />)
                : null
              }
              <div
                onClick={() => {
                  if (currentClient && currentClient._id) setAddProperty(true);
                }}
                className="dashed bold txt-orange pointer mt-2"
              >
                + {properties.length ? 'Additional' : 'Add'} property details
              </div>
            </div>
          </div>
          <Modal isOpen={!!addProperty} onRequestClose={() => setAddProperty(false)}>
            <div className={`modal fade show mt-3 mb-3`} role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog mt-5">
                <div className="modal-content">
                  <div className="modal-header row border-bottom">
                    <h5 className="col">Property details</h5>
                    <div className="col">
                      <span onClick={() => setAddProperty(false)} className="pointer d-flex float-end">
                        <box-icon name="x" />
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <Suspense fallback={<Loader isLoading={true} />}>
                      <PropertyForm
                        cleanForm={() => setAddProperty(false)}
                        saveProperty={savePropertyHandler}
                        updateProperty={updatePropertyHandler}
                        closeModal={() => setAddProperty(false)}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal isOpen={!!editPropertyFor} onRequestClose={() => setEditPropertyFor(null)}>
            <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog mt-5">
                <div className="modal-content">
                  <div className="modal-header row border-bottom">
                    <h5 className="col">Property details</h5>
                    <div className="col">
                      <span onClick={() => setEditPropertyFor(null)} className="pointer d-flex float-end">
                        <box-icon name="x" />
                      </span>{' '}
                    </div>
                  </div>
                  <div className="p-3">
                    <Suspense fallback={<Loader isLoading={true} />}>
                      <PropertyForm
                        currentProperty={editPropertyFor}
                        saveProperty={savePropertyHandler}
                        updateProperty={updatePropertyHandler}
                        cleanForm={() => setEditPropertyFor(null)}
                        closeModal={() => setEditPropertyFor(null)}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal isOpen={!!deletePropertyFor} onRequestClose={() => setDeletePropertyFor('')}>
            <DeleteConfirm onDelete={deletePropertyHandler} closeModal={() => setDeletePropertyFor('')} />
          </Modal>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isClientsLoading: state.clients.isLoading,
    currentClient: state.clients.currentUser,
    isPropertiesLoading: state.properties.isLoading,
    currentProperty: state.properties.currentItem,
    properties: state.properties.properties
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addClient: (data: IClient) => {
      dispatch(clientsActions.addClient(data));
    },
    fetchClient: (id: string) => {
      dispatch(clientsActions.fetchClient(id));
    },
    updateClient: (data: IClient) => {
      dispatch(clientsActions.updateClient(data));
    },
    addProperty: (data: any) => {
      dispatch(propertiesActions.addProperty(data));
    },
    fetchProperties: (filter: any) => {
      dispatch(propertiesActions.fetchProperties(filter));
    },
    updateProperty: (data: any) => {
      dispatch(propertiesActions.updateProperty(data));
    },
    deleteProperty: (data: any) => {
      dispatch(propertiesActions.deleteProperty(data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientForm);
