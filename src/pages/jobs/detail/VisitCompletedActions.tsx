import { createInvoiceApi } from 'services/invoice.service';

interface IProps {
  visit: any;
  onClose: () => void;
}

const VisitCompletedActions = (props: IProps) => {
  const { visit, onClose } = props;

  const generateInvoice = () => {
    const invoicePayload = {
      subject: `${visit.title} - Invoice`,
      message: 'This invoice was generated at the time of visit completion.',
      invoiceFor: visit.job.jobFor._id,
      total: visit.lineItems.reduce((sum: number, item: any) => (sum += item.quantity * item.unitPrice), 0),
      isPaid: false,
      lineItems: visit.lineItems
    };
    createInvoiceApi(invoicePayload);
    onClose();
  };

  const closeJob = () => {
    throw new Error('Not implemented.');
  };

  return (
    <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Completed</h5>
          </div>
          <div className="modal-body">
            {visit.job?.allVisitsCompleted && (
              <div className="row ps-3 pointer" onClick={closeJob}>
                Close Job
              </div>
            )}
            <div className="row ps-3 pointer" onClick={generateInvoice}>
              Generate Invoice
            </div>
          </div>
          <div className="modal-footer">
            <div className="row pointer" onClick={onClose}>
              Leave as Action Required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCompletedActions;
