import * as Yup from 'yup';
import { connect } from 'react-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IClient } from 'common/types/client';
import { Loader } from 'common/components/atoms/Loader';
import * as clientsActions from 'store/actions/clients.actions';
import { PencilIcon, StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import { DateTime } from 'luxon';
import { getIn, useFormik } from 'formik';
import { deleteUserPhotoApi, uploadPhotosApi } from 'services/customers.service';
import InputField from 'common/components/form/Input';
import DummyImage from '../../../assets/images/dummy.png';
import SessionList from './Sessions';
import { toast } from 'react-toastify';
import Modal from 'common/components/atoms/Modal';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { getPhotoTypes } from 'data';
import OrderList from 'pages/orders/list';

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
  id?: string;
  isClientsLoading: boolean;
  currentClient: IClient;
  actions: {
    fetchClient: (id: string) => void;
  };
}

const ClientDetail: FC<IProps> = ({ actions, currentClient }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const Tabs = {
    ClientDetails: 'ClientDetails',
    Orders: 'Orders',
    Quotes: 'Quotes',
    ClientPictures: 'ClientPictures',
    Sessions: 'Sessions'
  };

  const [tab, setTab] = useState(Tabs.ClientDetails);

  const Quotes = () => {
    return (
      <div className="row mt-4">
        <div className="col p-2 ps-4">
          <div className="txt-grey">There are no Sessions assigned to this client.</div>
        </div>
      </div>
    );
  };

  const Orders = () => {
    return (
      <div className="row mt-4">
        <OrderList customer={currentClient?._id}/>
      </div>
    );
  };

  const Sessions = () => {
    return (
      <div className="row mt-4">
        <SessionList customer={currentClient?._id}/>
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

  const ClientPictures = () => {
    const [selectedPicture, setSelectedPicture] = useState('');
    const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
    const [isDeleteInProgress, setIsDeleteInProgress] = useState<boolean>(false);
    const [clientPictures, setClientPictures] = useState<any>(currentClient.photos || []);
    const [initialValues,] = useState<any>({
      caption: '',
      type: '',
      data: ''
    });

    const ClientPhotoSchema = Yup.object().shape({
      caption: Yup.string().required(`Caption is required.`),
      type: Yup.string().required(`Type is required.`),
    });
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: ClientPhotoSchema,
      onSubmit: async (data: any) => {
        // Preparing FormData
        const formData = new FormData();
  
        // Add additional info to the Form Data
        formData.append('caption', data.caption);
        formData.append('type', data.type);
  
        !!data.photo && formData.append('file', data.photo);
  
        // Update client
        setIsFileUploading(true);
        const uploaded = await uploadPhotosApi(id as string, formData);

        if (!!uploaded) {
          setClientPictures([...uploaded.data.data.photos]);
          toast.success('File uploaded successfully!')
          setIsFileUploading(false);
        }

        formik.resetForm();
      }
    });

    /**
     * Remove Image
     * @param id String
     * @param fileId String
     */
    const removeImage = async (id: string, fileId: string) => {
      setIsDeleteInProgress(true);
      const updatedCustomer = await deleteUserPhotoApi(id, fileId);

      if (!!updatedCustomer) {
        setClientPictures([...updatedCustomer.data.data.photos]);
        toast.success('Photo deleted successfully!');
        setIsDeleteInProgress(false);
      }
    }

    /**
     * Renders the list of given pictures
     * @param pictures 
     * @returns JSX
     */
    const renderPictures = (pictures: any[]) => {
      return pictures.map((pic: any) => {
        return (
          <div className="col-2 text-center" key={pic.photo}>
            <div style={{'position': 'relative'}}>
              <Loader isLoading={isDeleteInProgress} />
              <object
                style={{'width': '100px'}}
                onClick={() => setSelectedPicture(pic.photo)}
                data={process.env.REACT_APP_API + 'v1/customers/avatars/' + pic.photo}>
                <img src={DummyImage} style={{'width': '100px'}} />
              </object>
              <span style={{ 'position': 'absolute', 'right': '10px', 'top': '10px'}} onClick={() => {removeImage(id as string, pic.photo)}}>
                <XCircleIcon size={20} />
              </span>
            </div>
            <div>{pic.caption}</div>
            <div>{pic.type}</div>
          </div>
        );
      });
    }

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
      <div className="card mt-4">
        {clientPictures.length !== 0 ? (<h6>Client Pictures:</h6>) : null}
        <div className='row'>{renderPictures(clientPictures)}</div>
        <div className='row'>
          <form noValidate onSubmit={formik.handleSubmit} style={{'position': 'relative'}}>
            <Loader isLoading={isFileUploading} />
            <h6 className='mt-3'>Add new picture:</h6>
            {(!!formik.values?.photo) ? (
              <div className="row mb-3 ps-1">
                <div className="col-3 mt-2 pointer text-center">
                  {(formik.values.photo) ? <img src={URL.createObjectURL(formik.values.photo as any)} style={{'width': "100px"}} /> : null}
                </div>
                <div className="col-2 mt-2 pointer text-center">
                  <span onClick={() => { formik.setFieldValue('photo', ''); }}>
                    <XCircleIcon size={20} />
                  </span>
                </div>
              </div>
            ) : null}

            {!(!!formik.values?.photo) ? (
              <div className="row mb-3 mt-2 px-3">
                <input
                  id="file"
                  type="file"
                  className="form-control hidden"
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
                name="caption"
                label="Caption"
                value={formik.values.caption}
                placeholder="Enter Caption"
                helperComponent={formik.errors.caption && formik.touched.caption ? <div className="txt-red"><StopIcon size={14} /> {formik.errors.caption}</div> : null}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRequired={true}
              />
            </div>
            <div className="col">
              <SelectField
                label="Select Photo Type"
                name="type"
                isMulti={false}
                value={getPhotoTypes().find((service) => formik.values.type === service.value)}
                options={getPhotoTypes().filter((service) => service.isActive)}
                helperComponent={<ErrorMessage name="type" />}
                handleChange={(selectedTag: IOption) => {
                  formik.setFieldValue('type', selectedTag.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mb-3 mt-2 m-1">
              <button type="submit" className="btn btn-primary">
                {id ? 'Update' : 'Save'} Client Info
              </button>
            </div>
          </form>
        </div>

        <Modal isOpen={!!selectedPicture} onRequestClose={() => setSelectedPicture('')}>
          <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog mt-5">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="col">View Photo</h5>
                  <div className="col">
                    <span onClick={() => setSelectedPicture('')} className="pointer d-flex float-end">
                      <box-icon name="x" />
                    </span>
                  </div>
                </div>
                <div className="modal-body text-center">
                  {selectedPicture ? (
                    <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + selectedPicture} style={{'minWidth': '250px', 'maxWidth': '300px'}}>
                      <img src={DummyImage} alt="Stack Overflow logo and icons and such" style={{'width': '100px'}}/>
                    </object>
                  ) : null}
                </div>
                <div className="modal-footer">
                  <button onClick={() => setSelectedPicture('')} type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  const TabContent = () => {
    switch (tab) {
      case Tabs.ClientDetails:
        return <ClientDetails />;
      case Tabs.Sessions:
        return <Sessions />;
      case Tabs.ClientPictures:
        return <ClientPictures />;
      case Tabs.Quotes:
        return <Quotes />;
      case Tabs.Orders:
        return <Orders />;

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
                  <div className={`col tab me-1 ${tab === Tabs.Sessions ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Sessions)}>
                    Client's Sessions
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.ClientPictures ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.ClientPictures)}>
                    Client's Pictures
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Quotes ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Quotes)}>
                    Client used Products
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Orders ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Orders)}>
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
