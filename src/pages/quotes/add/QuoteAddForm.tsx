import * as Yup from 'yup';
import * as quotesActions from 'store/actions/quotes.actions';

import { FC, Fragment, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, useFormik, getIn } from 'formik';
import { PlusCircleIcon, StopIcon, XCircleIcon } from '@primer/octicons-react';

import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'common/components/atoms/Loader';
import { fetchUserProperties } from 'services/common.service';

import InputField from 'common/components/form/Input';
import SelectAsync from 'common/components/form/AsyncSelect';
import TextArea from 'common/components/form/TextArea';
import AsyncInputDataList from 'common/components/form/AsyncInputDataList';
import { getPropertyAddress } from 'utils';
import { getData } from 'utils/storage';

interface IProps {
  id: string;
  actions: {
    addQuote: (id: string) => void;
    fetchQuote: (id: string) => void;
    updateQuote: (id: string, data: any) => void;
  };
  isLoading: boolean;
  currentItem: any;
}

const QuoteAddForm: FC<IProps> = ({ id, isLoading, currentItem, actions }) => {
  const navigate = useNavigate();
  const currentUser = getData('user');
  const isWorker = currentUser?.userData?.type === 'WORKER';

  const [clientDetails, setClientDetails] = useState(null);
  const [properties, setProperties] = useState([]);

  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    note: '',
    quoteFor: {
      label: 'Search for Clients...',
      value: ''
    },
    property: '',
    jobRequest: '',
    lineItems: [
      {
        name: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
        total: 0
      }
    ]
  });

  const QuoteSchema = Yup.object().shape({
    title: Yup.string().required('Quote title is required').min(3, 'Quote title seems to be too short'),
    description: Yup.string(),
    note: Yup.string().notRequired(),
    quoteFor: Yup.object().shape({
      value: Yup.string().required('Client is required for this quote'),
      label: Yup.string()
    }),
    property: Yup.string().notRequired().nullable(),
    jobRequest: Yup.string().notRequired(),
    lineItems: Yup.array().of(
      Yup.object().shape({
        name: Yup.object().shape({
          value: Yup.string(),
          label: Yup.string().required('Please select a line item.')
        }).nullable(),
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
    validationSchema: QuoteSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      // Preparing the Object for saving
      const quotePayload = { ...data };

      // Making properties compliant to Request payload
      quotePayload.title = data.title;
      quotePayload.quoteFor = data.quoteFor.value;
      quotePayload.property = data.property ? data.property : null;
      quotePayload.lineItems = data.lineItems.map((li: any) => {
        return {
          ref: li.name.value,
          name: li.name.label,
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          total: li.quantity * li.unitPrice
        };
      });

      if (!quotePayload.jobRequest) {
        delete quotePayload.jobRequest;
      }

      // Dispatch action to create Job Quote
      if (id) {
        await actions.updateQuote(id, quotePayload);
      } else {
        await actions.addQuote(quotePayload);

        // Reset form
        formik.resetForm();
        setProperties([]);
        setClientDetails(null);
      }

      // Navigate to the previous screen
      navigate(-1);
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
    formik.setFieldValue(`quoteFor`, { label, value });
    setClientDetails(meta);

    const response = await fetchUserProperties(value);
    setProperties(response.data?.data?.data?.rows || []);
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
      <div className="row text-danger mt-1 mb-2">
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  useEffect(() => {
    if (id) return actions.fetchQuote(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentItem && id) {
      setInitialValues({
        ...initialValues,
        title: currentItem?.title,
        description: currentItem?.description,
        property: currentItem?.property?._id,
        quoteFor: {
          label: currentItem?.quoteFor?.firstName,
          value: currentItem?.quoteFor?._id
        },
        lineItems: currentItem?.lineItems?.map((item: { name: any; ref: any }) => {
          return {
            ...item,
            name: {
              value: item.name,
              label: item.name
            },
          };
        })
      });

      setClientDetails(currentItem?.quoteFor);
      fetchUserProperties(currentItem?.quoteFor._id).then((response) => {
        setProperties(response.data?.data?.data?.rows || []);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentItem]);

  return (
    <>
      {id ? <div className="txt-orange">Ref. #{currentItem?.refCode || 'XXXXX'}</div> : null}
      <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
        <Loader isLoading={isLoading} />
        <FormikProvider value={formik}>
          <div className="row mb-3">
            <div className="col pb-3">
              <div className="card" style={{ height: '100%' }}>
                <h6 className="txt-bold">Quote Details</h6>
                <div className="col">
                  <div className="row">
                    <div className="col-12">
                      <InputField
                        label="Quote Title"
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
                        label={'Quote Description'}
                        name={`description`}
                        rows={4}
                        value={formik.values.description}
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
              <div className="card" style={{ height: '100%' }}>
                <h6 className="txt-bold">Client Details</h6>
                <SelectAsync
                  name={`quoteFor`}
                  label="Select Client"
                  value={formik.values.quoteFor}
                  resource={{ name: 'users', labelProp: 'fullName', valueProp: '_id', params: isWorker ? { roles: 'CLIENT', createdBy: currentUser._id } : { roles: 'CLIENT'} }}
                  onChange={handleClientSelection}
                />
                <ErrorMessage name={`quoteFor.value`} />
                {clientDetails ? (
                  <div className="row bg-grey m-0">
                    <div className="col p-2 ps-4">
                      <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
                      <div className="txt-bold">
                        {(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}
                      </div>
                      <div className="txt-grey">
                        {getPropertyAddress((clientDetails as any)?.address)}
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

                {properties.map((property: any) => {
                  return (
                    <div key={property._id} className="row mb-2 border-bottom">
                      <div className="col-1 p-2 pt-3 ps-4">
                        <input
                          name="property"
                          type="radio"
                          value={property._id}
                          onChange={formik.handleChange}
                          checked={property._id === formik.values.property}
                        />
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">{property.name}</div>
                        <div className="">
                          {property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h6 className="txt-bold">Line items</h6>
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
                              placeholder="Search services"
                              value={formik.values.lineItems[index].name}
                              resource={{ name: 'line-items', labelProp: 'name', valueProp: '_id' }}
                              onChange={(selected: any) => handleLineItemSelection(`lineItems[${index}]`, selected)}
                            />
                            <ErrorMessage name={`lineItems[${index}].name.label`} />
                            <textarea
                              name={`lineItems[${index}].description`}
                              value={formik.values.lineItems[index].description}
                              onChange={formik.handleChange}
                              className={`form-control mb-3`}
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
                          <div className="col mt-3 ps-1 text-center">
                            <strong>{`$ ${formik.values.lineItems[index].quantity * formik.values.lineItems[index].unitPrice}`}</strong>
                          </div>
                          <div className="col-1 mt-3 ps-1 pointer text-center">
                            <span
                              className="mr-2"
                              onClick={() =>
                                arrayHelpers.push({
                                  name: {
                                    label: '',
                                    value: ''
                                  },
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
                <h6 className="txt-bold mt-2">Quote Total</h6>
              </div>
              <div className="col txt-bold mt-3">
                <div className="d-flex float-end">
                  <h5 className="txt-bold mt-2">
                    ${' '}
                    {formik.values?.lineItems?.length ? formik.values?.lineItems.reduce((current, next) => (current += next.quantity * next.unitPrice), 0) : 0}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 mt-3">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update' : 'Save'} Quote
            </button>
            <button onClick={() => navigate(-1)} type="button" className="btn ms-3 btn-secondary">
              Cancel
            </button>
          </div>
        </FormikProvider>
      </form>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.quotes.isLoading,
    currentItem: state.quotes.currentItem
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addQuote: (payload: any) => {
      dispatch(quotesActions.createQuotes(payload));
    },
    updateQuote: (id: string, data: any) => {
      dispatch(quotesActions.updateQuote(id, data));
    },
    fetchQuote: (id: string) => {
      dispatch(quotesActions.fetchQuote(id, {}));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuoteAddForm);
