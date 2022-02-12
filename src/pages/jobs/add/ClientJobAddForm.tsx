import RRule from 'rrule';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Column, Row, useTable } from 'react-table';
import * as quotesActions from 'store/actions/quotes.actions';
import { FieldArray, FormikProvider, useFormik, getIn } from 'formik';

import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import { connect } from 'react-redux';
import { ClassAttributes, Fragment, HTMLAttributes, ReactChild, ReactFragment, ReactPortal, ThHTMLAttributes, TdHTMLAttributes, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectAsync from 'common/components/form/AsyncSelect';
import { InfoIcon, PlusCircleIcon, StopIcon, XCircleIcon } from '@primer/octicons-react';
import TextArea from 'common/components/form/TextArea';
import { fetchUserProperties } from 'services/common.service';
import ReactRRuleGenerator, { translations } from 'common/components/rrule-form';

const ClientJobAddForm = (props: any) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [clientDetails, setClientDetails] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<Array<any>>([]);
  const [rruleStr, setRruleStr] = useState('DTSTART:20220114T035500Z RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=1;UNTIL=20220127T050300Z');
  const [activeTab, setActiveTab] = useState('ONE-OFF');
  const getTranslation = () => {
    switch ('en') {
      case 'en':
        return translations.english;
      default:
        return translations.english;
    }
  };

  const initialValues = {
    title: '',
    instruction: '',
    jobFor: '',
    type: activeTab,
    team: [],
    lineItems: [
      {
        name: { label: '', value: '' },
        description: '',
        quantity: 0,
        unitPrice: 0,
        total: 0
      }
    ],
    schedule: { rruleSet: '', startDate: '', startTime: '', endDate: '', endTime: '' }
  };

  const RequestSchema = Yup.object().shape({
    title: Yup.string().required('Job title is required').min(3, 'Job title seems to be too short'),
    instruction: Yup.string(),
    jobFor: Yup.string().required('Job for is required'),
    jobRequest: Yup.string().notRequired(),
    lineItems: Yup.array().of(
      Yup.object().shape({
        name: Yup.object().shape({
          value: Yup.string(),
          label: Yup.string().required('Please select a line item.')
        }),
        description: Yup.string(),
        quantity: Yup.number(),
        unitPrice: Yup.number(),
        total: Yup.number().notRequired()
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RequestSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      console.log(data);
    }
  });

  /**
   * Handles Line Item selection
   * @param key
   * @param selected
   */
  const handleLineItemSelection = (key: string, { label, value, meta }: any) => {
    formik.setFieldValue(`${key}.name`, { label, value });
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
    formik.setFieldValue('schedule.rruleSet', newRRule.rrule.toString());
  };

  useEffect(() => {
    if (!formik.values.schedule.startDate) return;
    let rule: any = {
      dtstart: new Date(`${formik.values.schedule.startDate} ${formik.values.schedule.startTime}`),
      interval: 1,
      freq: 'Daily'
    };
    if (formik.values.schedule.endDate) rule.until = new Date(`${formik.values.schedule.endDate} ${formik.values.schedule.endTime}`);
    const rrule = new RRule(rule);
    formik.setFieldValue('schedule.rruleSet', rrule.toString());
  }, [formik.values.schedule]);

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

  const columns: Column<any>[] = useMemo(() => [], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: [] });

  return (
    <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
      <Loader isLoading={props.isLoading} />
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
          <div className="col pb-3">
            <div className="card full-height">
              <h6 className="txt-bold">Client Details</h6>
              <SelectAsync
                name={`jobFor`}
                label="Select Client"
                value={formik.values.jobFor}
                resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'CLIENT' } }}
                onChange={handleClientSelection}
              />
              <div className="row text-danger mt-1 mb-2">
                <ErrorMessage name={`jobFor.value`} />
              </div>
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
              {properties.map((property: any) => (
                <div className="row mb-2 border-bottom" key={property._id}>
                  <div className="col-1 p-2 pt-3 ps-4">
                    <input name="property" type="checkbox" value={property._id} />
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">{property.name}</div>
                    <div className="">
                      {property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="row m-2">
            <div className="col">
              <div
                className={`row pt-4 cursor-pointer ${activeTab === 'ONE-OFF' ? 'border-top-orange' : 'bg-light-grey border-top-grey'}`}
                onClick={() => setActiveTab('ONE-OFF')}
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
                className={`row pt-4 cursor-pointer ${activeTab === 'Recurring' ? 'border-top-orange' : 'bg-light-grey border-top-grey'}`}
                onClick={() => setActiveTab('Recurring')}
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
              <div className="col card m-4">
                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <InputField
                        label="Start date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('schedule.startDate', e.target.value)}
                        value={formik.values.schedule.startDate}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End date"
                        type="date"
                        onChange={(e: any) => formik.setFieldValue('schedule.endDate', e.target.value)}
                        value={formik.values.schedule.endDate}
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
                        onChange={(e: any) => formik.setFieldValue('schedule.startTime', e.target.value)}
                        value={formik.values.schedule.startTime}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="End time"
                        type="time"
                        onChange={(e: any) => formik.setFieldValue('schedule.endTime', e.target.value)}
                        value={formik.values.schedule.endTime}
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
            {activeTab === 'Recurring' ? (
              <div className="col-6 my-3 mx-2">
                <ReactRRuleGenerator
                  onChange={handleRecurringChange as any}
                  value={rruleStr}
                  config={
                    {
                      hideStart: false
                    } as any
                  }
                  translations={getTranslation() as any}
                />
                <div className="col-12 mt-3">
                  <small>{rruleStr}</small>
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
                  value={selectedTeam}
                  resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'WORKER' } }}
                  onChange={handleWorkerSelection}
                  isMulti={true}
                  closeOnSelect={true}
                />
                <div className="row text-danger mt-1 mb-2">
                  <ErrorMessage name={`team`} />
                </div>
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
                            // value={formik.values.lineItems[index].name}
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
                <h5 className="txt-bold mt-2">$ {formik.values.lineItems.reduce((current, next) => (current += next.quantity * next.unitPrice), 0)}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="row bg-grey m-2 p-3">
            <div className="col d-flex flex-row">
              <h6 className="txt-bold mt-2">Visits</h6>
            </div>
            <div className="col">
              <button onClick={() => {}} type="button" className="btn btn-primary d-flex float-end">
                New visit
              </button>
            </div>
          </div>

          <table {...getTableProps()} className="table txt-dark-grey">
            <thead>
              {headerGroups.map(
                (headerGroup: {
                  getHeaderGroupProps: () => JSX.IntrinsicAttributes & ClassAttributes<HTMLTableRowElement> & HTMLAttributes<HTMLTableRowElement>;
                  headers: any[];
                }) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="rt-head">
                    {headerGroup.headers.map(
                      (column: {
                        getHeaderProps: () => JSX.IntrinsicAttributes &
                          ClassAttributes<HTMLTableHeaderCellElement> &
                          ThHTMLAttributes<HTMLTableHeaderCellElement>;
                        render: (arg0: string) => boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
                      }) => (
                        <th {...column.getHeaderProps()} scope="col">
                          {column.render('Header')}
                        </th>
                      )
                    )}
                  </tr>
                )
              )}
            </thead>

            <tbody {...getTableBodyProps()} className="rt-tbody">
              {rows.map((row: Row<any>) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()} className="rt-tr-group">
                    {row.cells.map(
                      (cell: {
                        getCellProps: () => JSX.IntrinsicAttributes & ClassAttributes<HTMLTableDataCellElement> & TdHTMLAttributes<HTMLTableDataCellElement>;
                        render: (arg0: string) => boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
                      }) => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mb-3 mt-3">
          <button type="submit" className="btn btn-primary">
            Save Job
          </button>
          <button onClick={() => {}} type="button" className="btn btn-secondary ms-3">
            Save and create another
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
    isLoading: state.quotes.isLoading
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addQuote: (payload: any) => {
      dispatch(quotesActions.createQuotes(payload));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientJobAddForm);
