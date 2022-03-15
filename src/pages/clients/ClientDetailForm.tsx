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
import { COUNTRIES_OPTIONS, DEFAULT_COUNTRY, STATES_OPTIONS } from 'common/constants';

const PropertyForm = React.lazy(() => import('./PropertyForm'));

interface IProps {
  actions: {
    addClient: (data: IClient) => void;
    fetchClient: (id: string) => void;
    updateClient: (data: IClient) => void;
    addProperty: (data: any) => void;
    fetchProperties: (filter: any) => void;
    updateProperty: (data: any) => void;
  };
  id?: string;
  isClientsLoading: boolean;
  currentClient: IClient;
  isPropertiesLoading: boolean;
  currentProperty: any;
  properties: any[];
}

const ClientDetailForm: FC<IProps> = ({ id, actions, currentClient, properties, currentProperty, isPropertiesLoading }) => {
  const navigate = useNavigate();

  const [editPropertyFor, setEditPropertyFor] = useState<any>(null);
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
      company: ''
    },
    avatar: ''
  });

  useEffect(() => {
    if (id) actions.fetchClient(id);
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
  }, [id, currentClient?._id, actions]);

  const ClientSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    email: Yup.string().required(`Email is required`).email('Invalid email'),
    phoneNumber: Yup.string().label('Phone Number').required(`Phone number is required`).length(10),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string(),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`)
    }),
    userData: Yup.object().shape({
      type: Yup.string(),
      preferredTime: Yup.array(Yup.string()).notRequired(),
      companyName: Yup.string()
    })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ClientSchema,
    onSubmit: async (data: any) => {
      // Set default password as phone number
      data.password = data.phoneNumber;

      // Update client
      if (id) await actions.updateClient(data);
      // Add new client
      else await actions.addClient(data);

      // Navigate to the previous screen
      navigate(-1);
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
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                  Use company name as the primary name
                </label>
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
                  <label className="txt-bold mt-2 mb-2">Address</label>
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
                        label="City"
                        placeholder="Enter city"
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
              type="button"
              onClick={async () => {
                await formik.handleSubmit();
              }}
              className="btn btn-primary"
            >
              Save client
            </button>
            {id ? null : (
              <button
                type="button"
                onClick={async () => {
                  await formik.handleSubmit();
                }}
                className="btn btn-secondary ms-3"
              >
                Save and create another
              </button>
            )}
            <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
      {currentClient && currentClient._id && id ? (
        <div className="col pt-3">
          <div className="row">
            <div className="col-12">
              {properties.length ? <h5>Listed Properties</h5> : null}
              {properties.length ? properties.map((property) => <PropertyDetail setEditPropertyFor={setEditPropertyFor} property={property} />) : null}
            </div>
            <div className="col-12">
              {currentClient && currentClient._id ? (
                <>
                  <hr />
                  <h5>Property Form</h5>
                  <Suspense fallback={<Loader isLoading={true} />}>
                    <PropertyForm
                      currentProperty={editPropertyFor}
                      saveProperty={savePropertyHandler}
                      updateProperty={updatePropertyHandler}
                      cleanForm={() => setEditPropertyFor(null)}
                    />
                  </Suspense>
                </>
              ) : null}
            </div>
          </div>
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
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetailForm);
