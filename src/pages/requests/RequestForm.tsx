import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';

import { IClient } from 'common/types/client';
import InputField from 'common/components/form/Input';
import * as clientsActions from 'store/actions/clients.actions';
import * as jobRequestsActions from 'store/actions/job-requests.actions';
import { IRequest } from 'common/types/request';
import { Loader } from 'common/components/atoms/Loader';
import SelectAsync from 'common/components/form/AsyncSelect';
import { fetchUserProperties } from 'services/common.service';
import { StopIcon } from '@primer/octicons-react';

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

const RequestAddForm: FC<IProps> = ({ id, actions, clients, isJobRequestsLoading, currentJobRequest }) => {
  const navigate = useNavigate();

  const [clientDetails, setClientDetails] = useState(null);
  const [properties, setProperties] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    type: '',
    client: {
      label: 'Search for Clients...',
      value: ''
    },
    property: null
  });

  useEffect(() => {
    actions.fetchClients({ roles: 'CLIENT' });
  }, [actions]);

  useEffect(() => {
    if (id) actions.fetchJobRequest(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentJobRequest && id) {
      setInitialValues({
        ...currentJobRequest,
        client: {
          label: currentJobRequest.client?.firstName,
          value: currentJobRequest.client?._id
        },
        property: currentJobRequest?.property?.id || ''
      });

      setClientDetails(currentJobRequest?.client);
      fetchUserProperties(currentJobRequest?.client._id).then((response) => {
        setProperties(response.data?.data?.data?.rows || []);
      });
    }
  }, [id, currentJobRequest]);

  const RequestSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    description: Yup.string().required(`Description is required`),
    type: Yup.string().required(`Type is required`),
    client: Yup.object().shape({
      value: Yup.string().required('Client is required for this quote'),
      label: Yup.string()
    }),
    property: Yup.string().notRequired(),
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
  const handleClientSelection = async ({ label, value, meta }: any) => {
    formik.setFieldValue(`client`, { label, value });
    setClientDetails(meta);

    const response = await fetchUserProperties(value);
    setProperties(response.data?.data?.data?.rows || []);
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
      <div className="row text-danger mt-1 mb-2">
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  return (
    <>
      {id ? <div className="txt-orange">Ref. #{currentJobRequest?.reqCode || 'XXXXX'}</div> : null}
      <form noValidate onSubmit={formik.handleSubmit}>
        <Loader isLoading={isJobRequestsLoading} />
        <div className="row mb-3">
          <div className="col">
            <div className="card">
              <h6 className="txt-bold">Job Details</h6>
              <InputField
                label="Job title"
                placeholder="Enter job title"
                name="name"
                helperComponent={formik.errors.name && formik.touched.name ? <div className="txt-red">{formik.errors.name}</div> : null}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="Job type"
                placeholder="Enter job type"
                name="type"
                value={formik.values.type}
                helperComponent={formik.errors.type && formik.touched.type ? <div className="txt-red">{formik.errors.type}</div> : null}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="mb-3">
                <label htmlFor="instructions" className="form-label txt-dark-grey">
                  Job description
                </label>
                <textarea
                  id="instructions"
                  name="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={12}
                  value={formik.values.description}
                  className={`form-control`}
                  placeholder={'Enter job description'}
                />
                {formik.errors.description && formik.touched.description ? <div className="txt-red">{formik.errors.description}</div> : null}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card" style={{ height: '100%' }}>
              <h6 className="txt-bold">Client Details</h6>
              <SelectAsync
                name={`quoteFor`}
                label="Select Client"
                value={formik.values.client}
                resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'CLIENT' } }}
                onChange={handleClientSelection}
              />
              <ErrorMessage name={`quoteFor.value`} />
              {clientDetails ? (
                <div className="row bg-grey m-0">
                  <div className="col p-2 ps-4">
                    <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
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
    </>
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
