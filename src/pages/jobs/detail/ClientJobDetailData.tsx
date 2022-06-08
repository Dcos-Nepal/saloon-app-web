import _ from 'lodash';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import RRule, { Frequency, RRuleSet, rrulestr } from 'rrule';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import {
  AlertIcon,
  CheckCircleIcon,
  EyeIcon,
  InfoIcon,
  LocationIcon,
  PencilIcon,
  PlusCircleIcon,
  StopIcon,
  TrashIcon,
  XCircleIcon
} from '@primer/octicons-react';

import * as jobsActions from 'store/actions/job.actions';
import * as visitsActions from 'store/actions/visit.actions';

import { getData } from 'utils/storage';
import { addVisitApi, updateStatus, updateVisitApi, deleteVisitApi, completeVisitApi } from 'services/visits.service';

import Modal from 'common/components/atoms/Modal';
import InputField from 'common/components/form/Input';
import TextArea from 'common/components/form/TextArea';
import SelectAsync from 'common/components/form/AsyncSelect';
import StarRating from 'common/components/StarRating';
import VisitCompletedActions from './VisitCompletedActions';
import { Loader } from 'common/components/atoms/Loader';
import VisitDetail from './VisitDetail';
import DeleteConfirm from 'common/components/DeleteConfirm';
import CompleteVisit from 'pages/schedules/CompleteVisit';
import { getCurrentUser, getJobAddress } from 'utils';
import Image from 'common/components/atoms/Image';
import { RecommendWorker } from 'common/components/RecommendWorker';

export interface IVisit {
  overdue: any;
  completed: any;
  [key: string]: any;
}

