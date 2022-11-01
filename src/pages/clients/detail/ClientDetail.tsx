import * as Yup from 'yup';
import { connect } from 'react-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IClient } from 'common/types/client';
import { Loader } from 'common/components/atoms/Loader';
import * as clientsActions from 'store/actions/clients.actions';
import { PencilIcon, StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import { DateTime } from 'luxon';
import { useFormik } from 'formik';
import { uploadPhotosApi } from 'services/users.service';
import InputField from 'common/components/form/Input';
import DummyImage from '../../../assets/images/dummy.png';
import Sessions from './Sessions';
import { toast } from 'react-toastify';

interface IRequest {
  id: string;
  name: string;
  description: string;
  requestDate: string;
  contact: string;
  status: string;
}

interface IQuote {
  id: string;
  title: string;
  description: string;
  quoteFor: any;
  property: any;
  lineItems: any[];
  status: { status: string; reason: string; updatedAt: string };
  total: string;
  createdAt: string;
  updatedAt: string;
}

interface IInvoice {
  id: string;
  subject: string;
  message: string;
  dueOnReceipt: boolean;
  isPaid: boolean;
  isIssued: boolean;
  invoiceFor: any;
  refJob?: any;
  refVisit?: any;
  refProperty?: any;
  lineItems: any[];
  total: string;
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  actions: {
    fetchClient: (id: string) => void;
  };
  id?: string;
  jobs: any[];
  quotes: IQuote[];
  properties: any[];
  invoices: IInvoice[];
  requests: IRequest[];
  isClientsLoading: boolean;
  currentClient: IClient;
}

const ClientDetail: FC<IProps> = ({ actions, currentClient, quotes, requests, invoices, jobs }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const Tabs = {
    ClientDetails: 'ClientDetails',
    Requests: 'Requests',
    Quotes: 'Quotes',
    Jobs: 'Jobs',
    Invoices: 'Invoices'
  };

  const [tab, setTab] = useState(Tabs.ClientDetails);

  const Quotes = () => {
    return (
      <div className="row mt-4">
        <div className="col p-2 ps-4">
          <div className="txt-grey">There are no Invoices assigned to this client.</div>
        </div>
      </div>
    );
  };

  const Requests = () => {
    return (
      <div className="row mt-4">
        <div className="col p-2 ps-4">
          <div className="txt-grey">There are no Invoices assigned to this client.</div>
        </div>
      </div>
    );
  };

  const Invoices = () => {
    return (
      <div className="row mt-4">
        <Sessions customer={currentClient?._id}/>
        <div className="col p-2 ps-4">
          <div className="txt-grey">There are no Invoices assigned to this client.</div>
        </div>
      </div>
    );
  };

  const ClientDetails = () => {
    return (
      <div className="row mt-4">
        <div className="col p-2 ps-4">
          <div className="txt-grey">There are no info in this section.</div>
        </div>
      </div>
    );
  };

  const Jobs = () => {
    const [initialValues,] = useState<any>({
      caption: '',
      type: ''
    });
  
    const opts: any = {
      caption: Yup.string().required(`Caption is required`),
      type: Yup.string().required(`Type is required`),
    }
  
    const ClientSchema = Yup.object().shape(opts);
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: ClientSchema,
      onSubmit: async (data: any) => {
        // Preparing FormData
        const formData = new FormData();
  
        // Add additional info to the Form Data
        formData.append('caption', data.caption);
        formData.append('type', data.type);
  
        !!data.photo && formData.append('photo', data.photo);
  
        // Update client
        await uploadPhotosApi(id as string, formData);

        formik.resetForm();
        toast.success('File uploaded successfully!')
      }
    });

    return (
      <div className="row mt-4">
        {(currentClient as any).photos.map((photo: any) => {
          return (
            <div className='row mb-2' key={photo.caption}>
              <div className="col-4">
                <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + photo.photo} style={{'width': '100px'}}>
                  <img src={DummyImage} alt="Stack Overflow logo and icons and such" style={{'width': '100px'}}/>
                </object>
              </div>
              <div className="row col-8">
                <div className="col-6">Caption: {photo.caption} </div>
                <div className="col-6">Type: {photo.type}</div>
              </div>
            </div>
          );
        })}
        
        <form noValidate onSubmit={formik.handleSubmit}>
          <h6 className='mt-3'>Add new picture:</h6>
          {(!!formik.values?.photo) ? (
            <div className="row mb-3 ps-1">
              <div className="col-3 mt-2 pointer text-center">
                {(typeof formik.values.photo) ? <img src={URL.createObjectURL(formik.values.photo as any)} style={{'width': "100px"}} /> : null}
              </div>
              {!id ? (
                <div className="col-2 mt-2 pointer text-center">
                  <span onClick={() => { formik.setFieldValue('photo', ''); }}>
                    <XCircleIcon size={20} />
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          {!(!!formik.values?.photo) ? (
            <div className="row mb-3 mt-2 px-3">
              <input
                className="form-control hidden"
                id="file"
                type="file"
                onChange={(event) => {
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

          <div className="col">
            <InputField
              label="Caption"
              value={formik.values.caption}
              placeholder="Enter Caption"
              name="caption"
              helperComponent={formik.errors.caption && formik.touched.caption ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.caption}</div> : null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isRequired={true}
            />
          </div>
          <div className="col">
            <InputField
              value={formik.values.type}
              label="Type"
              placeholder="Enter Type"
              name="type"
              helperComponent={formik.errors.type && formik.touched.type ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.type}</div> : null}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isRequired={true}
            />
          </div>

          <div className="mb-3 mt-2 m-1">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update' : 'Save'} Client Info
            </button>
          </div>
        </form>
      </div>
    );
  };

  const TabContent = () => {
    switch (tab) {
      case Tabs.ClientDetails:
        return <ClientDetails />;
      case Tabs.Invoices:
        return <Invoices />;
      case Tabs.Jobs:
        return <Jobs />;
      case Tabs.Quotes:
        return <Quotes />;
      case Tabs.Requests:
        return <Requests />;

      default:
        return (
          <div className="row mt-4 border-bottom">
            <div className="col p-2 ps-4">
              <div className="txt-grey">Nothing to show here</div>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (id) actions.fetchClient(id);
  }, [id]);

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        {currentClient ? (
          <div>
            <div className="d-flex flex-row mt-2">
              <h3 className="txt-bold extra">{currentClient?.fullName || `${currentClient?.firstName} ${currentClient?.lastName}` || ' - - '}</h3>
              <div className="col">
                <button onClick={() => id && navigate(`edit`)} type="button" className="btn btn-primary d-flex float-end me-2">
                  <PencilIcon className='mt-1' /> &nbsp; Edit Client Details
                </button>
              </div>
            </div>
            <div className="row m-1">
              <div className="col card">
                <div className="row">
                  <div className="col d-flex flex-row">
                    <h5 className="txt-bold">Client Details</h5>
                  </div>
                </div>
                <div className="hr mb-2" />
                <div className="row mt-2">
                  <div className="col-4">
                    <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + currentClient.photo} style={{'width': '100px'}}>
                      <img src={DummyImage} alt="Stack Overflow logo and icons and such" style={{'width': '100px'}}/>
                    </object>
                  </div>
                  <div className="col-8">
                    <div className="row mt-4">
                      <div className="col">
                        <div className="txt-grey">Gender</div>
                        <div className="">{currentClient.gender}</div>
                      </div>
                      <div className="col">
                        <div className="txt-grey">Date Of Birth</div>
                        <div className="">{DateTime.fromISO(currentClient.dateOfBirth as string).toFormat('yyyy-MM-dd') }</div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col">
                        <div className="txt-grey">Referred By</div>
                        <div className="">{currentClient.referredBy}</div>
                      </div>
                      <div className="col">
                        <div className="txt-grey">Email</div>
                        <div className="">{currentClient.email || '[Email not added]'}</div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col">
                        <div className="txt-grey">Phone</div>
                        <div className="">{currentClient.phoneNumber || '[Phone Number not added]'}</div>
                      </div>
                      <div className="col">
                        <div className="txt-grey">Client's Address</div>
                        <div className="">{currentClient?.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row card m-1 mt-3">
              <div className="row">
                <div className="col d-flex flex-row">
                  <h5 className="txt-bold">Overview</h5>
                </div>
              </div>
              <div className="">
                <div className="row mt-3">
                  <div className={`col tab me-1 ${tab === Tabs.ClientDetails ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.ClientDetails)}>
                    Client's Details
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Invoices ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Invoices)}>
                    Client's Sessions
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Jobs ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Jobs)}>
                    Client's Pictures
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Quotes ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Quotes)}>
                    Client used Products
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Requests ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Requests)}>
                    Client's Orders
                  </div>
                </div>
              </div>
              {<TabContent />}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentClient: state.clients.currentUser,
    isClientsLoading: state.clients.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClient: (id: string) => {
      dispatch(clientsActions.fetchClient(id));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);
