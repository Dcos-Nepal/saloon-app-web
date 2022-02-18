import * as Yup from "yup";
import * as invoicesActions from "store/actions/invoices.actions";

import { FC, Fragment, useEffect, useState } from "react";
import { FieldArray, FormikProvider, useFormik, getIn } from "formik";
import { PlusCircleIcon, StopIcon, XCircleIcon } from "@primer/octicons-react";

import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "common/components/atoms/Loader";
import { fetchJobVisits, fetchUserProperties } from "services/common.service";

import InputField from "common/components/form/Input";
import SelectAsync from "common/components/form/AsyncSelect";
import TextArea from "common/components/form/TextArea";
import SelectField from "common/components/form/Select";

interface IProps {
  id: string;
  actions: {
    addInvoice: (id: string) => void;
    fetchInvoice: (id: string) => void;
    updateInvoice: (id: string, data: any) => void;
  };
  isLoading: boolean;
  currentItem: any;
}

const InvoiceAddForm: FC<IProps> = ({ id, isLoading, currentItem, actions }) => {
  const navigate = useNavigate();

  const [clientDetails, setClientDetails] = useState<any>(null);
  const [properties, setProperties] = useState([]);
  const [visits, setVisits] = useState([]);

  const [initialValues, setInitialValues] = useState({
    subject: '',
    clientMessage: '',
    note: '',
    invoiceFor: {
      label: 'Search for Clients...',
      value: ''
    },
    refJob: {
      label: 'Search for Clients...',
      value: ''
    },
    refVisit: {
      label: 'Search for Clients...',
      value: ''
    },
    property: '',
    lineItems: [{
      name: {
        label: 'Search for Services',
        value: ''
      },
      clientMessage: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }]
  });

  const RequestSchema = Yup.object().shape({
    subject: Yup.string()
      .required('Invoice subject is required')
      .min(3, 'Invoice subject seems to be too short'),
    clientMessage: Yup.string(),
    note: Yup.string().notRequired(),
    invoiceFor: Yup.object().shape({
      value: Yup.string().required('Client is required for this invoice'),
      label: Yup.string()
    }),
    property: Yup.string().notRequired(),
    jobRequest: Yup.string().notRequired(),
    lineItems: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.object().shape({
            value: Yup.string(),
            label: Yup.string().required('Please select a line item.')
          }),
          clientMessage: Yup.string(),
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
      // Preparing the Object for saving
      const invoicePayload = { ...data };

      // making propertied compliant to Request payload
      invoicePayload.subject = data.subject;
      invoicePayload.invoiceFor = data.invoiceFor.value;
      invoicePayload.lineItems = data.lineItems.map((li: any) => {
        return {
          ref: li.name.value,
          name: li.name.label,
          clientMessage: li.clientMessage,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          total: li.quantity * li.unitPrice
        }
      });

      if (!invoicePayload.jobRequest) {
        delete invoicePayload.jobRequest;
      }

      // Dispatch action to create Job Invoice
      await id ? actions.updateInvoice(id, invoicePayload) : actions.addInvoice(invoicePayload);
    },
  });

  useEffect(() => {
    if (id) return actions.fetchInvoice(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentItem && id) {
      setInitialValues({
        ...initialValues,
        subject: currentItem?.subject,
        clientMessage: currentItem?.clientMessage,
        property: currentItem?.property?._id,
        invoiceFor: {
          label: currentItem?.invoiceFor?.firstName,
          value: currentItem?.invoiceFor?._id,
        },
        lineItems: currentItem?.lineItems?.map((item: { name: any; ref: any; }) => {
          return {
            ...item,
            name: {
              label: item.name,
              value: item.ref
            }
          }
        })
      });

      setClientDetails(currentItem?.invoiceFor);
      fetchUserProperties(currentItem?.invoiceFor._id).then((response) => {
        setProperties(response.data?.data?.data?.rows || []);
      });
    }
  }, [id, currentItem]);

  /**
   * Handles Line Item selection
   * @param key 
   * @param selected 
   */
  const handleLineItemSelection = (key: string, { label, value, meta }: any) => {
    formik.setFieldValue(`${key}.name`, { label, value });
    formik.setFieldValue(`${key}.clientMessage`, meta?.clientMessage || 'Enter your notes here...');
  }

  /**
   * Handles Client selection
   */
  const handleClientSelection = async ({ label, value, meta }: any) => {
    formik.setFieldValue(`invoiceFor`, { label, value });
    setClientDetails(meta);

    const response = await fetchUserProperties(value);
    setProperties(response.data?.data?.data?.rows || []);

    // Clear ref fields
    formik.setFieldValue(`refJob`, null);
    formik.setFieldValue(`refVisit`, null);
  }

  /**
   * Handles Job selection
   */
  const handleJobSelection = async ({ label, value }: any) => {
    formik.setFieldValue(`refJob`, { label, value });

    const response = await fetchJobVisits(value);
    setVisits(response.data?.data?.data?.rows.map((visit: any) => ({ label: visit.title, value: visit.id})) || []);
  }

  /**
   * Handles Job selection
   */
  const handleVisitSelection = async ({ label, value }: any) => {
    formik.setFieldValue(`refVisit`, { label, value });
  }

  /**
   * Custom Error Message
   * 
   * @param param Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ name }: any) => {
    if (!name) return (<></>);

    const error = getIn(formik.errors, name);
    const touch = getIn(formik.touched, name);

    return ((touch && error) || error) ? (<div className="row text-danger mt-1 mb-2">
      <div className="col-1" style={{ width: '20px' }}><StopIcon size={14} /></div><div className="col">{error}</div>
    </div>) : null;
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
      <Loader isLoading={isLoading} />
      <FormikProvider value={formik}>
        <div className="row mb-3">
          <div className="col pb-3">
            <div className="card" style={{ "height": "100%" }}>
              <h6 className="txt-bold">Invoice Details</h6>
              <div className="col">
                <div className="row">
                  <div className="col-12">
                    <InputField
                      label="Invoice Subject"
                      type="text"
                      placeholder="Subject"
                      name={`subject`}
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      helperComponent={
                        formik.errors.subject && formik.touched.subject ? (
                          <div className="txt-red">{formik.errors.subject}</div>
                        ) : null
                      }
                    />
                  </div>
                  <div className="col-12">
                    <TextArea
                      label={'Invoice Message'}
                      name={`clientMessage`}
                      rows={4}
                      value={formik.values.clientMessage}
                      onChange={formik.handleChange}
                      className={`form-control`} placeholder={"Invoice's clientMessage..."}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col pb-3">
            <div className="card" style={{ "height": "100%" }}>
              <h6 className="txt-bold">Client Details</h6>
              <SelectAsync
                name={`invoiceFor`}
                label="Select Client"
                value={formik.values.invoiceFor}
                resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: { roles: 'CLIENT' } }}
                onChange={handleClientSelection}
              />
              <ErrorMessage name={`invoiceFor.value`} />
              {clientDetails ? (
                <div className="row bg-grey m-0">
                  <div className="col p-2 ps-4">
                    <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
                    <div className="txt-bold">{(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}</div>
                    <div className="txt-grey">{(clientDetails as any)?.address?.street1}, {(clientDetails as any)?.address?.city}, {(clientDetails as any)?.address?.country}</div>
                  </div>
                </div>) : null}
              <div className="txt-bold mt-3 txt-grey">Client's Properties</div>
              {!properties.length ? <div className="txt-orange"><StopIcon size={16} /> There are no properties assigned to the client.</div> : null}
              {properties.map((property: any) => {
                return (<div key={property._id} className="row mb-2 border-bottom">
                  <div className="col-1 p-2 pt-3 ps-4">
                    <input name="property" type="radio" value={property._id} onChange={formik.handleChange} checked={property._id === formik.values.property} />
                  </div>
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">{property.name}</div>
                    <div className="">{property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}</div>
                  </div>
                </div>)
              })}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card" style={{ "height": "100%" }}>
            <h6 className="txt-bold">Job/Visit Details</h6>
            <div className="row pb-3">
              <div className="col ps-3">
                <SelectAsync
                  name={`refJob`}
                  label="Search Jobs"
                  value={formik.values.refJob}
                  resource={{ name: 'jobs', labelProp: 'title', valueProp: '_id', params: { jobFor: clientDetails?.id || ''} }}
                  onChange={handleJobSelection}
                />
                <ErrorMessage name={`refJob.value`} />
              </div>

              <div className="col ps-3">
                <SelectField
                  name={`refVisit`}
                  label="Select Job's Visit"
                  options={visits}
                  value={formik.values.refVisit}
                  onChange={handleVisitSelection}
                />
                <ErrorMessage name={`refVisit.value`} />
              </div>
            </div> 
          </div>
        </div>

        <div className="card">
          <h6 className="txt-bold">Line items</h6>
          <div className="row">
            <div className="col-5 p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">
                PRODUCT / SERVICE
              </div>
            </div>
            <div className="col p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">QTY.</div>
            </div>
            <div className="col p-2 ps-3">
              <div className="bg-light-grey txt-grey p-2 txt-bold">
                UNIT PRICE
              </div>
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
                            isDisabled={true}
                            name={`lineItems[${index}].name`}
                            placeholder="Search line items"
                            value={formik.values.lineItems[index].name}
                            resource={{ name: 'line-items', labelProp: 'name', valueProp: '_id' }}
                            onChange={(selected: any) => handleLineItemSelection(`lineItems[${index}]`, selected)}
                          />
                          <ErrorMessage name={`lineItems[${index}].name.label`} />
                          <textarea
                            name={`lineItems[${index}].clientMessage`}
                            value={formik.values.lineItems[index].clientMessage}
                            disabled={true}
                            onChange={formik.handleChange}
                            className={`form-control mb-3`} placeholder={"Line item's clientMessage..."}
                          />
                        </div>
                        <div className="col">
                          <InputField
                            placeholder="Quantity"
                            type="number"
                            disabled={true}
                            name={`lineItems[${index}].quantity`}
                            value={formik.values.lineItems[index].quantity}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col">
                          <InputField
                            type="number"
                            disabled={true}
                            placeholder="Unit Price"
                            name={`lineItems[${index}].unitPrice`}
                            value={formik.values.lineItems[index].unitPrice}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="col mt-3 ps-1 text-center">
                          <strong>{`$ ${formik.values.lineItems[index].quantity * formik.values.lineItems[index].unitPrice}`}</strong>
                        </div>
                        <div className="col-1 mt-3 ps-1 pointer text-center">
                          <span className="mr-2" onClick={() => arrayHelpers.push({
                            name: {
                              label: '',
                              value: ''
                            },
                            clientMessage: '',
                            quantity: 0,
                            unitPrice: 0,
                            total: 0
                          })}>
                            <PlusCircleIcon size={20} />
                          </span>
                          &nbsp;&nbsp;
                          {(index !== 0) ? (<span onClick={() => arrayHelpers.remove(index)}>
                            <XCircleIcon size={20} />
                          </span>) : null}
                        </div>
                      </div>
                    </Fragment>)
                  )}
                </div>
              )}
            />
          </div>

          <div className="row border-top">
            <div className="col d-flex flex-row mt-3">
              <h6 className="txt-bold mt-2">Invoice Total</h6>
            </div>
            <div className="col txt-bold mt-3">
              <div className="d-flex float-end">
                <h5 className="txt-bold mt-2">$ {formik.values?.lineItems?.length ? (formik.values?.lineItems.reduce((current, next) => (current += next.quantity * next.unitPrice), 0)) : 0}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <button type="submit" className="btn btn-primary">
            {id ? 'Update' : 'Save'} Invoice
          </button>
          <button onClick={() => navigate(-1)} type="button" className="btn ms-3 btn-secondary">
            Cancel
          </button>
        </div>
      </FormikProvider>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.invoices.isLoading,
    currentItem: state.invoices.currentItem
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addInvoice: (payload: any) => {
      dispatch(invoicesActions.createInvoices(payload));
    },
    updateInvoice: (id: string, data: any) => {
      dispatch(invoicesActions.updateInvoice(id, data));
    },
    fetchInvoice: (id: string) => {
      dispatch(invoicesActions.fetchInvoice(id, {}));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceAddForm);
