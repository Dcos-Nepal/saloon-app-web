
import * as Yup from "yup";
import * as quotesActions from "store/actions/quotes.actions";

import { Fragment, useState } from "react";
import InputField from "common/components/form/Input";
import { FieldArray, FormikProvider, useFormik, getIn } from "formik";
import SelectAsync from "common/components/form/AsyncSelect";
import { PlusCircleIcon, StopIcon, XCircleIcon } from "@primer/octicons-react";
import TextArea from "common/components/form/TextArea";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "common/components/atoms/Loader";

const QuoteAddForm = (props: any) => {
  const navigate = useNavigate();
  const [clientDetails, setClientDetails] = useState(null);
  const initialValues = {
    name: '',
    description: '',
    note: '',
    quoteFor: '',
    jobRequest: '',
    lineItems: [{
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }]
  };

  const RequestSchema = Yup.object().shape({
    name: Yup.string()
      .required('Quote title is required')
      .min(3, 'Quote title seems to be too short'),
    description: Yup.string(),
    note: Yup.string(),
    quoteFor: Yup.object().shape({
      value: Yup.string().required('Client is required for this quote'),
      label: Yup.string()
    }),
    jobRequest: Yup.string().notRequired(),
    lineItems: Yup.array()
      .of(
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
      // Preparing the Object for saving
      const quotePayload = {...data};

      // making propertied compliant to Request payload
      quotePayload.title = data.name;
      quotePayload.quoteFor = data.quoteFor.value;
      quotePayload.lineItems = data.lineItems.map((li: any) => {
        return {
          name: li.name?.label,
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          total: li.quantity * li.unitPrice
        }
      });

      delete quotePayload.name;

      if (!quotePayload.jobRequest) {
        delete quotePayload.jobRequest;
      }
      
      return await props.actions.addQuote(quotePayload);
    },
  });

  /**
   * Handles Line Item selection
   * @param key 
   * @param selected 
   */
  const handleLineItemSelection = (key: string, {label, value, meta}: any) => {
    formik.setFieldValue(`${key}.name`, {label, value});
    formik.setFieldValue(`${key}.description`, meta?.description || 'Enter your notes here...');
  }

  /**
   * Handles Client selection
   */
  const handleClientSelection = ({label, value, meta}: any) => {
    formik.setFieldValue(`quoteFor`, {label, value});
    setClientDetails(meta)
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

    return ((touch && error) || error) ? (<>
      <div className="col-1" style={{width: '20px'}}><StopIcon size={14} /></div><div className="col">{error}</div>
    </>) : null;
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{position: 'relative'}}>
      <Loader isLoading={props.isLoading} />
      <FormikProvider value={formik}>
        <div className="row mb-3">
          <div className="col">
            <div className="card">
              <h6 className="txt-bold">Quote Details</h6>
              <div className="col">
                <div className="row">
                  <div className="col-12">
                    <InputField
                      label="Quote Title"
                      type="text"
                      placeholder="Title"
                      name={`name`}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      helperComponent={
                        formik.errors.name && formik.touched.name ? (
                          <div className="txt-red">{formik.errors.name}</div>
                        ) : null
                      }
                    />
                  </div>
                  <div className="col-12">
                    <TextArea
                      label={'Quote Description'}
                      name={`description`}
                      rows={4}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      className={`form-control`} placeholder={"Quote's description..."}
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <TextArea
                      label={'Quote Notes'}
                      name={`note`}
                      rows={3}
                      value={formik.values.note}
                      onChange={formik.handleChange}
                      className={`form-control`} placeholder={"Quote's note..."}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <h6 className="txt-bold">Client Details</h6>
              <SelectAsync
                name={`quoteFor`}
                label="Select Client"
                value={formik.values.quoteFor}
                resource={{ name: 'users', labelProp: 'firstName', valueProp: '_id', params: { roles: 'CLIENT' } }}
                onChange={handleClientSelection}
              />
              <div className="row text-danger mt-1 mb-2">
                <ErrorMessage name={`quoteFor.value`} />
              </div>
              {clientDetails ? (
                <div className="row bg-grey">
                  <div className="col p-2 ps-4">
                    <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
                    <div className="txt-bold">{(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}</div>
                    <div className="txt-grey">{(clientDetails as any)?.address?.street1}, {(clientDetails as any)?.address?.city}, {(clientDetails as any)?.address?.country}</div>
                  </div>
                </div>) : null }
              <div className="txt-bold mt-3 txt-grey">Client's Properties</div>
              <div className="row mb-2 border-bottom">
                <div className="col-1 p-2 pt-3 ps-4">
                  <input type="checkbox" value="123" />
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Woodland Wonder Manson</div>
                  <div className="">91 Woolnough Road, Tusmore, South Australia, 5065, Australia</div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-1 p-2 pt-3 ps-4">
                  <input type="checkbox" value="123" />
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Woodland Wonder Manson</div>
                  <div className="">91 Woolnough Road, Tusmore, South Australia, 5065, Australia</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h6 className="txt-bold">Line items</h6>
          <div className="row border-bottom">
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

          <div className="row border-bottom pb-3">
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
                            className={`form-control`} placeholder={"Line item's description..."}
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
                        <div className="col pt-4 mt-1 ps-1 text-center">
                          <strong>{`$ ${formik.values.lineItems[index].quantity * formik.values.lineItems[index].unitPrice}`}</strong>
                        </div>
                        <div className="col-1 pt-4 mt-1 ps-1 pointer text-center">
                          <span className="mr-2" onClick={() => arrayHelpers.push({
                            name: '',
                            description: '',
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

          <div className="row mb-3">
            <div className="col d-flex flex-row">
              <h6 className="txt-bold mt-2">Total</h6>
            </div>
            <div className="col txt-bold mt-2">
              <div className="d-flex float-end">$ 0.00</div>
            </div>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <button type="submit" className="btn btn-primary">
            Save Quote
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
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuoteAddForm);
