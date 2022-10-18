import * as Yup from 'yup';
import { useFormik, getIn } from 'formik';
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IClient } from 'common/types/client';
import { InfoIcon, StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';

import * as clientsActions from 'store/actions/clients.actions';
import * as propertiesActions from 'store/actions/properties.actions';

interface IProps {
  actions: {
    addClient: (data: any) => void;
    fetchClient: (id: string) => void;
    updateClient: (data: any) => void;
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

const ClientForm: FC<IProps> = ({ id, isClientsLoading, actions, currentClient }) => {
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<IClient>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    photo: undefined
  });

  const ClientSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    email: Yup.string().notRequired().email('Invalid email'),
    phoneNumber: Yup.string()
      .label('Phone Number')
      .notRequired()
      .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, "Phone number must be at least 6 numbers to 14 numbers starting with '+'"),
    address: Yup.string(),
    photo: Yup.object().nullable()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ClientSchema,
    onSubmit: (data: any) => {
      // Cleaning up data
      data.email = data.email.trim().toLowerCase();

      // const formData = new FormData();

      // Add additional info to the Form Data
      // formData.append('firstName', data.firstName);
      // formData.append('lastName', data.lastName);
      // formData.append('email', data.email);
      // formData.append('phoneNumber', data.phoneNumber);
      // formData.append('address', data.address);

      // !!data.photo && formData.append('photo', data.photo);
      
      if (id) {
        // Update client
        actions.updateClient(data);
      } else {
        // Add new client
        actions.addClient(data);
      }

      // Redirect to previous page
      setTimeout(() => navigate(-1), 800);
    }
  });

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
  }, [id, actions]);

  useEffect(() => {
    if (currentClient && id) {
      setInitialValues(currentClient);
    }
  }, [currentClient, id]);

  useEffect(() => {
    if (currentClient?._id && id) actions.fetchProperties({ user: currentClient._id });
  }, [id, currentClient?._id, actions]);

  useEffect(() => {
    if (formik.isSubmitting && !isClientsLoading) {
      
    }
  }, [formik.isSubmitting, isClientsLoading]);

  return (
    <div className="row">
      <div className="col">
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className={`${currentClient && currentClient._id && id ? '' : 'row'} m-1`}>
            <Loader isLoading={isClientsLoading} />
            <div className="col card">
              <div>
                <h5>Client Details</h5>
                <small>Please note all fields with <span className='text-danger'>*</span> are required.</small>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <InputField
                    label="First name"
                    value={formik.values.firstName}
                    placeholder="Enter first name"
                    name="firstName"
                    helperComponent={formik.errors.firstName && formik.touched.firstName ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.firstName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isRequired={true}
                  />
                </div>
                <div className="col">
                  <InputField
                    value={formik.values.lastName}
                    label="Last name"
                    placeholder="Enter last name"
                    name="lastName"
                    helperComponent={formik.errors.lastName && formik.touched.lastName ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.lastName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isRequired={true}
                  />
                </div>
              </div>
              <InputField
                label={<span>Email address</span>}
                value={formik.values.email}
                placeholder="Enter email address"
                type="email"
                name="email"
                helperComponent={formik.errors.email && formik.touched.email ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.email}</div> : null}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRequired={false}
              />
            </div>
            <div className={`${currentClient && currentClient._id && id ? '' : 'ms-2'} col card`}>
              <div className="mb-3">
                <label className="txt-bold mb-2">Contact details</label>
                <div className="row">
                  <div className="col">
                    <InputField
                      label={<label>Phone Number:</label>}
                      placeholder="eg. +977 1234567890"
                      name="phoneNumber"
                      helperComponent={
                        formik.errors.phoneNumber && formik.touched.phoneNumber ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.phoneNumber}</div> : null
                      }
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={true}
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className="col">
                    {/* <label className="txt-bold mt-2 mb-2">Address Section</label> */}
                    <InputField
                      label="Address/Location"
                      placeholder="Enter your address"
                      name="address"
                      helperComponent={<ErrorMessage name="address" />}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isRequired={true}
                    />
                  </div>
                </div>

                {(!!formik.values?.photo) ? (
                  <div className="row mb-3 ps-1">
                    <div className="col-9">
                      <span className="mt-1 btn btn-secondary btn-sm">{(formik.values?.photo as File).name}</span>
                    </div>
                    <div className="col mt-2"></div>
                    <div className="col-2 mt-2 pointer text-center">
                      <span onClick={() => { formik.setFieldValue('photo', ''); }}>
                        <XCircleIcon size={20} />
                      </span>
                    </div>
                  </div>
                ) : null}
                {!(!!formik.values?.photo) ? (
                  <div className="">
                    <input
                      className="form-control hidden"
                      id="file"
                      type="file"
                      onChange={(event) => {
                        debugger
                        if (event.target.files?.length) {
                          formik.setFieldValue(`photo`, event.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor={'file'} className="txt-orange dashed mt-2">
                      <UploadIcon /> Select Picture of a customer
                    </label>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mb-3 mt-2 m-1">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update' : 'Save'} Client Info
            </button>
            <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
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
    addClient: (data: any) => {
      dispatch(clientsActions.addClient(data));
    },
    fetchClient: (id: string) => {
      dispatch(clientsActions.fetchClient(id));
    },
    updateClient: (data: any) => {
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
