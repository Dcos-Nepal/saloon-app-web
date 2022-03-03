import { InfoIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendInvoiceApi } from 'services/invoice.service';
import * as invoicesActions from 'store/actions/invoices.actions';
import { getCurrentUser } from 'utils';

interface IProps {
  actions: {
    fetchInvoice: (id: string) => void;
  };
  isLoading: boolean;
  currentInvoice: any;
}

const InvoiceDetailData: FC<IProps> = ({ isLoading, actions, currentInvoice }) => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [sendingInvoice, setSendingInvoice] = useState(false);

  useEffect(() => {
    if (id) actions.fetchInvoice(id);
  }, [id, actions]);

  /**
   * Send Invoice to the client
   */
  const sendInvoiceHandler = async () => {
    if (id) {
      try {
        setSendingInvoice(true);
        const { data } = await sendInvoiceApi(id);

        if (data) {
          setSendingInvoice(false);
          toast.info('Invoice sent successfully');
        }
      } catch (ex) {
        setSendingInvoice(false);
        toast.error('Failed to send invoice');
      }
    }
  };

  return (
    <>
      <div className="card">
        <Loader isLoading={isLoading} />
        <div className="row border-bottom p-3">
          <div className="col d-flex flex-row">
            <h5>{currentInvoice?.subject?.toUpperCase()}</h5>
          </div>
          {(currentUser.role === 'ADMIN') ? (
            <div className="col">
              <button type="button" onClick={sendInvoiceHandler} className="btn btn-primary d-flex float-end">
                {sendingInvoice ? <span className="spinner-border spinner-border-sm mt-1" role="status" /> : null}&nbsp;Send to client
              </button>
            </div>
          ) : null}
        </div>
        <div className="row mt-3 mb-3">
          <div className="col">
            <div className="p-3">
              <div className="row">
                <label className="txt-grey mb-3">TO</label>
                <div className="col">
                  <h5 className="txt-bold">{`${currentInvoice?.invoiceFor?.firstName} ${currentInvoice?.invoiceFor?.lastName}`}</h5>
                  <div>
                    {currentInvoice?.invoiceFor?.address?.street1}, {currentInvoice?.invoiceFor?.address?.street2}, {currentInvoice?.invoiceFor?.address?.city}
                  </div>
                  <div className="mb-1">
                    {currentInvoice?.invoiceFor?.address?.state}, {currentInvoice?.invoiceFor?.address?.country},{' '}
                    {currentInvoice?.invoiceFor?.address?.postalCode}
                  </div>
                  <div className="mb-1">{currentInvoice?.invoiceFor?.email || '-'}</div>
                  <div className="mb-1">{currentInvoice?.invoiceFor?.phoneNumber || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="p-3">
              <label className="txt-grey mb-3">FROM</label>
              <h5 className="txt-bold">Orange Cleaning</h5>
              <div>43 Hamley Cres, Mansfield Park</div>
              <div className="mb-1">SA 5012</div>
              <div className="mb-1">info@orangecleaning.com.au</div>
              <div className="mb-1">+62 1300 612 667</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3">
              <h6 className="txt-bold">Invoice Details</h6>
              <div className="row border-bottom">
                <div className="col-12 p-2 ps-4">
                  <div className="txt-grey">Invoice number</div>
                  <div className="row">
                    <div className="col txt-orange">
                      <strong>#{currentInvoice?.refCode || 'XXXXX'}</strong>
                    </div>
                  </div>
                </div>
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Created Date</div>
                  <div className="">{new Date(currentInvoice?.createdAt).toLocaleString()}</div>
                </div>
                <div className="col p-2 ps-4">
                  <div className="d-flex float-end">
                    <div className="me-1">
                      <div className="txt-grey">Status</div>
                      <div className="">
                        {currentInvoice?.isPaid ? <span className="status status-green">Paid</span> : <span className="status status-blue">Pending</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row p-2 border-bottom">
                <h6 className="">Message to client</h6>
                <div className="ps-3"><InfoIcon /> {currentInvoice?.message}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h6 className="txt-bold">Payment Details</h6>
          <div className="row border-bottom p-3">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">SN</th>
                  <th scope="col" className='col-6'>PRODUCT / SERVICE</th>
                  <th scope="col">QTY</th>
                  <th scope="col">UNIT PRICE</th>
                  <th scope="col">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {(!currentInvoice?.lineItems.length) ? (<tr><td colSpan={5}>No line items selected</td></tr>) : null}
                {currentInvoice?.lineItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
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
              <h6 className="txt-bold mt-2">Invoice Total</h6>
            </div>
            <div className="col txt-bold mt-3">
              <div className="d-flex float-end">
                <h3 className="txt-bold mt-2 txt-orange">
                  ${currentInvoice?.lineItems.reduce(
                    (current: number, next: { quantity: number; unitPrice: number }) => (current += next.quantity * next.unitPrice),
                    0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.invoices.isLoading,
    currentInvoice: state.invoices.currentItem
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchInvoice: (id: string) => {
      dispatch(invoicesActions.fetchInvoice(id, {}));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetailData);
