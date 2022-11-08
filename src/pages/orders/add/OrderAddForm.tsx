import * as Yup from 'yup';
import * as ordersAction from 'store/actions/orders.actions';

import { FC, Fragment, useEffect, useState } from 'react';
import { FieldArray, FormikProvider, useFormik, getIn } from 'formik';
import { PlusCircleIcon, StopIcon, XCircleIcon } from '@primer/octicons-react';

import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'common/components/atoms/Loader';

import InputField from 'common/components/form/Input';
import SelectAsync from 'common/components/form/AsyncSelect';
import AsyncInputDataList from 'common/components/form/AsyncInputDataList';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { DateTime } from 'luxon';

interface IProps {
  id: string;
  actions: {
    addOrder: (id: string) => void;
    fetchOrder: (id: string) => void;
    updateOrder: (id: string, data: any) => void;
  };
  isLoading: boolean;
  currentItem: any;
}

const OrderAddForm: FC<IProps> = ({ id, isLoading, currentItem, actions }) => {
  const navigate = useNavigate();
  const [clientDetails, setClientDetails] = useState<any>(null);

  const [initialValues, setInitialValues] = useState({
    title: '',
    notes: '',
    orderDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd'),
    customer: {
      label: 'Search for Clients...',
      value: ''
    },
    products: [{
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }]
  });

  const OrderSchema = Yup.object().shape({
    title: Yup.string().required('Order title is required').min(3, 'Order title seems to be too short'),
    notes: Yup.string(),
    customer: Yup.object().shape({
      value: Yup.string().required('Client is required for this quote'),
      label: Yup.string()
    }),
    products: Yup.array().of(
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
    validationSchema: OrderSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      // Preparing the Object for saving
      const orderPayload = { ...data };

      // Making properties compliant to Request payload
      orderPayload.title = data.title;
      orderPayload.customer = data.customer.value;
      orderPayload.products = data.products.map((li: any) => {
        return {
          name: li.name.label,
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          total: li.quantity * li.unitPrice
        };
      });

      if (!orderPayload.jobRequest) {
        delete orderPayload.jobRequest;
      }

      // Dispatch action to create Job Order
      if (id) {
        await actions.updateOrder(id, orderPayload);
      } else {
        await actions.addOrder(orderPayload);

        // Reset form
        formik.resetForm();
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
    formik.setFieldValue(`${key}.unitPrice`, +meta?.unitPrice || 0);
  };

  /**
   * Handles Client selection
   */
  const handleClientSelection = async ({ label, value, meta }: any) => {
    formik.setFieldValue(`customer`, { label, value });
    setClientDetails(meta);
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
    if (id) return actions.fetchOrder(id);
  }, [id, actions]);

  useEffect(() => {
    if (currentItem && id) {
      setInitialValues({
        ...initialValues,
        title: currentItem?.title,
        notes: currentItem?.notes,
        customer: {
          label: currentItem?.customer?.fullName,
          value: currentItem?.customer?._id
        },
        products: currentItem?.products?.map((item: { name: any; ref: any }) => {
          return {
            ...item,
            name: {
              value: item.name,
              label: item.name
            },
          };
        })
      });

      setClientDetails(currentItem?.customer);
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
                <div className="col">
                  <div className="row">
                    <div className="col">
                      <h6 className="txt-bold">Order Details</h6>
                      <InputField
                        label="Order Title"
                        type="text"
                        placeholder="Title"
                        name={`title`}
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        helperComponent={formik.errors.title && formik.touched.title ? <div className="txt-red">{formik.errors.title}</div> : null}
                      />
                    </div>
                    <div className="col">
                      <h6 className="txt-bold">Client Details</h6>
                      <SelectAsync
                        name={`customer`}
                        label="Select Client"
                        value={formik.values.customer}
                        resource={{ name: 'customers', labelProp: 'fullName', valueProp: '_id'}}
                        onChange={handleClientSelection}
                        preload={true}
                      />
                      <ErrorMessage name={`customer.value`} />
                      {clientDetails ? (
                        <div className="row bg-grey m-0">
                          <div className="col p-2 ps-4">
                            <div className="txt-orange">{(clientDetails as any)?.fullName}</div>
                            <div className="txt-bold">
                              {(clientDetails as any)?.email} / {(clientDetails as any)?.phoneNumber}
                            </div>
                            <div className="txt-grey">
                              {clientDetails?.address}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
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
                name="products"
                render={(arrayHelpers) => (
                  <div>
                    {formik.values.products.map((product, index: number) => (
                      <Fragment key={`~${index}`}>
                        <div className="row ps-1">
                          <div className="col-5">
                            <AsyncInputDataList
                              name={`products[${index}].name`}
                              placeholder="Search Products"
                              value={formik.values.products[index].name}
                              resource={{ name: 'products', labelProp: 'name', valueProp: '_id' }}
                              onChange={(selected: any) => handleLineItemSelection(`products[${index}]`, selected)}
                            />
                            <ErrorMessage name={`products[${index}].name.label`} />
                            <textarea
                              name={`products[${index}].description`}
                              value={formik.values.products[index].description}
                              onChange={formik.handleChange}
                              className={`form-control mb-3`}
                              placeholder={"Line item's description..."}
                            />
                          </div>
                          <div className="col">
                            <InputField
                              placeholder="Quantity"
                              type="number"
                              name={`products[${index}].quantity`}
                              value={formik.values.products[index].quantity}
                              onChange={formik.handleChange}
                            />
                          </div>
                          <div className="col">
                            <InputField
                              type="number"
                              placeholder="Unit Price"
                              name={`products[${index}].unitPrice`}
                              value={formik.values.products[index].unitPrice}
                              onChange={formik.handleChange}
                            />
                          </div>
                          <div className="col mt-3 ps-1 text-center">
                            <strong>{`$ ${formik.values.products[index].quantity * formik.values.products[index].unitPrice}`}</strong>
                          </div>
                          <div className="col-1 mt-3 ps-1 pointer text-center">
                            <span
                              className="mr-2"
                              onClick={() =>
                                arrayHelpers.push({
                                  name: { label: '', value: '' },
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
                <h6 className="txt-bold mt-2">Order Total</h6>
              </div>
              <div className="col txt-bold mt-3">
                <div className="d-flex float-end">
                  <h5 className="txt-bold mt-2">
                    ${' '}
                    {formik.values?.products?.length ? formik.values?.products.reduce((current, next) => (current += next.quantity * next.unitPrice), 0) : 0}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col pb-3">
              <div className="card" style={{ height: '100%' }}>
                <div className="mb-3">
                  <label htmlFor="instructions" className="form-label txt-dark-grey">
                    Order Notes
                  </label>
                  <DefaultEditor placeholder='Enter the Order notes here' style={{minHeight: '150px'}} name="notes" value={formik.values.notes} onChange={formik.handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 mt-3">
            <button type="submit" className="btn btn-primary">
              {id ? 'Update' : 'Save'} Order
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
    addOrder: (payload: any) => {
      dispatch(ordersAction.createOrders(payload));
    },
    updateOrder: (id: string, data: any) => {
      dispatch(ordersAction.updateOrder(id, data));
    },
    fetchOrder: (id: string) => {
      dispatch(ordersAction.fetchOrder(id, {}));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderAddForm);
