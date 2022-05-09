import { createInvoiceApi } from 'services/invoice.service';

interface IProps {
  visit: any;
  onClose: () => void;
}

const VisitCompletedActions = (props: IProps) => {
  const { visit, onClose } = props;

  /**
   * Generates Invoice for completed visit
   */
  const generateInvoice = async () => {
    const invoicePayload = {
      subject: `${visit.title} - Invoice`,
      message: 'This invoice was generated at the time of visit completion.',
      invoiceFor: visit.job.jobFor._id,
      total: visit.lineItems.reduce((sum: number, item: any) => (sum += item.quantity * item.unitPrice), 0),
      isPaid: false,
      lineItems: visit.lineItems,
      refJob: visit.job._id
    };
    await createInvoiceApi(invoicePayload);
    onClose();
  };

  return (
    <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Completed!</h5>
            <button onClick={() => onClose()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className='row p-3'>
              Visit has been completed now. You can now generate Invoice for the visit or you can always generate invoice later.
            </div>
            <div className='row mt-3 mb-3'>
              <div className='col'>
                <button type="button" className="btn btn-primary" onClick={generateInvoice}>
                  Generate Invoice
                </button>
              </div>
              <div className='col'>
                <button type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal" onClick={() => onClose()}>
                  Generate Later
                </button>
              </div>
            </div>
            <div className='row mt-3 mb-3'>
              <div className='col-12 text-center'>
                {visit.job?.allVisitsCompleted && (
                  <button type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal" onClick={() => onClose()}>
                    Close the Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCompletedActions;
