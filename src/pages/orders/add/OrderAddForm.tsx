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
  client?: string;
}

const OrderAddForm: FC<IProps> = ({ id, isLoading, currentItem, actions, client }) => {
  const navigate = useNavigate();
  const [clientDetails, setClientDetails] = useState(null);

  const [initialValues, setInitialValues] = useState({
    notes: '',
    orderDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd'),
    customer: client ? client : '',
    products: [{
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    }]
  });

  const OrderSchema = Yup.object().shape({
    notes: Yup.string(),
    customer: Yup.string().required('Client is required for this order'),
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
      orderPayload.customer = data.customer;
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
      }

      // Navigate to the previous screen
      setTimeout(() => {
        navigate(-1);
      }, 1000);
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
  const handleClientSelection = async (data: any) => {
    formik.setFieldValue(`customer`, data?.value ? data.value : '');
    setClientDetails(data ? data : '')
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
        notes: currentItem?.notes,
        customer: currentItem?.customer,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentItem]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ position: 'relative' }}>
        <Loader isLoading={isLoading} />
        <FormikProvider value={formik}>
          <div className="row mb-3">
            <div className="col pb-3">
              <div className="card" style={{ height: '100%' }}>
                <div className="row">
                  <div className="col-12">
                    <h6 className="txt-bold">Client Details</h6>
                    <SelectAsync
                      name={`customer`}
                      label="Select client by their name"
                      value={formik.values.customer}
                      resource={{ name: 'customers', labelProp: 'fullName', valueProp: '_id'}}
                      onChange={handleClientSelection}
                      preload={true}
                    />
                    {!!clientDetails
                      ? (<div>Phone: {(clientDetails as any).meta.phoneNumber} &nbsp;|&nbsp; Address: {(clientDetails as any).meta.address}</div>)
                      : null
                    }
                    <ErrorMessage name={`customer.value`} />
                  </div>
                </div>
                
                <div className="row mt-2">
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
                                  <strong>{`${formik.values.products[index].quantity * formik.values.products[index].unitPrice}`}</strong>
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
                          Rs.{' '}
                          {formik.values?.products?.length ? formik.values?.products.reduce((current, next) => (current += next.quantity * next.unitPrice), 0) : 0}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col pb-3">
                    <div className="" style={{ height: '100%' }}>
                      <div className="mb-3">
                        <label htmlFor="instructions" className="form-label txt-dark-grey">
                          Order Notes
                        </label>
                        <DefaultEditor placeholder='Enter the Order notes here' style={{minHeight: '150px'}} name="notes" value={formik.values.notes} onChange={formik.handleChange} />
                      </div>
                    </div>
                  </div>
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
    isLoading: state.orders.isLoading,
    currentItem: state.orders.currentItem
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
