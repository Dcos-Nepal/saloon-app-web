import { StopIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendInvoiceApi } from 'services/invoice.service';
import * as invoicesActions from 'store/actions/invoices.actions';

interface IProps {
  actions: {
    fetchInvoice: (id: string) => void;
  };
  isLoading: boolean;
  currentInvoice: any;
}

const InvoiceDetailData: FC<IProps> = ({ isLoading, actions, currentInvoice }) => {
  const { id } = useParams();

  useEffect(() => {
    if (id) actions.fetchInvoice(id);
  }, [id, actions]);

  const sendInvoiceHandler = async () => {
    if (id) {
      try {
        const { data } = await sendInvoiceApi(id);

        if (data) {
          toast.info('Invoice sent successfully');
        }
      } catch (ex) {
        toast.error('Failed to send invoice');
      }
    }
  };

  return (
    <>
      <div className="card">
        <div className="border-bottom p-3">
          <h2 className="txt-grey txt-bold">{currentInvoice?.subject?.toUpperCase()}</h2>
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
                  <div className="mb-1">Email: {currentInvoice?.invoiceFor?.email || '-'}</div>
                  <div className="mb-1">Phone: {currentInvoice?.invoiceFor?.phoneNumber || '-'}</div>
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
              <div className="mb-1">Email: info@orangecleaning.com.au</div>
              <div className="mb-1">Phone: 1300 612 667</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3">
              <h6 className="txt-bold">Invoice Details</h6>
              <div className="row border-bottom">
                <div className="col-12 p-2 ps-4">
                  <div className="txt-grey">Invoice number</div>
                  <div className="row">
                    <h3 className="col txt-orange">#{currentInvoice?.id}</h3>
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
                <div className="ps-3">{currentInvoice?.clientMessage}</div>
              </div>
              {/* <div className="mt-2 mb-3">
              <h6 className="p-2">Invoice Status Revisions</h6>
              <div className="mt-3" style={{ maxHeight: '150px', overflowY: 'scroll' }}>
                {currentInvoice?.statusRevision?.map((revision: any) => (
                  <dl key={revision.updatedAt} className="row ms-2">
                    <dt className="col-sm-3">{new Date(revision.updatedAt).toLocaleString()}</dt>
                    <dd className="col-sm-9">
                      <span className="status status-green">{revision.status}</span>&nbsp;
                      <span className="txt-grey">{new Date(revision.updatedAt).toLocaleString()}</span>
                    </dd>
                  </dl>
                ))}
              </div>
            </div> */}
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
                  <th scope="col">PRODUCT / SERVICE</th>
                  <th scope="col">QTY</th>
                  <th scope="col">UNIT PRICE</th>
                  <th scope="col">TOTAL</th>
                </tr>
              </thead>
              <tbody>
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
                  $
                  {currentInvoice?.lineItems.reduce(
                    (current: number, next: { quantity: number; unitPrice: number }) => (current += next.quantity * next.unitPrice),
                    0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-3 d-flex float-end">
        <button type="button" onClick={sendInvoiceHandler} className="btn btn-primary">
          Send to client
        </button>
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
