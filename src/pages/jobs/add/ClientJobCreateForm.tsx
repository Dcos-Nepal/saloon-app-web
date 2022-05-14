import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import RRule, { Frequency } from 'rrule';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldArray, FormikProvider, useFormik, getIn } from 'formik';
import ReactRRuleGenerator, { translations } from 'common/components/rrule-form';
import { InfoIcon, PlusCircleIcon, StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';

import { IUser } from 'common/types/user';
import InputField from 'common/components/form/Input';
import TextArea from 'common/components/form/TextArea';
import * as jobActions from 'store/actions/job.actions';
import { Loader } from 'common/components/atoms/Loader';
import { CreateSchema } from './validations/create.schema';
import SelectAsync from 'common/components/form/AsyncSelect';
import { fetchUserProperties } from 'services/common.service';
import { getWorkerRecommendations } from 'services/users.service';
import AsyncInputDataList from 'common/components/form/AsyncInputDataList';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { getServices } from 'data';
import { deletePublicFile, uploadPublicFile } from 'services/files.service';

interface IProps {
  actions: {
    addJob: (data: any) => any;
  };
  isLoading: boolean;
}

const ClientJobCreateForm = ({ actions, isLoading }: IProps) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<Array<any>>([]);
  const [recommendedTeam, setRecommendedTeam] = useState<Array<any>>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [rruleStr, setRruleStr] = useState(new RRule({ dtstart: new Date(), interval: 1, freq: Frequency.DAILY }).toString());
  const [activeTab, setActiveTab] = useState('ONE-OFF');

  /**
   * Get Translation for RRule
   * @returns String
   */
  const getTranslation = () => {
    switch ('en') {
      case 'en':
        return translations.english;
      default:
        return translations.english;
    }
  };

  /**
   * Initial values for Job Creation Form
   */
  const initialValues = {
    title: '',
    instruction: '',
    jobFor: '',
    property: null,
    type: 'ONE-OFF',
    team: [],
    jobType: '',
    lineItems: [
      {
        name: { label: '', value: '' },
        description: '',
        quantity: 0,
        unitPrice: 0,
        total: 0
      }
    ],
    schedule: { rruleSet: '', startDate: '', startTime: '', endDate: '', endTime: '' },
    oneOff: { rruleSet: '', startDate: '', startTime: '', endDate: '', endTime: '' },
    notifyTeam: false,
    notes: '',
    docs: []
  };

  /**
   * Initializing the Formik
   */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: CreateSchema,
    validateOnChange: true,
    onSubmit: async (job: any) => {
      // Handle cases for not secondary properties
      if (!job.property) {
        delete job.property;
      }

      await actions.addJob({
        ...job,
        schedule: {
          ...job.schedule,
          startDate: new Date(`${job.schedule.startDate} ${job.schedule.startTime}`).toISOString(),
          endDate: new Date(`${job.schedule.endDate} ${job.schedule.endTime}`).toISOString()
        }
      });

      // Reset form
      formik.resetForm();
      setProperties([]);
      setClientDetails(null);
      setRecommendedTeam([]);
    }
  });

  /**
   * Handles Line Item selection
   * @param key
   * @param selected
   */
  const handleLineItemSelection = (key: string, { label, value, meta }: any) => {
    formik.setFieldValue(`${key}.name`, label);
    formik.setFieldValue(`${key}.description`, meta?.description || 'Enter your notes here...');
  };

  /**
   * Handles Client selection
   */
  const handleClientSelection = async ({ label, value, meta }: any) => {
    formik.setFieldValue(`jobFor`, meta._id);
    setClientDetails(meta);

    const response = await fetchUserProperties(value);
    setProperties(response.data?.data?.data?.rows || []);
  };

  /**
   * Handles Assignees selection
   */
  const handleWorkerSelection = (selected: any[]) => {
    setSelectedTeam(selected);
    formik.setFieldValue(
      `team`,
      selected.map((worker) => worker.meta._id)
    );
  };

  /**
   * Handles RRule
   * @param newRRule
   */
  const handleRecurringChange = (newRRule: any) => {
    setRruleStr(newRRule.rrule);
    const startDateTime = DateTime.fromFormat(newRRule.data.start.onDate.date, 'yyyy-MM-dd HH:mm');
    const endDateTime = DateTime.fromFormat(newRRule.data.end.onDate.date, 'yyyy-MM-dd HH:mm');
    formik.setFieldValue('schedule', {
      startDate: startDateTime.toFormat('yyyy-MM-dd'),
      startTime: startDateTime.toFormat('HH:mm'),
      endDate: endDateTime.toFormat('yyyy-MM-dd'),
      endTime: endDateTime.toFormat('HH:mm'),
      rruleSet: newRRule.rrule.toString()
    });
  };

  /**
   * Handle One-Off Job Change
   * @returns
   */
  const handleOneOffChange = () => {
    if (!formik.values.oneOff || !formik.values.oneOff?.startDate) return;
    let rule: any = {
      dtstart: formik.values.oneOff?.startTime
        ? new Date(`${formik.values.oneOff?.startDate} ${formik.values.oneOff?.startTime}`)
        : new Date(formik.values.oneOff?.startDate),
      interval: 1,
      freq: Frequency.DAILY
    };

    if (formik.values.oneOff?.endDate) {
      rule.until = formik.values.oneOff?.endTime
        ? new Date(`${formik.values.oneOff?.endDate} ${formik.values.oneOff?.endTime}`)
        : new Date(formik.values.oneOff?.endDate);
    }

    const rrule = new RRule(rule);
    formik.setFieldValue('schedule', { ...formik.values.oneOff, rruleSet: rrule.toString() });
  };

  /**
   * Handle File Upload
   * @param docKey
   */
  const handleFileUpload = async (event: any) => {
    if (!event.target.files?.length) {
      console.log('Error');
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const uploadedFile = await uploadPublicFile(formData);

      // Setting Formik form document properties
      formik.setFieldValue(`docs`, [...formik.values.docs, { key: uploadedFile.data.data.key, url: uploadedFile.data.data.url }]);
    } catch (error) {
      console.log('Error');
    }
  };

  /**
   * Handles file delete
   * @param docKey
   */
  const handleFileDelete = async (docKey: string) => {
    try {
      await deletePublicFile(docKey);

      // Setting Formik form document properties
      formik.setFieldValue(
        `docs`,
        formik.values.docs.filter((doc: any) => doc.key !== docKey)
      );
    } catch (error) {
      console.log('Error: ', error);
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
      <>
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </>
    ) : null;
  };

  /**
   * Handles One-Off change
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleOneOffChange, [formik.values.oneOff]);

  /**
   * Handles One-Off Job change
   */
  useEffect(() => {
    formik.setFieldValue('type', activeTab);
    if (activeTab === 'ONE-OFF') {
      handleOneOffChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /**
   * Handles Recommendation API call
   */
  useEffect(() => {
    if (
      formik.values.jobType &&
      formik.values.jobFor &&
      formik.values.property !== undefined &&
      ((formik.values.oneOff?.startTime && formik.values.oneOff?.endTime) || formik.values.schedule?.startTime)
    ) {
      (async () => {
        try {
          setIsRecommendationsLoading(true);
          const property = formik.values.property ? properties.find((property) => property._id === formik.values.property) : (clientDetails as any).address;
          const {
            data: { data: recommendationData }
          } = await getWorkerRecommendations({
            address: `${property?.city}, ${property?.state}, ${property?.country}`,
            startTime: formik.values.oneOff?.startTime && formik.values.oneOff?.endTime ? formik.values.oneOff?.startTime : formik.values.schedule?.startTime,
            endTime: formik.values.oneOff?.startTime && formik.values.oneOff?.endTime ? formik.values.oneOff?.endTime : formik.values.schedule?.endTime,
            jobType: formik.values.jobType
          });
          const team = recommendationData?.data?.map((recommendation: IUser) => {
            return {
              label: recommendation.fullName,
              value: recommendation._id
            };
          });
          setRecommendedTeam(team);
          setSelectedTeam(team);
        } catch (ex) {
          console.log(ex);
        } finally {
          setIsRecommendationsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    properties,
    formik.values.jobFor,
    formik.values.jobType,
    formik.values.property,
    formik.values.oneOff?.endTime,
    formik.values.oneOff?.startTime,
    formik.values.schedule?.endTime,
    formik.values.schedule?.startTime
  ]);

  return (
    <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
      <Loader isLoading={isLoading} />
      <FormikProvider value={formik}>
        <div className="row">
          <div className="col pb-3">
            <div className="card full-height">
              <h6 className="txt-bold">Job Details</h6>
              <div className="col">
                <div className="row">
                  <div className="col-12">
                    <InputField
                      label="Job Title"
                      type="text"
                      placeholder="Title"
                      name={`title`}
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      helperComponent={formik.errors.title && formik.touched.title ? <div className="txt-red">{formik.errors.title}</div> : null}
                    />
                  </div>
                  <div className="col-12">
                    <SelectField
                      label="Services Type"
                      name="jobType"
                      placeholder="Search available services..."
                      value={getServices().find((service) => service.value === formik.values.jobType)}
                      options={getServices().filter((service) => service.isActive)}
                      helperComponent={
                        <div className="row text-danger mt-1 mb-2">
                          <ErrorMessage name="jobType" />
                        </div>
                      }
                      handleChange={(value: IOption) => {
                        formik.setFieldValue('jobType', value.value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="col-12">
                    <TextArea
                      label={'Job Instructions'}
                      name={`instruction`}
                      rows={4}
                      value={formik.values.instruction}
                      onChange={formik.handleChange}
                      className={`form-control`}
                      placeholder={"Job's description..."}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col pb-3">
            <div className="card full-height">
              <h6 className="txt-bold">Client Details</h6>
              <SelectAsync
                name={`jobFor`}
                label="Select Client"
                resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'CLIENT' } }}
                onChange={handleClientSelection}
              />
              {formik.errors.jobFor && formik.touched.jobFor && <div className="txt-red">{formik.errors.jobFor}</div>}
              {clientDetails ? (
                <div className="row bg-grey m-0">
                  <div className="col p-2 ps-4">
                    <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
                    <div className="txt-bold">
                      {(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}
                    </div>
                    <div className="txt-grey">
                      {(clientDetails as any)?.address
                        ? `${(clientDetails as any)?.address?.street1}, ${(clientDetails as any)?.address?.city}, ${(clientDetails as any)?.address?.country}`
                        : 'No primary address added.'}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="txt-bold mt-3 txt-grey">Client's Properties</div>
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

              {!properties.length ? (
                <div className="txt-orange">
                  <StopIcon size={16} /> There are no properties assigned to the client.
                </div>
              ) : null}
              {properties.map((property: any) => (
                <div className="row mb-2 border-bottom" key={property._id}>
                  <div className="col-1 p-2 pt-3 ps-4">
                    <input name="property" type="radio" value={property._id} onChange={formik.handleChange} checked={property._id === formik.values.property} />
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">{property.name}</div>
                    <div className="">
                      {property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}
                    </div>
                  </div>
                </div>
              ))}
              {formik.errors.property && formik.touched.property && <div className="txt-red">{formik.errors.property}</div>}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="row m-2">
            <div className="col">
              <div
                className={`row pt-4 cursor-pointer ${activeTab === 'ONE-OFF' ? 'border-top-orange' : 'bg-light-grey border-top-grey'}`}
                onClick={() => {
                  setActiveTab('ONE-OFF');
                  formik.setFieldValue('schedule', {});
                }}
              >
                <div className="col-1">
                  <box-icon size="md" name="calendar-week"></box-icon>
                </div>
                <div className="col ms-2">
                  <h5>ONE-OFF JOB</h5>
                  <p>A one time job with one or more visits</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className={`row pt-4 cursor-pointer ${activeTab === 'RECURRING' ? 'border-top-orange' : 'bg-light-grey border-top-grey'}`}
                onClick={() => {
                  setActiveTab('RECURRING');
                  formik.setFieldValue('oneOff.endTime', undefined);
                  formik.setFieldValue('oneOff.startTime', undefined);
                }}
              >
                <div className="col-1">
                  <box-icon size="md" name="calendar"></box-icon>
                </div>
                <div className="col ms-2">
                  <h5>RECURRING JOB</h5>
                  <p>A recurring job with one or more visits</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {activeTab === 'ONE-OFF' ? (
              <div className="col card m-3">
                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <InputField
                        label="Start date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('oneOff.startDate', e.target.value)}
                        value={formik.values.oneOff?.startDate}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('oneOff.endDate', e.target.value)}
                        value={formik.values.oneOff?.endDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <InputField
                        label="Start time"
                        type="time"
                        onChange={(e: any) => formik.setFieldValue('oneOff.startTime', e.target.value)}
                        value={formik.values.oneOff?.startTime}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End time"
                        type="time"
                        onChange={(e: any) => formik.setFieldValue('oneOff.endTime', e.target.value)}
                        value={formik.values.oneOff?.endTime}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {activeTab === 'RECURRING' ? (
              <div className="col-6 my-3 mx-1">
                <ReactRRuleGenerator
                  onChange={handleRecurringChange as any}
                  value={formik.values.schedule.rruleSet || rruleStr}
                  config={
                    {
                      hideStart: false
                    } as any
                  }
                  translations={getTranslation() as any}
                />
              </div>
            ) : null}
            <div className="col card m-3">
              <div className="row mb-3">
                <div className="col d-flex flex-row">
                  <h6 className="txt-bold mt-2">Team</h6>
                </div>
              </div>

              {formik.values.jobFor &&
              formik.values.property !== undefined &&
              ((formik.values.oneOff?.startTime && formik.values.oneOff?.endTime) || formik.values.schedule?.startTime) &&
              formik.values.jobType ? (
                <>
                  <div className="row">
                    {isRecommendationsLoading ? (
                      <Loader isLoading />
                    ) : recommendedTeam.length ? (
                      <SelectField
                        isMulti
                        label=""
                        name="team"
                        options={recommendedTeam}
                        helperComponent={
                          <div className="row text-danger mt-1 mb-2">
                            <ErrorMessage name="team" />
                          </div>
                        }
                        value={selectedTeam}
                        handleChange={handleWorkerSelection}
                        onBlur={formik.handleBlur}
                      />
                    ) : (
                      <>
                        <SelectAsync
                          name={`team`}
                          label="Select Workers"
                          value={selectedTeam}
                          resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
                          onChange={handleWorkerSelection}
                          isMulti={true}
                          closeOnSelect={true}
                        />
                        <small className="text-warning">
                          <InfoIcon size={14} /> No recommendation found for the job, please select worker manually.
                        </small>
                      </>
                    )}
                    <div className="row text-danger mt-1 mb-2">
                      <ErrorMessage name={`team`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <input name="notifyTeam" className="form-check-input" type="checkbox" value="true" id="flexCheckDefault" onChange={formik.handleChange} />
                    <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                      Notify team about this assignment
                    </label>
                    <div>
                      <small>
                        <InfoIcon size={14} /> If you select Email, each team members will receive email notification.
                      </small>
                    </div>
                  </div>
                </>
              ) : (
                <div className="row">
                  <SelectAsync
                    isDisabled
                    name={`team`}
                    label="Select Workers"
                    value={selectedTeam}
                    resource={{ name: 'users/recommendation/', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
                    onChange={handleWorkerSelection}
                    isMulti={true}
                    closeOnSelect={true}
                  />

                  <div className="row text-danger mt-1 mb-2">
                    <div className="col-1" style={{ width: '20px' }}>
                      <StopIcon size={14} />
                    </div>
                    <div className="col">Select client, property, service type and time to get worker recommendation</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h6 className="txt-bold">Line items</h6>
          <small className="text-warning">
            <InfoIcon size={14} /> These line items will appear in the job details and invoice.
          </small>
          <div className="row">
            <div className="col-5 p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">PRODUCT / SERVICE</div>
            </div>
            <div className="col p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">QTY.</div>
            </div>
            <div className="col p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">UNIT PRICE</div>
            </div>
            <div className="col p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">TOTAL</div>
            </div>
            <div className="col-1 p-2 ps-3">
              <div className=""></div>
            </div>
          </div>

          <div className="row pb-3">
            <FieldArray
              name="lineItems"
              render={(arrayHelpers) => (
                <div>
                  {formik.values.lineItems.map((friend: any, index: number) => (
                    <Fragment key={`~${index}`}>
                      <div className="row ps-1">
                        <div className="col-5">
                          <AsyncInputDataList
                            name={`lineItems[${index}].name`}
                            placeholder="Search line items"
                            value={formik.values.lineItems[index].name}
                            resource={{ name: 'line-items', labelProp: 'name', valueProp: '_id' }}
                            onChange={(selected: any) => handleLineItemSelection(`lineItems[${index}]`, selected)}
                          />
                          <div className="row text-danger mt-1 mb-2">
                            <ErrorMessage name={`lineItems[${index}].name.label`} />
                          </div>
                          <textarea
                            name={`lineItems[${index}].description`}
                            value={formik.values.lineItems[index].description}
                            onChange={formik.handleChange}
                            className={`form-control mb-2`}
                            placeholder={"Line item's description..."}
                          />
                        </div>
                        <div className="col">
                          <InputField
                            placeholder="Quantity"
                            type="number"
                            name={`lineItems[${index}].quantity`}
                            value={formik.values.lineItems[index].quantity}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col">
                          <InputField
                            type="number"
                            placeholder="Unit Price"
                            name={`lineItems[${index}].unitPrice`}
                            value={formik.values.lineItems[index].unitPrice}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col pt-2 mt-1 ps-1 text-center">
                          <strong>{`$ ${formik.values.lineItems[index].quantity * formik.values.lineItems[index].unitPrice}`}</strong>
                        </div>
                        <div className="col-1 pt-2 mt-1 ps-1 pointer text-center">
                          <span
                            className="mr-2"
                            onClick={() =>
                              arrayHelpers.push({
                                name: '',
                                description: '',
                                quantity: 0,
                                unitPrice: 0,
                                total: 0
                              })
                            }
                          >
                            <PlusCircleIcon size={20} />
                          </span>
                          &nbsp;&nbsp;
                          {index !== 0 ? (
                            <span onClick={() => arrayHelpers.remove(index)}>
                              <XCircleIcon size={20} />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="row border-top">
            <div className="col d-flex flex-row mt-3">
              <h6 className="txt-bold mt-2">Job Total</h6>
            </div>
            <div className="col txt-bold mt-3">
              <div className="d-flex float-end">
                <h5 className="txt-bold mt-2">
                  $ {formik.values.lineItems.reduce((current: any, next: any) => (current += next.quantity * next.unitPrice), 0)}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <h6 className="txt-bold">Other Information</h6>
          <small className="text-warning">
            <InfoIcon size={14} /> Add any other notes for this job or any relevant documents.
          </small>
          <div className="mb-3">
            <TextArea
              rows={8}
              label={'Notes:'}
              placeholder="Required notes or description ..."
              name="note"
              value={formik.values.notes || ''}
              onChange={({ target }: { target: { value: string } }) => {
                if (target.value !== formik.values.notes) formik.setFieldValue('notes', target.value);
              }}
              helperComponent={<ErrorMessage name="note" />}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="additional-doc" className="form-label">
              Files/Pictures:
            </label>
            <div className="mb-3 ps-1 d-flex flex-row justify-content-start">
              {formik.values.docs.map((doc: any, index: number) => (
                <div key={`~${index}`} className="mr-2 p-2" style={{ position: 'relative' }}>
                  <div className="">
                    <img src={doc.url} className="rounded float-start" alt="" style={{ width: '150px', height: '150px' }} />
                  </div>
                  <div className="col mt-2"></div>
                  <div
                    className="col-2 mt-2 pointer text-center"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '5px',
                      left: 'auto',
                      bottom: 'auto'
                    }}
                  >
                    <span onClick={() => handleFileDelete(doc.key)}>
                      <XCircleIcon size={20} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="">
              <input className="form-control hidden" id="file" type="file" value={undefined} onChange={handleFileUpload} />
              <label htmlFor={'file'} className="txt-orange dashed mt-2">
                <UploadIcon /> Select documents/pictures related to this Job
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <button type="submit" className="btn btn-primary">
            Save Job
          </button>
          <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
            Cancel
          </button>
        </div>
      </FormikProvider>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.jobs.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addJob: (payload: any) => {
      dispatch(jobActions.createJobs(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientJobCreateForm);
