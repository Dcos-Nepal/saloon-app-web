import { InfoIcon, PlusCircleIcon, XCircleIcon } from '@primer/octicons-react';
import SelectAsync from 'common/components/form/AsyncSelect';
import InputField from 'common/components/form/Input';
import TextArea from 'common/components/form/TextArea';
import ReactRRuleGenerator, { translations } from 'common/components/rrule-form';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as jobsActions from '../../../store/actions/job.actions';

interface IProps {
  isLoading: boolean;
  job: any;
  jobUpdated: () => void;
  actions: { updateJob: (id: string, payload: any) => Promise<void> };
}

const EditJobForm = (props: IProps) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getTranslation = () => {
    switch ('en') {
      case 'en':
        return translations.english;
      default:
        return translations.english;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.job,
    validateOnChange: true,
    onSubmit: async (job) => {
      const updatePayload = {
        ...job,
        lineItems: job.lineItems.map((lineItem: any) => ({ ...lineItem, name: lineItem.name.label })),
        team: job.team.map((t: any) => t.value)
      };
      delete updatePayload.jobFor;
      await props.actions.updateJob(id as string, updatePayload);
      props.jobUpdated();
    }
  });

  /**
   * Handles RRule
   * @param newRRule
   */
  const handleRecurringChange = (newRRule: any) => {
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

  const handleWorkerSelection = (selected: any[]) => {
    formik.setFieldValue(
      `team`,
      selected.map((worker) => ({ label: worker.label, value: worker.value }))
    );
  };

  /**
   * Handles Line Item selection
   * @param key
   * @param selected
   */
  const handleLineItemSelection = (key: string, { label, value, meta }: any) => {
    formik.setFieldValue(`${key}.name`, { label, value });
    formik.setFieldValue(`${key}.description`, meta?.description || 'Enter your notes here...');
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
      <FormikProvider value={formik}>
        <div className="row">
          <div className="col pb-3">
            <div className="card full-height">
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
                    <TextArea
                      label={'Job Instructions'}
                      name={`instruction`}
                      rows={4}
                      value={formik.values.instruction}
                      onChange={formik.handleChange}
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
                <div className="p-2 ps-4">
                  <div className="txt-grey">Job number</div>
                  <div className="row">
                    <div className="col">#13</div>
                    <div className="txt-orange pointer">Change</div>
                  </div>
                </div>
                <div className="p-2 ps-4">
                  <div className="txt-grey">Job type</div>
                  <div className="">{formik.values.type}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="row">
            {formik.values.type === 'ONE-OFF' ? (
              <div className="col card m-4">
                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <InputField
                        label="Start date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('oneOff.startDate', e.target.value)}
                        value={formik.values.oneOff.startDate}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('oneOff.endDate', e.target.value)}
                        value={formik.values.oneOff.endDate}
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
                        value={formik.values.oneOff.startTime}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End time"
                        type="time"
                        onChange={(e: any) => formik.setFieldValue('oneOff.endTime', e.target.value)}
                        value={formik.values.oneOff.endTime}
                      />
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
            ) : null}
            {formik.values.type === 'RECURRING' ? (
              <div className="col-6 my-3 mx-2">
                <ReactRRuleGenerator
                  onChange={handleRecurringChange}
                  value={formik.values.schedule.rruleSet}
                  config={{ hideStart: false }}
                  translations={getTranslation()}
                />
                <div className="col-12 mt-3">
                  <small>{formik.values.schedule.rruleSet}</small>
                </div>
              </div>
            ) : null}
            <div className="col card m-3">
              <div className="row mb-3">
                <div className="col d-flex flex-row">
                  <h6 className="txt-bold mt-2">Team</h6>
                </div>
              </div>
              <div className="row">
                <SelectAsync
                  name={`team`}
                  label="Select Workers"
                  value={formik.values.team}
                  resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
                  onChange={handleWorkerSelection}
                  isMulti={true}
                  closeOnSelect={true}
                />
                <div className="row text-danger mt-1 mb-2">{/* <ErrorMessage name={`team`} /> */}</div>
              </div>

              <div className="mt-3">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                  Email team about assignment
                </label>
                <div>
                  <small>
                    <InfoIcon size={14} /> If you select Email, each team members will receive email notification.
                  </small>
                </div>
              </div>
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
                          <SelectAsync
                            name={`lineItems[${index}].name`}
                            placeholder="Search line items"
                            value={formik.values.lineItems[index].name}
                            resource={{ name: 'line-items', labelProp: 'name', valueProp: '_id' }}
                            onChange={(selected: any) => handleLineItemSelection(`lineItems[${index}]`, selected)}
                          />
                          <div className="row text-danger mt-1 mb-2">{/* <ErrorMessage name={`lineItems[${index}].name.label`} /> */}</div>
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

        <div className="mb-3 mt-3">
          <button type="submit" className="btn btn-primary">
            Update Job
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
  return {};
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    updateJob: async (id: string, payload: any) => {
      dispatch(jobsActions.updateJob(id, payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditJobForm);
