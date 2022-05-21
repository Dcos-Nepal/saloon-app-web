import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';

import { IClient } from 'common/types/client';
import InputField from 'common/components/form/Input';
import * as clientsActions from 'store/actions/clients.actions';
import * as jobRequestsActions from 'store/actions/job-requests.actions';
import { IRequest } from 'common/types/request';
import { Loader } from 'common/components/atoms/Loader';
import SelectAsync from 'common/components/form/AsyncSelect';
import { fetchUserProperties } from 'services/common.service';
import { StopIcon } from '@primer/octicons-react';
import { getData } from 'utils/storage';
import SelectField from 'common/components/form/Select';
import { getServices } from 'data';
import { IOption } from 'common/types/form';
import { DAYS_OF_WEEK } from 'common/constants';
import { DefaultEditor } from 'react-simple-wysiwyg';

interface IProps {
  actions: {
    fetchClients: (payload: any) => any;
    addJobRequest: (data: IRequest) => any;
    fetchJobRequest: (id: string) => void;
    updateJobRequest: (data: IRequest) => void;
  };
  clients: IClient[];
  id?: string;
  isJobRequestsLoading: boolean;
  currentJobRequest?: IRequest;
  isClientsLoading: boolean;
}

const RequestAddForm: FC<IProps> = ({ id, actions, isJobRequestsLoading, currentJobRequest }) => {
  const navigate = useNavigate();

  const currentUser = getData('user');
  const isClient = currentUser?.userData?.type === 'CLIENT';

  const [clientDetails, setClientDetails] = useState<any>(null);
  const [properties, setProperties] = useState([]);
  const [initialValues] = useState<any>(currentJobRequest && id ? {
    ...currentJobRequest,
    client: {
      label: currentJobRequest.client?.firstName,
      value: currentJobRequest.client?._id
    },
    property: currentJobRequest?.property?.id || '',
    workingHours: currentJobRequest.workingHours,
    workingDays: currentJobRequest.workingDays,
  } : {
    name: '',
    description: '',
    type: '',
    client: {
      label: 'Search for Clients...',
      value: ''
    },
    property: null,
    workingHours: {
      start: '',
      end: ''
    },
    workingDays: [],
  });

  const RequestSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    description: Yup.string().required(`Description is required`),
    type: Yup.string().required(`Type is required`),
    client: Yup.object().shape({
      value: Yup.string().required('Client is required for this quote'),
      label: Yup.string()
    }),
    property: Yup.string().notRequired().nullable(),
    workingHours: Yup.object().shape({
      start: Yup.string().required(`Start Time is required`),
      end: Yup.string().required(`End Time is required`)
    }),
    workingDays: Yup.array(Yup.string()).min(1, `Working days is required`),
    status: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RequestSchema,
    onSubmit: async (data: any) => {
      // Formatting Data
      data.client = data.client.value;
      data.property = data.property ? data.property : null;

      if (id) {
        // For updating the job request
        await actions.updateJobRequest(data);
      } else {
        // For Creating new job request
        await actions.addJobRequest(data);
      }

      // Reset the form
      formik.resetForm();

      // Navigate to the previous screen
      navigate(-1);
    }
  });

  /**
   * Handles Client selection
   */
  const handleClientSelection = useCallback(
    async ({ label, value, meta }: any) => {
      formik.setFieldValue(`client`, { label, value });
      setClientDetails(meta);

      const response = await fetchUserProperties(value);
      setProperties(response.data?.data?.data?.rows || []);
    },
    [formik]
  );

  /**
   * Handle working days change
   * @param day 
   */
  const onWorkingDaysChange = (day: string) => {
    if (formik.values.workingDays?.length && formik.values.workingDays.find((selectedDay: string) => selectedDay === day)) {
      formik.setFieldValue(
        'workingDays',
        formik.values.workingDays.filter((selectedDay: string) => selectedDay !== day)
      );
    } else {
      formik.setFieldValue('workingDays', formik.values.workingDays ? [...formik.values.workingDays, day] : [day]);
    }
  };

  useEffect(() => {
    actions.fetchClients({ roles: 'CLIENT' });
  }, [actions]);

  useEffect(() => {
    if (id) actions.fetchJobRequest(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentJobRequest && id) {
      setClientDetails(currentJobRequest?.client);
      fetchUserProperties(currentJobRequest?.client._id).then((response) => {
        setProperties(response.data?.data?.data?.rows || []);
      });
    }
  }, [id, currentJobRequest]);

  useEffect(() => {
    if (isClient && formik.values.client.value !== currentUser._id) {
      handleClientSelection({ label: `${currentUser.firstName} ${currentUser.lastName}`, value: currentUser._id, meta: currentUser });
    }
  }, [isClient, currentUser, formik, handleClientSelection]);

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
      <div className="row text-danger mt-1 mb-2">
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Loader isLoading={isJobRequestsLoading} />
      <div className="row mb-3">
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Details</h6>
            {id ? <div className="txt-orange mb-2">Ref. #{currentJobRequest?.reqCode || 'XXXXX'}</div> : null}
            <InputField
              label="Job title"
              placeholder="Enter job title"
              name="name"
              helperComponent={formik.errors.name && formik.touched.name ? <div className="txt-red">{formik.errors.name}</div> : null}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <SelectField
              label="Job type"
              name="type"
              placeholder="Select job type"
              value={getServices().find((service) => service.value === formik.values.type)}
              options={getServices().filter((service) => service.isActive)}
              helperComponent={
                formik.errors.type && formik.touched.type ? (
                  <div className="row text-danger mt-1 mb-2">
                    <ErrorMessage name="type" />
                  </div>
                ) : null
              }
              handleChange={(value: IOption) => {
                formik.setFieldValue('type', value.value);
              }}
              onBlur={formik.handleBlur}
            />
            <div className="mb-3">
              <label htmlFor="instructions" className="form-label txt-dark-grey">
                Job description
              </label>
              <DefaultEditor name="description" value={formik.values.description} onChange={formik.handleChange} />
              {formik.errors.description && formik.touched.description ? <div className="txt-red">{formik.errors.description}</div> : null}
            </div>

            <div className="mb-3 row">
              <div className="col-5">
                <InputField
                  label="Preferred working hours"
                  placeholder="Start Hours"
                  type="time"
                  name="workingHours.start"
                  value={formik.values.workingHours?.start}
                  helperComponent={<ErrorMessage name={'workingHours.start'} />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  label=""
                  placeholder="End Hours"
                  type="time"
                  name="workingHours.end"
                  value={formik.values.workingHours?.end}
                  helperComponent={<ErrorMessage name={'workingHours.end'} />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col week-list">
                <label className="form-label txt-dark-grey">Preferred working days and time</label>
                <ul>
                  {DAYS_OF_WEEK.map((day: string) => (
                    <li
                      key={day}
                      className={`${
                        (formik.values.workingDays?.length && !!formik.values.workingDays.find((selectedDay: string) => selectedDay === day))
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => onWorkingDaysChange(day)}
                    >
                      <span className="item">{day[0]?.toString().toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
                <ErrorMessage name="workingDays" />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card" style={{ height: '100%' }}>
            <h6 className="txt-bold">Client Details</h6>
            <SelectAsync
              name={`quoteFor`}
              label="Select Client"
              isDisabled={isClient}
              value={formik.values.client}
              resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'CLIENT' } }}
              onChange={handleClientSelection}
            />
            <ErrorMessage name={`quoteFor.value`} />
            {clientDetails ? (
              <div className="row bg-grey m-0">
                <div className="col p-2 ps-4">
                  <div className="txt-orange">{(clientDetails as any)?.fullName || `${clientDetails?.firstName} ${clientDetails?.lastName}`}</div>
                  <div className="txt-bold">
                    {(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}
                  </div>
                  <div className="txt-grey">
                    {(clientDetails as any)?.address?.street1}, {(clientDetails as any)?.address?.city}, {(clientDetails as any)?.address?.country}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="txt-bold mt-3 txt-grey">Client's Properties</div>

            {!properties.length ? (
              <div className="txt-orange">
                <StopIcon size={16} /> There are no properties assigned to the client.
              </div>
            ) : null}

            {(clientDetails as any)?.address ? (
              <div className="row mb-2 border-bottom">
                <div className="col-1 p-2 pt-3 ps-4">
                  <input name="property" type="radio" value="" onChange={formik.handleChange} checked={!!!formik.values.property} />
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Clients Primary Address</div>
                  <div className="">
                    {(clientDetails as any)?.address
                      ? `${(clientDetails as any)?.address?.street1}, ${(clientDetails as any)?.address?.city}, ${(clientDetails as any)?.address?.country}`
                      : 'No primary address added.'}
                  </div>
                </div>
              </div>
            ) : null}

            {properties.map((property: any) => {
              return (
                <div key={property._id} className="row mb-2 border-bottom">
                  <div className="col-1 p-2 pt-3 ps-4">
                    <input
                      name="property"
                      type="radio"
                      value={property._id}
                      onChange={formik.handleChange}
                      checked={property._id === formik.values.property}
                    />
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">{property.name}</div>
                    <div className="">
                      {property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mb-3 mt-3">
        <button type="submit" className="btn btn-primary">
          Save Request
        </button>
        <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
          Cancel
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    clients: state.clients.clients?.data?.rows || [],
    isClientsLoading: state.clients.isLoading,
    currentJobRequest: state.jobRequests.currentItem,
    isJobRequestsLoading: state.jobRequests.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClients: (payload: any) => {
      dispatch(clientsActions.fetchClients(payload));
    },
    addJobRequest: (data: any) => {
      dispatch(jobRequestsActions.addJobRequest(data));
    },
    fetchJobRequest: (id: string) => {
      dispatch(jobRequestsActions.fetchJobRequest(id));
    },
    updateJobRequest: (data: any) => {
      dispatch(jobRequestsActions.updateJobRequest(data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestAddForm);