const ClientJobDetailData = ({ id, actions, job, jobVisits, isJobLoading, isVisitLoading }: any) => {
  const [visits, setVisits] = useState<IVisit>({ overdue: [], completed: [] });
  const [editVisitMode, setEditVisitMode] = useState(false);
  const [completeVisitMode, setCompleteVisitMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [askVisitInvoiceGeneration, setAskVisitInvoiceGeneration] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<any>();
  const [completedVisit, setCompletedVisit] = useState<any>();
  const [showEventDetail, setShowEventDetail] = useState<any | null>();
  const [selectedTeam, setSelectedTeam] = useState<Array<any>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currUser: { role: string; id: string } = getCurrentUser();

  /**
   * Maps visits in the respective grouping and prepare a list og groups
   *
   * @param visitSettings []
   * @returns Object
   */
  const mapVisits = (visitSettings: any[]) => {
    const mappedVisits = visitSettings.reduce((acc: any, visitSetting) => {
      const rruleSet = new RRuleSet();

      if (visitSetting.job.type !== 'ONE-OFF') {
        rruleSet.rrule(rrulestr(visitSetting.rruleSet));
        visitSetting.excRrule.map((rule: string) => rruleSet.exrule(rrulestr(rule)));
        rruleSet.all().map((visit, index: number) => {
          let visitMonth = DateTime.fromJSDate(visit).toFormat('LLL');

          if (visitSetting.status.status === 'COMPLETED') visitMonth = 'completed';
          else if (new Date(visit).valueOf() < new Date().valueOf()) visitMonth = 'overdue';

          let visitObj: any = {
            ...visitSetting,
            group: visitMonth,
            visitMapId: `${visitSetting._id}_${visitMonth}_${index}`,
            startDate: visit,
            title: visitSetting.inheritJob ? job?.title : visitSetting.title,
            instruction: visitSetting.inheritJob ? job?.instruction : visitSetting.instruction,
            team: visitSetting?.team ? visitSetting?.team : job?.team,
            lineItems: visitSetting.inheritJob ? job?.lineItems : visitSetting.lineItems,
            type: job?.type
          };

          if (acc[visitMonth]) acc[visitMonth].push(visitObj);
          else acc[visitMonth] = [visitObj];
          return true;
        });
      } else {
        let visitMonth = DateTime.fromJSDate(new Date(visitSetting.startDate)).toFormat('LLL');
        if (visitSetting.status.status === 'COMPLETED') visitMonth = 'completed';
        else if (new Date(visitSetting.startDate).valueOf() < new Date().valueOf()) visitMonth = 'overdue';

        let visitObj: any = {
          ...visitSetting,
          group: visitMonth,
          visitMapId: `${visitSetting._id}_${visitMonth}`,
          startDate: new Date(visitSetting.startDate),
          title: visitSetting.inheritJob ? job?.title : visitSetting.title,
          instruction: visitSetting.inheritJob ? job?.instruction : visitSetting.instruction,
          team: visitSetting?.team ? visitSetting?.team : job?.team,
          lineItems: visitSetting.inheritJob ? job?.lineItems : visitSetting.lineItems
        };
        if (acc[visitMonth]) acc[visitMonth].push(visitObj);
        else acc[visitMonth] = [visitObj];
      }

      return acc;
    }, {});

    return mappedVisits;
  };

  /**
   * Handles the process of marking the visit as complete
   *
   * @param visitCompleted Boolean
   * @param visit IVisitList
   * @returns Void
   */
  const markVisitCompleteHandler = async (visitCompleted: boolean, visit: IVisit) => {
    let newlyCreatedVisit: any;

    // If the visit has multiple visits
    if (visit.hasMultiVisit) {
      // Create One-Off rrule for to-complete visit
      const rrule = createOneOffRule({ ...visit, startDate: DateTime.fromJSDate(visit?.startDate).toFormat('yyyy-MM-dd') });

      let newVisit = { ...visit };
      delete newVisit._id;

      // Creating the visit with completed status
      newlyCreatedVisit = await addVisitApi({
        ...newVisit,
        job: newVisit.job?._id,
        inheritJob: false,
        rruleSet: rrule,
        visitFor: newVisit.job?.jobFor?._id,
        team: newVisit.team.map((t: { _id: string }) => t._id),
        status: {
          status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED',
          updatedBy: getData('user')._id
        },
        isPrimary: false,
        hasMultiVisit: false
      });

      // Update existing primary visit with newly created visit as exception
      await updateVisitApi(visit._id, {
        excRrule: [...visit.excRrule, rrule]
      });
    } else {
      await updateStatus(visit._id, { status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED' });
    }

    const newVisits: any = _.cloneDeep(visits);
    const updatedVisit = newVisits[visit.group].find((v: any) => v.visitMapId === visit.visitMapId);
    updatedVisit.status = { status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED', updatedBy: getData('user')._id };

    // Updating the visit list updating the completed visit position.
    setVisits(newVisits);

    // Now if the visit complete step is complete, ask to fill the visit completion form.
    setCompleteVisitMode(true);
    setSelectedVisit({
      ...(visit.hasMultiVisit ? newlyCreatedVisit?.data.data.data : visit),
      job: visit.job
    });
    // And hide the Event detail view
    setShowEventDetail(false);
  };

  /**
   * Visit complete handler
   * @param data
   */
  const completeVisitHandler = async (data: any) => {
    try {
      await completeVisitApi(selectedVisit?._id, data);

      setAskVisitInvoiceGeneration(true);
      setCompletedVisit(selectedVisit);
      setCompleteVisitMode(false);
      setSelectedVisit(null);
    } catch (ex) {
      toast.error('Failed to complete visit');
    }
  };

  /**
   * Displays the visit in edit mode
   *
   * @param visit any
   * @returns Void
   */
  const editVisit = (visit: any) => {
    setEditVisitMode(true);
    setSelectedVisit(visit);
  };

  /**
   * Handles visit update feature
   */
  const visitEditForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      ..._.cloneDeep(selectedVisit),
      team: selectedVisit?.team ? selectedVisit?.team.map((t: any) => ({ _id: t._id, value: t._id, label: t.fullName })) : [],
      startDate: DateTime.fromJSDate(selectedVisit?.startDate).toFormat('yyyy-MM-dd'),
      endDate: DateTime.fromJSDate(selectedVisit?.endDate ? new Date(selectedVisit?.endDate) : selectedVisit?.startDate).toFormat('yyyy-MM-dd')
    },
    validateOnChange: true,
    onSubmit: async (visit) => {
      setEditVisitMode(false);
      const newVisits: any = _.cloneDeep(visits);
      const updatedVisit = newVisits[visit.group].find((v: any) => v.visitMapId === visit.visitMapId);
      Object.assign(updatedVisit, { ...visit, startDate: new Date(`${visit.startDate} ${visit.startTime}`) });
      setVisits(newVisits);
    }
  });

  /**
   * Handles visit save feature
   *
   * @param visit any
   * @param updateFollowing
   * @returns Void
   */
  const saveVisit = async (visit: any, updateFollowing = false) => {
    setIsSubmitting(true);

    // Creating One-Off RRule for a selected visit
    const rrule = createOneOffRule({ ...visit, startDate: DateTime.fromJSDate(new Date(visit?.startDate)).toFormat('yyyy-MM-dd') });

    if (visit.job.type === 'ONE-OFF') {
      await updateVisitApi(
        visit._id,
        {
          ...visit,
          job: visit.job?._id,
          rruleSet: rrule,
          team: visit.team.map((t: any) => t._id || t),
          startDate: new Date(`${visit.startDate} ${visit.startTime}`),
          endDate: new Date(`${visit.endDate} ${visit.endTime}`)
        },
        null
      );
    } else {
      if (visit.hasMultiVisit) {
        let newVisit = { ...visit, rruleSet: rrule };

        // If you don't want to update following visits
        if (!updateFollowing) delete newVisit._id;

        // Make API Call to create a new Visit
        await addVisitApi(
          {
            ...newVisit,
            job: newVisit.job?._id,
            inheritJob: false,
            rruleSet: rrule,
            isPrimary: false,
            excRrule: [],
            hasMultiVisit: updateFollowing,
            visitFor: newVisit.job?.jobFor?._id,
            startDate: new Date(`${newVisit.startDate} ${newVisit.startTime}`),
            endDate: new Date(`${newVisit.endDate} ${newVisit.endTime}`),
            team: newVisit.team.map((t: any) => t._id || t)
          },
          updateFollowing ? { updateFollowing } : null
        );

        // If you want to update following visits
        // Update the Primary visit with RRule Exception
        if (!updateFollowing) {
          await updateVisitApi(visit._id, {
            excRrule: [...visit.excRrule, rrule]
          });
        }
      } else {
        // Update a visit
        await updateVisitApi(
          visit._id,
          {
            ...visit,
            job: visit.job?._id,
            rruleSet: rrule,
            team: visit.team.map((t: any) => t._id || t),
            startDate: new Date(`${visit.startDate} ${visit.startTime}`),
            endDate: new Date(`${visit.endDate} ${visit.endTime}`)
          },
          updateFollowing ? { updateFollowing } : null
        );
      }
    }

    await actions.fetchVisits({ job: id });

    toast.success('Job Updated');

    setIsSubmitting(false);
    setEditVisitMode(false);
  };

  /**
   * Creates Rrule for one-time-off job visit
   *
   * @param visit any
   * @returns String
   */
  const createOneOffRule = (visit: any) => {
    return new RRule({
      dtstart: new Date(`${visit.startDate} ${visit.startTime}`),
      interval: 1,
      count: 1,
      freq: Frequency.DAILY
    }).toString();
  };

  /**
   * Handles line items selection
   * @param key string
   * @param param Object
   */
  const handleLineItemSelection = (key: string, { label, meta }: any) => {
    visitEditForm.setFieldValue(`${key}.name`, label);
    visitEditForm.setFieldValue(`${key}.description`, meta?.description || 'Enter your notes here...');
  };

  /**
   * Handles delete visit click
   * @param visit any
   */
  const handleDeleteVisitClick = (visit: any) => {
    setShowDeleteConfirmation(true);
    setSelectedVisit(visit);
  };

  /**
   * Adds functionality to delete a selected visit.
   * @returns Void
   */
  const deleteVisit = () => {
    if (!selectedVisit) return;

    const rrule = createOneOffRule({ ...selectedVisit, startDate: DateTime.fromJSDate(selectedVisit?.startDate).toFormat('yyyy-MM-dd') });
    try {
      if (selectedVisit.hasMultiVisit) {
        updateVisitApi(selectedVisit._id, {
          excRrule: [...selectedVisit.excRrule, rrule]
        });
      } else {
        deleteVisitApi(selectedVisit._id);
      }
      toast.success('Job deleted');
      const newVisits: any = _.cloneDeep(visits);
      newVisits[selectedVisit.group] = newVisits[selectedVisit.group].filter((v: any) => v.visitMapId !== selectedVisit.visitMapId);
      setVisits(newVisits);
    } catch (error) {
      toast.error('Something went wrong');
    }
    setShowDeleteConfirmation(false);
    setSelectedVisit(null);
  };

  /**
   * Calculate duration
   * @param options
   * @returns String
   */
  const calculateJobDuration = (options: any) => {
    const foundDates = [];
    const date1 = DateTime.fromISO(options?.endDate);
    const date2 = DateTime.fromISO(options?.startDate);
    const { years, months, days, hours } = date1.diff(date2, ['years', 'months', 'days', 'hours']);

    if (years) foundDates.push(`${years.toFixed(1)} years`);
    if (months) foundDates.push(`${months.toFixed(1)} months`);
    if (days) foundDates.push(`${days.toFixed(1)} days`);
    if (hours) foundDates.push(`${hours.toFixed(1)} hours`);

    return foundDates.join(', ');
  };

  useEffect(() => {
    if (!id) return;
    actions.fetchJob(id);
    actions.fetchVisits({ job: id });
  }, [id, actions]);

  useEffect(() => {
    if (!job || !jobVisits?.data?.rows?.length) return;
    const visits = mapVisits(jobVisits.data.rows);
    setVisits(visits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobVisits, job]);

  useEffect(() => {
    if (selectedVisit?.team?.length) {
      setSelectedTeam(
        selectedVisit?.team?.map((worker: any) => {
          return { label: worker.fullName, value: worker._id };
        })
      );
    }
  }, [selectedVisit]);

  /**
   * Handles Assignees selection
   */
  const handleWorkerSelection = useCallback(
    (selected: any[]) => {
      setSelectedTeam(selected);
      visitEditForm.setFieldValue(
        `team`,
        selected.map((worker) => ({ label: worker.label, value: worker.value }))
      );
    },
    [visitEditForm]
  );

  return (
    <div>
      <div className="row mt-1 mb-4">
        <Loader isLoading={isJobLoading} />
        <div className="col-12 mb-2">
          <div className="card">
            <div className="row">
              <div className="col">
                <h5 className="txt-bold">Information</h5>
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job Title</div>
                <div className="">{job?.title}</div>
              </div>
            </div>
            <div className="row">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Instructions</div>
                <i className="">{job?.instruction}</i>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card full-height">
            <div className="row">
              <div className="col p-2 ps-4">
                <label className="txt-bold">Client Name</label>
                <h5 className="txt-bold">{job?.jobFor.fullName}</h5>
              </div>
              <div className="col">
                <h4 className="txt-bold d-flex float-end mt-2">
                  ${job?.lineItems.reduce((current: number, next: { quantity: number; unitPrice: number }) => (current += next.quantity * next.unitPrice), 0)}{' '}
                  Cash
                </h4>
              </div>
            </div>
            <div className="row mt-3 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Property address</div>
                <div className="">
                  <LocationIcon /> {getJobAddress(job)}
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Contact details</div>
                <div className="">
                  <InfoIcon /> {job?.jobFor?.phoneNumber}/{job?.jobFor?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card full-height">
            <div className="d-flex flex-row justify-content-between">
              <h6 className="txt-bold">Job Detail</h6>
              <>
                {job?.isCompleted === true ? (
                  <span className={`status txt-green`}>
                    <CheckCircleIcon /> COMPLETED
                  </span>
                ) : (
                  <span className={`status txt-orange`}>
                    <AlertIcon /> Pending / In-Progress
                  </span>
                )}
              </>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job Number</div>
                <div className="row">
                  <div className="col txt-orange">
                    <strong>#{job?.refCode || 'XXXXX'}</strong>
                  </div>
                </div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job type</div>
                <div className="">{job?.type}</div>
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Started on</div>
                <div className="">{DateTime.fromISO(job?.startDate).toFormat('yyyy LLL dd')}</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Lasts for</div>
                <div className="">{job?.primaryVisit ? calculateJobDuration(job?.primaryVisit) : 'N/A'}</div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Billing frequency</div>
                <div className="">After every visit</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Schedule</div>
                {job && job?.primaryVisit?.rruleSet ? <div className="">{_.startCase(rrulestr(job?.primaryVisit?.rruleSet).toText())}</div> : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <Loader isLoading={isJobLoading} />
        <h6 className="txt-bold">Line items/Services</h6>
        <div className="row border-bottom p-3">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">#SN</th>
                <th scope="col" className="col-6">
                  PRODUCT / SERVICE
                </th>
                <th scope="col">QTY</th>
                <th scope="col">UNIT PRICE</th>
                <th scope="col">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {!job?.lineItems.length ? (
                <tr>
                  <td colSpan={5}>No line items selected</td>
                </tr>
              ) : null}
              {job?.lineItems.map((item: any, index: number) => (
                <tr key={'li-' + index}>
                  <th scope="row">#00{index + 1}</th>
                  <td>
                    <div>
                      <strong>{item.name}</strong>
                    </div>
                    <div>
                      <small>{item.description}</small>
                    </div>
                  </td>
                  <td>
                    <strong>{item.quantity}</strong>
                  </td>
                  <td>
                    <strong>${item.unitPrice}</strong>
                  </td>
                  <td>
                    <strong>${item.quantity * item.unitPrice}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row border-top">
          <div className="col d-flex flex-row mt-3">
            <h6 className="txt-bold mt-2">Total</h6>
          </div>
          <div className="col txt-bold mt-3">
            <div className="d-flex float-end">
              <h5 className="txt-bold mt-2">
                ${job?.lineItems.reduce((current: number, next: { quantity: number; unitPrice: number }) => (current += next.quantity * next.unitPrice), 0)}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {job?.isCompleted ? (
        <div className="row mt-3 mb-3">
          <Loader isLoading={isJobLoading} />
          <div className="col">
            <div className="card">
              <h6 className="txt-bold">Job Completion Info</h6>
              <div className="row mt-3 pb-2 border-bottom">
                <div className="col p-2 ps-4 mt-1">
                  <div className="txt-grey">Status:</div>
                  <span className="status status-green">COMPLETED</span>
                  <div className="mt-2">Completed On:</div>
                  <span className={`status status-primary`}>{new Date(job?.completion?.date).toLocaleDateString()}</span>
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Completion Note:</div>
                  <div className="">{job?.completion?.note}</div>
                </div>
              </div>
              {job?.completion?.docs?.length ? (
                <div className="row pb-2 border-bottom">
                  <div className="col-12 p-2 ps-4 mt-1">
                    <div className="txt-grey mb-2">Uploaded Documents</div>
                    <div className="d-flex flex-row justify-content-start">
                      {job?.completion?.docs.map((doc: any, index: number) => (
                        <div key={`~${index}_doc`} className="mr-2 p-2">
                          <a target="_blank" href={doc.url} rel="noreferrer">
                            <Image fileSrc={doc.url} className="img-thumbnail float-start" style={{ width: '100px', height: '100px' }} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="row mb-4 border-bottom">
                <div className="col p-2 ps-4 mt-1">
                  <div className="txt-grey">Client Rating</div>
                  <StarRating disabled={true} initialRating={job?.feedback?.rating} />
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Feedback</div>
                  <div className="">{job?.feedback?.note}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card">
        <Loader isLoading={isVisitLoading} />
        <div className="row bg-grey m-2">
          <div className="col d-flex flex-row pt-3 pb-3">
            <h6 className="txt-bold mt-2">Visits</h6>
          </div>
          <table className="table txt-dark-grey">
            <thead>
              <tr className="rt-head">
                <th className=""></th>
                <th className="col-3">Visit Date</th>
                <th className="col-4">Instruction</th>
                <th className="col-4">Team</th>
                <th className=""></th>
              </tr>
            </thead>
            {Object.keys(visits).map((visitKey: string, index: number) => (
              <React.Fragment key={visitKey}>
                <thead key={index}>
                  <tr className="rt-head">
                    <th colSpan={7} scope="col" className={visitKey === 'completed' ? 'th-completed' : visitKey === 'overdue' ? 'th-overdue' : 'th-up-coming'}>
                      {visitKey}
                    </th>
                  </tr>
                </thead>
                <tbody className="rt-tbody">
                  {visits[visitKey].map((v: any, index: number) => (
                    <tr key={index} className="rt-tr-group cursor-pointer" onClick={() => setShowEventDetail(v)}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" id={v.visitMapId} checked={v.status.status === 'COMPLETED'} onChange={() => {}} />
                      </td>
                      <td>{DateTime.fromJSDate(v.startDate).toFormat('yyyy LLL dd')}</td>
                      <td>
                        <div>
                          <strong>{v.title}</strong>
                        </div>
                        <i>{v.instruction}</i>
                      </td>
                      <td>{v.team.map((t: any) => t.fullName).join(', ') || 'Not assigned yet'}</td>
                      <td className="d-flex float-end">
                        <div className="dropdown me-2" onClick={(e) => e.stopPropagation()}>
                          <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            <box-icon name="dots-vertical-rounded"></box-icon>
                          </span>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li onClick={() => setShowEventDetail(v)}>
                              <span className="dropdown-item pointer">
                                <EyeIcon /> View Detail
                              </span>
                            </li>

                            {v.status.status !== 'COMPLETED' && (currUser.role === 'ADMIN' || currUser.role === 'WORKER') ? (
                              <>
                                <li onClick={() => editVisit(v)}>
                                  <span className="dropdown-item pointer">
                                    <PencilIcon /> Edit
                                  </span>
                                </li>
                                <li onClick={() => handleDeleteVisitClick(v)}>
                                  <span className="dropdown-item pointer">
                                    <TrashIcon /> Delete
                                  </span>
                                </li>
                              </>
                            ) : null}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </div>
      </div>

      <div className="card">
        <h6 className="txt-bold">Other Information</h6>
        <small className="text-warning">
          <InfoIcon size={14} /> Add any other notes for this job or any relevant documents.
        </small>
        <div className="mb-3 mt-2">
          <label htmlFor="additional-doc" className="form-label">
            <strong>Notes:</strong>
          </label>
          <div className="txt-grey pt-2">
            {job?.notes ? (
              job?.notes
            ) : (
              <>
                <StopIcon size={16} /> Not notes added yet!.
              </>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="additional-doc" className="form-label">
            <strong>Files/Pictures:</strong>
          </label>
          <div className="mb-3 ps-1 d-flex flex-row justify-content-start">
            {job?.docs.map((doc: any, index: number) => (
              <div key={`~${index}`} className="mr-2 p-2">
                <a target="_blank" href={doc.url} rel="noreferrer">
                  <Image fileSrc={doc.url} className="rounded float-start" style={{ width: '150px', height: '150px' }} />
                </a>
              </div>
            ))}
            <div className="txt-grey pt-2">
              {job?.docs.length ? null : (
                <>
                  <StopIcon size={16} /> Not document added yet!.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals Section */}
      <Modal isOpen={!!editVisitMode} onRequestClose={() => setEditVisitMode(false)}>
        <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Visit</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditVisitMode(!editVisitMode)}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <FormikProvider value={visitEditForm}>
                <div className="modal-body">
                  <div className="row p-2">
                    <div className="col">
                      <div className="card mt-0 full-height">
                        <h6 className="txt-bold">Visit Details</h6>
                        <div className="col">
                          <div className="row">
                            <div className="col-12">
                              <InputField
                                label="Job Title"
                                type="text"
                                placeholder="Title"
                                name={`title`}
                                value={visitEditForm.values?.title}
                                onChange={visitEditForm.handleChange}
                              />
                            </div>
                            <div className="col-12">
                              <TextArea
                                label={'Job Instructions'}
                                name={`instruction`}
                                rows={4}
                                value={visitEditForm.values?.instruction}
                                onChange={visitEditForm.handleChange}
                                className={`form-control`}
                                placeholder={"Quote's description..."}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card mt-0 full-height">
                        <h6 className="txt-bold">Job Detail</h6>
                        <div className="row border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Job number</div>
                            <div className="row">
                              <div className="col txt-orange">
                                <strong>#{job?.refCode || 'XXXXX'}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Job type</div>
                            <div className="">{job?.type}</div>
                          </div>
                        </div>
                        <div className="row border-bottom">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Started on</div>
                            <div className="">{DateTime.fromISO(job?.startDate).toFormat('yyyy LLL dd')}</div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Lasts for</div>
                            <div className="">{job?.primaryVisit ? calculateJobDuration(job?.primaryVisit) : 'N/A'}</div>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Billing frequency</div>
                            <div className="">After every visit</div>
                          </div>
                          <div className="col p-2 ps-4">
                            <div className="txt-grey">Schedule</div>
                            {job && job?.primaryVisit?.rruleSet ? (
                              <div className="">{_.startCase(rrulestr(job?.primaryVisit?.rruleSet)?.toText())}</div>
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row p-1">
                    <div className="col card m-3">
                      <div className="row">
                        <div className="col">
                          <InputField
                            label="Start date"
                            type="date"
                            name={`startDate`}
                            onChange={visitEditForm.handleChange}
                            value={visitEditForm.values?.startDate}
                          />
                        </div>
                        <div className="col">
                          <InputField
                            label="End date"
                            name={`endDate`}
                            type="date"
                            onChange={visitEditForm.handleChange}
                            value={visitEditForm.values?.endDate}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col">
                          <InputField
                            label="Start time"
                            name="startTime"
                            type="time"
                            onChange={visitEditForm.handleChange}
                            value={visitEditForm.values?.startTime}
                          />
                        </div>
                        <div className="col">
                          <InputField label="End time" name="endTime" type="time" onChange={visitEditForm.handleChange} value={visitEditForm.values?.endTime} />
                        </div>
                      </div>
                    </div>
                    <div className="col card m-3">
                      <div className="row mb-2">
                        <div className="col d-flex flex-row">
                          <h6 className="txt-bold mt-1">Team</h6>
                        </div>
                      </div>
                      <div className="row">
                        <RecommendWorker
                          startTime={visitEditForm.values.startTime}
                          endTime={visitEditForm.values.endTime}
                          jobFor={job?.jobFor}
                          jobType={job?.jobType}
                          property={getJobAddress(job)}
                          selectedWorkers={visitEditForm.values.team}
                          handleWorkerSelection={handleWorkerSelection}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row p-2">
                    <div className="col">
                      <div className="card mt-0">
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

                        <FieldArray
                          name="lineItems"
                          render={(arrayHelpers) => (
                            <div className="row">
                              {visitEditForm.values?.lineItems?.map((lineItem: any, index: number) => (
                                <Fragment key={`~${index}`}>
                                  <div className="col-5">
                                    <SelectAsync
                                      name={`lineItem.name`}
                                      isDisabled={true}
                                      placeholder="Search line items"
                                      value={{ label: lineItem.name, value: lineItem._id }}
                                      resource={{ name: 'line-items', labelProp: 'name', valueProp: '_id' }}
                                      onChange={(selected: any) => handleLineItemSelection(`lineItems[${index}]`, selected)}
                                    />
                                    <textarea
                                      name={`lineItems[${index}].description`}
                                      value={visitEditForm.values?.lineItems[index].description}
                                      onChange={visitEditForm.handleChange}
                                      className={`form-control mb-2`}
                                      placeholder={"Line item's description..."}
                                      disabled={true}
                                    />
                                  </div>
                                  <div className="col">
                                    <InputField
                                      placeholder="Quantity"
                                      type="number"
                                      name={`lineItems[${index}].quantity`}
                                      value={lineItem.quantity}
                                      onChange={visitEditForm.handleChange}
                                      disabled={true}
                                    />
                                  </div>
                                  <div className="col">
                                    <InputField
                                      type="number"
                                      placeholder="Unit Price"
                                      name={`lineItems[${index}].unitPrice`}
                                      value={lineItem.unitPrice}
                                      onChange={visitEditForm.handleChange}
                                      disabled={true}
                                    />
                                  </div>
                                  <div className="col">
                                    <strong>{`$ ${lineItem.quantity * lineItem.unitPrice}`}</strong>
                                  </div>
                                  <div className="col-1 pointer text-center">
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
                                    {index !== 0 ? (
                                      <span onClick={() => arrayHelpers.remove(index)}>
                                        <XCircleIcon size={20} />
                                      </span>
                                    ) : null}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-secondary"
                    onClick={() => {
                      visitEditForm.values.team = visitEditForm.values.team.map((w: { value: string }) => w.value);
                      saveVisit(visitEditForm.values, true);
                    }}
                  >
                    Save and Update Future Visit
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      visitEditForm.values.team = visitEditForm.values.team.map((w: { value: string }) => w.value);
                      saveVisit(visitEditForm.values);
                    }}
                  >
                    Update this Visit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setEditVisitMode(!editVisitMode)}>
                    Close
                  </button>
                </div>
              </FormikProvider>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!showDeleteConfirmation} onRequestClose={() => setShowDeleteConfirmation(false)}>
        <DeleteConfirm content={'Are you sure you want to delete this visit?'} onDelete={deleteVisit} closeModal={() => setShowDeleteConfirmation(false)} />
      </Modal>

      <Modal
        isOpen={completeVisitMode && !!selectedVisit ? true : false}
        onRequestClose={() => {
          setSelectedVisit(null);
          setCompleteVisitMode(false);
        }}
      >
        <CompleteVisit
          completeVisit={completeVisitHandler}
          closeModal={() => {
            setSelectedVisit(null);
            setCompleteVisitMode(false);
          }}
          visit={selectedVisit}
        />
      </Modal>

      <Modal isOpen={askVisitInvoiceGeneration && !!completedVisit ? true : false} onRequestClose={() => setAskVisitInvoiceGeneration(false)}>
        <VisitCompletedActions visit={completedVisit} onClose={() => setAskVisitInvoiceGeneration(false)} cleanup={() => setCompletedVisit(null)} />
      </Modal>

      <Modal isOpen={!!showEventDetail} onRequestClose={() => setShowEventDetail(null)}>
        {!!showEventDetail ? (
          <VisitDetail markVisitCompleteHandler={markVisitCompleteHandler} event={showEventDetail} closeModal={() => setShowEventDetail(null)} />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isJobLoading: state.jobs.isLoading,
    job: state.jobs.job,
    jobVisits: state.visits.visits,
    isVisitLoading: state.visits.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJob: (id: string) => {
      dispatch(jobsActions.fetchJob(id, {}));
    },
    fetchVisits: (query: any) => {
      dispatch(visitsActions.fetchVisits(query));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientJobDetailData);
