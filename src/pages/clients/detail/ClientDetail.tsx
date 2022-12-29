import * as Yup from 'yup';
import { connect } from 'react-redux';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IClient } from 'common/types/client';
import { Loader } from 'common/components/atoms/Loader';
import * as clientsActions from 'store/actions/clients.actions';
import { AlertIcon, AppsIcon, BellIcon, PencilIcon, RepoCloneIcon, RepoPushIcon, StarIcon, StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import { getIn, useFormik } from 'formik';
import { deleteUserPhotoApi, updateUserApi, uploadPhotosApi } from 'services/customers.service';
import InputField from 'common/components/form/Input';
import DummyImage from '../../../assets/images/dummy.png';
import SessionList from './Sessions';
import { toast } from 'react-toastify';
import Modal from 'common/components/atoms/Modal';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { getPhotoTypes } from 'data';
import OrderList from 'pages/orders/list';
import TextArea from 'common/components/form/TextArea';
import DeleteConfirm from 'common/components/DeleteConfirm';
import { getCurrentUser } from 'utils';
import SelectAsync from 'common/components/form/AsyncSelect';

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
  const [selectedPicture, setSelectedPicture] = useState('');

  const Tabs = {
    Orders: 'Orders',
    Quotes: 'Quotes',
    Sessions: 'Sessions',
    Diagnosis: 'Diagnosis',
    ClientPictures: 'ClientPictures',
    Suggestions: 'Suggestions'
  };

  const [tab, setTab] = useState(Tabs.ClientPictures);

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

  const Suggestions = () => {
    const [itemToDelete, setItemToDelete] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<any>(currentClient.productSuggestions || []);

    const [initialValues,] = useState<any>({
      title: '',
      product: {
        label: '',
        value: ''
      },
      description: ''
    });

    const SuggestionsSchema = Yup.object().shape({
      title: Yup.string().required(`Title is required.`),
      product: Yup.object().shape({
        value: Yup.string(),
        label: Yup.string()
      }).required('Please select a product.'),
      description: Yup.string().required(`Description is required.`),
    });
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: SuggestionsSchema,
      onSubmit: async (formData: any) => {
        // Preparing FormData
        const data = { ...formData, product: formData.product.value, createdDate: new Date().toISOString()};

        // Update client
        setIsSaving(true);
        const created = await updateUserApi({
          id: id,
          data: {
            ...currentClient,
            productSuggestions: [...suggestions, data]
          }
        });

        if (!!created) {
          setSuggestions([
            ...created.data.data.productSuggestions
              .map((s: any) => ({
                ...s,
                product: {
                  _id: formData.product.value,
                  name: formData.product.label,
                  description: ''
                }
              }))
          ]);
          toast.success('Product suggestion updated successfully!')
          setIsSaving(false);
        }

        formik.resetForm();
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

    /**
     * Remove Diagnosis
     * @param id String
     * @param fileId String
     */
    const removeSuggestion = async (title: string) => {
      const newSuggestions = suggestions.filter((d: any) => d.title !== title)
      const updated = await updateUserApi({
        id: id,
        data: {
          ...currentClient,
          productSuggestions: [...newSuggestions]
        }
      });

      if (!!updated) {
        setSuggestions([...updated.data.data.productSuggestions]);
        toast.success('Product suggestion removed successfully!')
        setItemToDelete('');
      }
    }

    /**
     * Handles Line Item selection
     * @param key String
     * @param selected { value: string; key: string; meta: any }
     */
    const handleProductSelection = (key: string, { label, value }: any) => {
      formik.setFieldValue(key, {label, value});
    };

    return (
      <>
        <div className=" row mt-3">
          <div className='col-4'>
            <form noValidate onSubmit={formik.handleSubmit} style={{'position': 'relative'}}>
              <Loader isLoading={isSaving} />
              <h6>New Product Suggestion:</h6>
              <div className="row">
                <InputField
                  label="Title"
                  type="text"
                  placeholder="Enter Title"
                  name={`title`}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  helperComponent={<ErrorMessage name="title" />}
                />
              </div>
              <SelectAsync
                name={`product`}
                label=""
                value={formik.values.product.value}
                resource={{ name: 'products', labelProp: 'name', valueProp: '_id' }}
                onChange={(selected: any) => handleProductSelection(`product`, selected)}
                helperComponent={<ErrorMessage name="product" />}
                preload={true}
              />
              <div className="row">
                <TextArea
                  rows={3}
                  label={'Description:'}
                  placeholder="Enter diagnosis details"
                  name="description"
                  value={formik.values.description || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperComponent={<ErrorMessage name="description" />}
                />
              </div>
              <div className="mb-2">
                <button type="submit" className="btn btn-primary">
                  {id ? 'Update' : 'Save'} Suggestion Info
                </button>
              </div>
            </form>
          </div>
          <div className='col-8'>
            <h6>Suggestion List:</h6>
            {suggestions.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Title</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th style={{width: '40px'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions
                    .map((diagno: any, index: number) => {
                      return <tr key={`~${diagno.title}_${index + ''}`}>
                        <td>{index + 1}</td>
                        <td>{diagno.title}</td>
                        <td><i>{diagno.product?.name || 'No Product Name'}</i></td>
                        <td><i>{diagno.description}</i></td>
                        <td style={{'position': 'relative'}}>
                          <span className='cursor-pointer' onClick={() => {setItemToDelete(diagno.title)}} style={{ 'position': 'absolute', 'right': '10px', 'top': '10px'}}>
                            <XCircleIcon size={20} />
                          </span>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            ) : null}
            {suggestions.length === 0 ? (<div className='row text-center mt-5'>
              <small><AlertIcon /> There are no Product Suggestions so far.</small>
            </div>) : null}
          </div>
        </div>
        <Modal isOpen={!!itemToDelete} onRequestClose={() => setItemToDelete('')}>
          <DeleteConfirm onDelete={removeSuggestion} item={itemToDelete} closeModal={() => setItemToDelete('')} />
        </Modal>
      </>
    );
  };

  const Sessions = () => {
    return (
      <div className="row mt-4">
        <SessionList customer={currentClient?._id}/>
      </div>
    );
  };

  const Diagnosis = () => {
    const currentUser = getCurrentUser();
    const [itemToDelete, setItemToDelete] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [diagnosis, setDiagnosis] = useState<any>(currentClient.diagnosis || []);

    const [initialValues,] = useState<any>({
      title: '',
      description: '',
      isPrivate: false
    });

    const ClientDiagnosisSchema = Yup.object().shape({
      title: Yup.string().required(`Title is required.`),
      description: Yup.string().required(`Description is required.`),
      isPrivate: Yup.boolean().required(`Is Private is required.`),
    });
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: ClientDiagnosisSchema,
      onSubmit: async (data: any) => {
        // Preparing FormData
        data = {
          ...data,
          createdDate: new Date().toISOString()
        };

        // Update client
        setIsSaving(true);
        const created = await updateUserApi({id: id, data: {...currentClient, diagnosis: [...diagnosis, data]}});

        if (!!created) {
          setDiagnosis([...created.data.data.diagnosis]);
          toast.success('Diagnosis updated successfully!')
          setIsSaving(false);
        }

        formik.resetForm();
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

    /**
     * Remove Diagnosis
     * @param id String
     * @param fileId String
     */
    const removeDiagnosis = async (title: string) => {
      const updated = await updateUserApi({
        id: id,
        data: {
          ...currentClient,
          diagnosis: [...diagnosis.filter((d: any) => d.title !== title)]
        }
      });

      if (!!updated) {
        setDiagnosis([...updated.data.data.diagnosis]);
        toast.success('Diagnosis updated successfully!')
        setItemToDelete('');
      }
    }

    return (
      <>
        <div className=" row mt-3">
          <div className='col-4'>
            <form noValidate onSubmit={formik.handleSubmit} style={{'position': 'relative'}}>
              <Loader isLoading={isSaving} />
              <h6>New Diagnosis:</h6>
              <div className="row">
                <InputField
                  label="Title"
                  type="text"
                  placeholder="Enter Title"
                  name={`title`}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  helperComponent={<ErrorMessage name="title" />}
                />
              </div>
              <div className="row">
                <TextArea
                  rows={3}
                  label={'Description:'}
                  placeholder="Enter diagnosis details"
                  name="description"
                  value={formik.values.description || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperComponent={<ErrorMessage name="description" />}
                />
              </div>
              <div className="row mb-3">
                <label>Private/Public?</label>
                <div className='row'>
                  <div className='col'>
                    <input id="private" className="mt-2" type="radio" name="isPrivate" value="true" onChange={formik.handleChange} checked={formik.values.isPrivate === 'true'}/>
                    &nbsp;<label htmlFor={'private'} className='form-label txt-dark-grey'>Private</label>
                  </div>
                  <div className='col'>
                    <input id="public" className="mt-2" type="radio" name="isPrivate" value="false" onChange={formik.handleChange} checked={formik.values.isPrivate === 'false'}/>
                    &nbsp;<label htmlFor={'public'} className='form-label txt-dark-grey'>Public</label>
                  </div>
                  <ErrorMessage name="isPrivate" />
                </div>
              </div>
              <div className="mb-2">
                <button type="submit" className="btn btn-primary">
                  {id ? 'Update' : 'Save'} Diagnosis Info
                </button>
              </div>
            </form>
          </div>
          <div className='col-8'>
            <h6>Diagnosis List:</h6>
            {diagnosis.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Access</th>
                    <th style={{width: '40px'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosis
                    .filter((diag: any) => currentUser.role.includes('SHOP_ADMIN' || 'ADMIN') || (!diag.isPrivate && currentUser.role.includes('RECEPTION')))
                    .map((diagno: any, index: number) => {
                      return <tr key={diagno.title}>
                        <td>{index + 1}</td>
                        <td>{diagno.title}</td>
                        <td><i>{diagno.description}</i></td>
                        <td><i>{diagno.isPrivate ? 'Private' : 'Public'}</i></td>
                        <td style={{'position': 'relative'}}>
                          <span className='cursor-pointer' onClick={() => {setItemToDelete(diagno.title)}} style={{ 'position': 'absolute', 'right': '10px', 'top': '10px'}}>
                            <XCircleIcon size={20} />
                          </span>
                        </td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            ) : null}
            {diagnosis.length === 0 ? (<div className='row text-center mt-5'>
              <small><AlertIcon /> There are no diagnosis added.</small>
            </div>) : null}
          </div>
        </div>
        <Modal isOpen={!!itemToDelete} onRequestClose={() => setItemToDelete('')}>
          <DeleteConfirm onDelete={removeDiagnosis} item={itemToDelete} closeModal={() => setItemToDelete('')} />
        </Modal>
      </>
    );
  };

  const ClientPictures = () => {
    const [selectedPicture, setSelectedPicture] = useState('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleteInProgress, setIsDeleteInProgress] = useState<boolean>(false);
    const [clientPictures, setClientPictures] = useState<any>(currentClient.photos || []);
    const [initialValues,] = useState<any>({
      caption: '',
      type: '',
      data: ''
    });

    const ClientPictureSchema = Yup.object().shape({
      caption: Yup.string().required(`Caption is required.`),
      type: Yup.string().required(`Type is required.`),
    });
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema: ClientPictureSchema,
      onSubmit: async (data: any) => {
        // Preparing FormData
        const formData = new FormData();
  
        // Add additional info to the Form Data
        formData.append('caption', data.caption);
        formData.append('type', data.type);
  
        !!data.photo && formData.append('file', data.photo);
  
        // Update client
        setIsSaving(true);
        const uploaded = await uploadPhotosApi(id as string, formData);

        if (!!uploaded) {
          setClientPictures([...uploaded.data.data.photos]);
          toast.success('File uploaded successfully!')
          setIsSaving(false);
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
      <div className="row mt-3">
        <div className='col-4'>
          <form noValidate onSubmit={formik.handleSubmit} style={{'position': 'relative'}}>
            <Loader isLoading={isSaving} />
            <h6>Add new picture:</h6>
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
                value={formik.values.type}
                options={getPhotoTypes().filter((service) => service.isActive)}
                helperComponent={<ErrorMessage name="type" />}
                handleChange={(selectedTag: IOption) => {
                  formik.setFieldValue('type', selectedTag.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mb-3 mt-3">
              <button type="submit" className="btn btn-primary">
                {id ? 'Update' : 'Save'} Client Info
              </button>
            </div>
          </form>
        </div>
        <div className='col-8'>
          <h6>Client Pictures:</h6>
          {renderPictures(clientPictures)}
          {clientPictures.length === 0 ? (<div className='pt-5 text-center'>
            <small><AlertIcon /> There are no pictures uploaded.</small>
          </div>) : null}
        </div>

        {/* Modals */}
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
                    <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + selectedPicture} style={{'width': '300px'}}>
                      <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                    </object>
                  ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
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
      case Tabs.Diagnosis:
        return <Diagnosis />;
      case Tabs.Sessions:
        return <Sessions />;
      case Tabs.ClientPictures:
        return <ClientPictures />;
      case Tabs.Quotes:
        return <Quotes />;
      case Tabs.Orders:
        return <Orders />;
      case Tabs.Suggestions:
        return <Suggestions />;

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
                    {currentClient.photo ? (
                      <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + currentClient.photo} style={{'width': '72px'}} onClick={() => setSelectedPicture(currentClient.photo as string)}>
                        <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                      </object>
                    ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
                  </div>
                  <div className="col-8">
                    <div className="row mt-4">
                      <div className="col">
                        <div className="txt-grey">Gender</div>
                        <div className="">{currentClient.gender}</div>
                      </div>
                      <div className="col">
                        <div className="txt-grey">Date Of Birth</div>
                        <div className="">{currentClient.dateOfBirth as string}</div>
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
                        <div className="">Primary: {currentClient.phoneNumber || '[Phone Number not added]'}</div>
                        <div className="">Alternative: {currentClient.altPhoneNumber || '[Phone Number not added]'}</div>
                      </div>
                      <div className="col">
                        <div className="txt-grey">Client's Address</div>
                        <div className="">{currentClient?.address}</div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col">
                        <div className="txt-grey">Description</div>
                        <div className="">{currentClient.notes || '-- --'}</div>
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
                  <div className={`col tab me-1 ${tab === Tabs.ClientPictures ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.ClientPictures)}>
                    <RepoPushIcon /> Client's Pictures
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Diagnosis ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Diagnosis)}>
                    <RepoCloneIcon /> Diagnosis Info
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Sessions ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Sessions)}>
                    <AlertIcon /> Sessions
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Quotes ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Quotes)}>
                    <BellIcon /> Used Products
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Orders ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Orders)}>
                    <AppsIcon /> Orders
                  </div>
                  <div className={`col tab me-1 ${tab === Tabs.Suggestions ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Suggestions)}>
                    <StarIcon /> Product Suggestion
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
                  <object data={process.env.REACT_APP_API +'v1/customers/avatars/' + selectedPicture} style={{'width': '300px'}}>
                    <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>
                  </object>
                ) : <img src={DummyImage} alt="Profile Picture" style={{'width': '72px'}}/>}
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
