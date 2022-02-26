import _ from 'lodash';
import RRule, { Frequency, RRuleSet, rrulestr } from 'rrule';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react';

import Modal from 'common/components/atoms/Modal';
import * as jobsActions from 'store/actions/job.actions';
import * as visitsActions from 'store/actions/visit.actions';
import { addVisitApi, updateStatus, updateVisitApi, deleteVisitApi } from 'services/visits.service';
import { getData } from 'utils/storage';
import InputField from 'common/components/form/Input';
import TextArea from 'common/components/form/TextArea';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { InfoIcon, PlusCircleIcon, XCircleIcon } from '@primer/octicons-react';
import SelectAsync from 'common/components/form/AsyncSelect';
import { toast } from 'react-toastify';

interface IVisitList {
  overdue: any;
  completed: any;
  [key: string]: any;
}

const ClientJobDetailData = ({ id, actions, job, jobVisits }: any) => {
  const [visits, setVisits] = useState<IVisitList>({ overdue: [], completed: [] });
  const [editVisitMode, setEditVisitMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>();

  const mapVisits = (visitSettings: any[]) => {
    const mappedVisits = visitSettings.reduce((acc: any, visitSetting) => {
      const rruleSet = new RRuleSet();
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
          title: visitSetting.inheritJob ? job.title : visitSetting.title,
          instruction: visitSetting.inheritJob ? job.instruction : visitSetting.instruction,
          team: visitSetting.inheritJob ? job.team : visitSetting.team,
          lineItems: visitSetting.inheritJob ? job.lineItems : visitSetting.lineItems
        };
        if (acc[visitMonth]) acc[visitMonth].push(visitObj);
        else acc[visitMonth] = [visitObj];
        return true;
      });
      return acc;
    }, {});

    return mappedVisits;
  };

  const handleMarkAsCompleted = async (visitCompleted: boolean, visit: IVisitList) => {
    if (visit.hasMultiVisit) {
      const rrule = createOneOffRule({ ...visit, startDate: DateTime.fromJSDate(visit?.startDate).toFormat('yyyy-MM-dd') });

      let newVisit = { ...visit };
      delete newVisit._id;

      addVisitApi({
        ...newVisit,
        job: newVisit.job._id,
        inheritJob: false,
        rruleSet: rrule,
        status: {
          status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED',
          updatedBy: getData('user')._id
        },
        isPrimary: false,
        hasMultiVisit: false
      });

      updateVisitApi(visit._id, {
        excRrule: [...visit.excRrule, rrule]
      });
    } else {
      updateStatus(visit._id, { status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED' });
    }

    const newVisits: any = _.cloneDeep(visits);
    const updatedVisit = newVisits[visit.group].find((v: any) => v.visitMapId === visit.visitMapId);
    updatedVisit.status = { status: visitCompleted ? 'COMPLETED' : 'NOT-COMPLETED', updatedBy: getData('user')._id };
    setVisits(newVisits);
  };

  const editVisit = (visit: any) => {
    setEditVisitMode(true);
    setSelectedVisit(visit);
  };

  const visitEditForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      ..._.cloneDeep(selectedVisit),
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

  const saveVisit = async (visit: any, updateFollowing = false) => {
    const rrule = createOneOffRule(visit);
    if (visit.hasMultiVisit) {
      let newVisit = { ...visit, rruleSet: rrule };
      if (!updateFollowing) delete newVisit._id;

      addVisitApi(
        {
          ...newVisit,
          job: newVisit.job._id,
          inheritJob: false,
          rruleSet: rrule,
          isPrimary: false,
          excRrule: [],
          startDate: new Date(`${newVisit.startDate} ${newVisit.startTime}`),
          endDate: new Date(`${newVisit.endDate} ${newVisit.endTime}`),
          team: newVisit.team.map((t: any) => t._id),
          hasMultiVisit: updateFollowing
        },
        updateFollowing ? { updateFollowing } : null
      );

      if (!updateFollowing) {
        updateVisitApi(visit._id, {
          excRrule: [...visit.excRrule, rrule]
        });
      }
    } else {
      await updateVisitApi(
        visit._id,
        {
          ...visit,
          job: visit.job._id,
          rruleSet: rrule,
          team: visit.team.map((t: any) => t._id),
          startDate: new Date(`${visit.startDate} ${visit.startTime}`),
          endDate: new Date(`${visit.endDate} ${visit.endTime}`)
        },
        updateFollowing ? { updateFollowing } : null
      );
    }

    toast.success('Job Updated');
  };

  const createOneOffRule = (visit: any) => {
    return new RRule({
      dtstart: new Date(`${visit.startDate} ${visit.startTime}`),
      interval: 1,
      count: 1,
      freq: Frequency.DAILY
    }).toString();
  };

  const handleLineItemSelection = (key: string, { label, value, meta }: any) => {
    visitEditForm.setFieldValue(`${key}.name`, label);
    visitEditForm.setFieldValue(`${key}.description`, meta?.description || 'Enter your notes here...');
  };

  const handleDeleteVisitClick = (visit: any) => {
    setShowDeleteConfirmation(true);
    setSelectedVisit(visit);
  };

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

  useEffect(() => {
    if (!id) return;
    actions.fetchJob(id);
    actions.fetchVisits({ job: id });
  }, [id, actions]);

  useEffect(() => {
    if (!job || !jobVisits?.data?.rows?.length) return;
    const visits = mapVisits(jobVisits.data.rows);
    setVisits(visits);
  }, [jobVisits, job]);

  return (
    <div>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <div className="row">
              <div className="col">
                <h5 className="txt-bold">{job?.jobFor.fullName}</h5>
                <div>
                  <span className={`status status-green`}>Requires invoicing</span>
                </div>
              </div>
              <div className="col">
                <h4 className="txt-bold d-flex float-end mt-2">$80 cash</h4>
              </div>
            </div>
            <div className="row mt-3 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Property address</div>
                <div className="">
                  {job?.property.street1} {job?.property.country}
                </div>
              </div>
            </div>
            <div className="row mb-4 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Contact details</div>
                <div className="">{job?.jobFor.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Detail</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job number</div>
                <div className="row">
                  <div className="col">#13</div>
                  <div className="col txt-orange pointer">Change</div>
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
                <div className="">6 years</div>
              </div>
            </div>
            <div className="row border-bottom mb-3">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Billing frequency</div>
                <div className="">After every visit</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Schedule</div>
                {job && <div className="">{_.startCase(rrulestr(job?.primaryVisit.rruleSet).toText())}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h6 className="txt-bold">Line items</h6>
        <div className="row border-bottom p-3">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">SN</th>
                <th scope="col">PRODUCT / SERVICE</th>
                <th scope="col">QTY</th>
                <th scope="col">UNIT PRICE</th>
                <th scope="col">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {job?.lineItems.map((item: any, index: number) => (
                <tr key={index}>
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

      <div className="card">
        <div className="row bg-grey m-2">
          <div className="col d-flex flex-row pt-3 pb-3">
            <h6 className="txt-bold mt-2">Visits</h6>
          </div>
          <div className="col pt-3 pb-3">
            <button onClick={() => {}} type="button" className="btn btn-primary d-flex float-end">
              New visit
            </button>
          </div>
          <table className="table txt-dark-grey">
            <thead>
              <tr className="rt-head">
                <th scope="col"></th>
                <th scope="col">Visit Date</th>
                <th scope="col">Instruction</th>
                <th scope="col">Team</th>
                <th scope="col"></th>
              </tr>
            </thead>
            {Object.keys(visits).map((visitKey: string, index: number) => (
              <React.Fragment key={visitKey}>
                <thead key={index}>
                  <tr className="rt-head">
                    <th colSpan={7} scope="col" className="th-overdue">
                      {visitKey}
                    </th>
                  </tr>
                </thead>

                <tbody className="rt-tbody">
                  {visits[visitKey].map((v: any, index: number) => (
                    <tr key={index} className="rt-tr-group">
                      <td>
                        <input
                          type="checkbox"
                          id={v.visitMapId}
                          checked={v.status.status === 'COMPLETED'}
                          onChange={(e) => handleMarkAsCompleted(e.target.checked, v)}
                        />
                      </td>
                      <td>{DateTime.fromJSDate(v.startDate).toFormat('yyyy LLL dd')}</td>
                      <td>{v.instruction}</td>
                      <td>{v.team.map((t: any) => t.fullName).join(', ')}</td>
                      <td>
                        <div className="dropdown">
                          <span role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            <box-icon name="dots-vertical-rounded"></box-icon>
                          </span>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li onClick={() => console.log(v)}>
                              <span className="dropdown-item pointer">View Detail</span>
                            </li>
                            <li onClick={() => editVisit(v)}>
                              <span className="dropdown-item pointer">Edit</span>
                            </li>
                            <li onClick={() => handleDeleteVisitClick(v)}>
                              <span className="dropdown-item pointer">Delete</span>
                            </li>
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

      <Modal isOpen={editVisitMode} onRequestClose={() => setEditVisitMode(false)}>
        <div className="modal-object--md">
          <form onSubmit={visitEditForm.handleSubmit} style={{ position: 'relative' }}>
            <FormikProvider value={visitEditForm}>
              <div className="modal-object--md">
                <div className="row p-2">
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
                    <div className="card">
                      <h6 className="txt-bold">Job Detail</h6>
                      <div className="row border-bottom">
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">Job number</div>
                          <div className="row">
                            <div className="col">#13</div>
                            <div className="col txt-orange pointer">Change</div>
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
                          <div className="">6 years</div>
                        </div>
                      </div>
                      <div className="row border-bottom mb-3">
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">Billing frequency</div>
                          <div className="">After every visit</div>
                        </div>
                        <div className="col p-2 ps-4">
                          <div className="txt-grey">Schedule</div>
                          {job && <div className="">{_.startCase(rrulestr(job?.primaryVisit.rruleSet).toText())}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col card m-4">
                    <div className="mb-3">
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
                    </div>

                    <div className="mb-3">
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

                    <div className="mb-3">
                      <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                      <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                        Schedule later
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row p-2">
                  <div className="col-9">
                    <div className="card">
                      <div className="row">
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
                                    />
                                  </div>
                                  <div className="col">
                                    <InputField
                                      placeholder="Quantity"
                                      type="number"
                                      name={`lineItems[${index}].quantity`}
                                      value={lineItem.quantity}
                                      onChange={visitEditForm.handleChange}
                                    />
                                  </div>
                                  <div className="col">
                                    <InputField
                                      type="number"
                                      placeholder="Unit Price"
                                      name={`lineItems[${index}].unitPrice`}
                                      value={lineItem.unitPrice}
                                      onChange={visitEditForm.handleChange}
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
                                    &nbsp;&nbsp;
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
              </div>

              <div className="mb-3 mt-3">
                <button type="submit" className="btn btn-primary pr-3" onClick={() => saveVisit(visitEditForm.values, true)}>
                  Save and Update Future Visit
                </button>{' '}
                <button type="submit" className="btn btn-primary" onClick={() => saveVisit(visitEditForm.values)}>
                  Save
                </button>
              </div>
            </FormikProvider>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showDeleteConfirmation} onRequestClose={() => setShowDeleteConfirmation(false)}>
        <div className="modal-object">
          <div className="modal-header row bg-background-grey">
            <h5 className="col-10">Are you sure you want to delete this visit?</h5>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={deleteVisit}>
              Delete
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.jobs.isLoading,
    job: state.jobs.job,
    jobVisits: state.visits.visits
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
