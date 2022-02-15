import * as Yup from 'yup';
import { useFormik, getIn } from 'formik';
import React, { Suspense, FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IOption } from 'common/types/form';
import PropertyDetail from './PropertyDetail';
import { IClient } from 'common/types/client';
import { StopIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import SelectField from 'common/components/form/Select';
import * as clientsActions from 'store/actions/clients.actions';
import * as propertiesActions from 'store/actions/properties.actions';
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

  const [addProperty, setAddProperty] = useState(false);
  const [editPropertyFor, setEditPropertyFor] = useState<any>(null);

  const [phoneNumberCount, setPhoneNumberCount] = useState(1);

  const [initialValues, setInitialValues] = useState<IClient>({
    firstName: '',
    lastName: '',
    email: '',
    roles: ['CLIENT'],
    phoneNumber: '',
    password: 'password',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      postalCode: undefined,
      country: ''
    },
    userDocuments: [
      {
        documentUrl: '',
        type: 'COMPANY-LOGO'
      }
    ],
    userImage: ''
  });

  useEffect(() => {
    if (id) actions.fetchClient(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentClient) setInitialValues(currentClient);
  }, [currentClient]);

  useEffect(() => {
    if (currentClient?._id) actions.fetchProperties({ user: currentClient._id });
  }, [currentClient?._id, actions]);

  const ClientSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    email: Yup.string().required(`Email is required`).email('Invalid email'),
    phoneNumber: Yup.string().label('Phone Number').required(`Phone number is required`).length(10),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string().required(`Street 2 is required`),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`)
    }),
    userDocuments: Yup.array(
      Yup.object().shape({
        documentUrl: Yup.string(),
        type: Yup.string()
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ClientSchema,
    onSubmit: async (data: any) => {
      // Update client
      if (id) await actions.updateClient(data);
      // Add new client
      else await actions.addClient(data);

      navigate(-1);
    }
  });

  const savePropertyHandler = async (data: any) => {
    if (currentClient?._id) {
      await actions.addProperty({ ...data, user: currentClient._id });

      actions.fetchProperties({ user: currentClient._id });
    }
  };

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

  const statesOption = [{ label: 'New South Wales', value: 'New South Wales' }];

  const countriesOption = [
    {
      label: 'AUS',
      value: 'AUS'
    }
  ];

  return (
    <>
      <form noValidate onSubmit={formik.handleSubmit}>
        <div className="row m-1">
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
            <InputField label="Company name" placeholder="Enter company name" />
            <div className="mb-3">
              <label className="form-label txt-dark-grey">Company logo</label>
              <div>
                <input
                  className="form-control hidden"
                  type="file"
                  id="companyLogo"
                  name="userDocuments[0].documentUrl"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="companyLogo" className="txt-orange dashed-file">
                  Click to browse or drag and drop your file to upload company logo
                </label>
                {formik.errors.userDocuments && formik.touched.userDocuments ? <div className="txt-red">{formik.errors.userDocuments}</div> : null}
              </div>
            </div>
            <div className="mb-3">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                Use company name as the primary name
              </label>
            </div>
            <div className="mb-3">
              <label className="txt-bold mb-2">Contact details</label>
              {Array.from(Array(phoneNumberCount), (_, index) => (
                <div className="row">
                  <div className="col-1 pt-2 mt-4 ps-3 pointer">
                    <box-icon name="star" color="#F5E059" />
                  </div>
                  <div className="col-3">
                    <SelectField label="Type" value={{ value: 'Main', label: 'Main' }} />
                  </div>
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
                  {index ? (
                    <div className="col-1 pt-4 mt-2 ps-1 pointer">
                      <span
                        onClick={() => {
                          setPhoneNumberCount(phoneNumberCount > 1 ? phoneNumberCount - 1 : phoneNumberCount);
                        }}
                      >
                        <box-icon name="x-square" type="solid" color="#FF0048" />
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div
              onClick={() => {
                setPhoneNumberCount(phoneNumberCount < 5 ? phoneNumberCount + 1 : phoneNumberCount);
              }}
              className="dashed bold txt-orange pointer mb-3"
            >
              + Add Phone number
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
                    options={statesOption}
                    helperComponent={<ErrorMessage name="address.state" />}
                    value={statesOption.find((option) => option.value === formik.values.address?.state)}
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
                    options={countriesOption}
                    helperComponent={<ErrorMessage name="address.country" />}
                    value={countriesOption.find((option) => option.value === formik.values.address?.country)}
                    handleChange={(selectedOption: IOption) => {
                      formik.setFieldValue('address.country', selectedOption.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col card ms-3">
            <h5>Property Details</h5>
            {properties.length ? properties.map((property) => <PropertyDetail setEditPropertyFor={setEditPropertyFor} property={property} />) : null}

            <div
              onClick={() => {
                if (currentClient && currentClient._id) setAddProperty(true);
                else toast.error('First add client to add property');
              }}
              className="dashed bold txt-orange pointer mt-2"
            >
              + {properties.length ? 'Additional' : 'Add'} property details
            </div>
          </div>
        </div>

        <div className="mb-3 mt-2">
          <button
            type="button"
            onClick={async () => {
              await formik.handleSubmit();
              // navigate(-1);
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
                // formik.resetForm();
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
      <Modal isOpen={addProperty} onRequestClose={() => setAddProperty(false)}>
        <>
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
              <PropertyForm saveProperty={savePropertyHandler} updateProperty={updatePropertyHandler} closeModal={() => setAddProperty(false)} />
            </Suspense>
          </div>
        </>
      </Modal>
      <Modal isOpen={editPropertyFor} onRequestClose={() => setEditPropertyFor(null)}>
        <>
          <div className="modal-header row border-bottom">
            <h5 className="col">Property details</h5>
            <div className="col">
              <span onClick={() => setEditPropertyFor(null)} className="pointer d-flex float-end">
                <box-icon name="x" />
              </span>
            </div>
          </div>
          <div className="p-3">
            <Suspense fallback={<Loader isLoading={true} />}>
              <PropertyForm
                currentProperty={editPropertyFor}
                saveProperty={savePropertyHandler}
                updateProperty={updatePropertyHandler}
                closeModal={() => setEditPropertyFor(null)}
              />
            </Suspense>
          </div>
        </>
      </Modal>
    </>
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
