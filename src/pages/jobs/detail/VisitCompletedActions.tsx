import { ChecklistIcon, ClockIcon, ReportIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import { useState } from 'react';
import { createInvoiceApi } from 'services/invoice.service';

interface IProps {
  visit: any;
  cleanup: () => void;
  onClose: () => void;
}

const VisitCompletedActions = (props: IProps) => {
  const { visit, onClose, cleanup } = props;
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Generates Invoice for completed visit
   */
  const generateInvoice = async () => {
    setIsLoading(true);
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
    cleanup();
    setIsLoading(false);
    onClose();
  };

  return (
    <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><ChecklistIcon /> Visit Completed!</h5>
            <button onClick={() => onClose()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <Loader isLoading={isLoading} />
            <div className="row p-3">Visit has been completed now. You can now generate Invoice for the visit or you can always generate invoice later.</div>
            <div className="row mt-3 mb-3">
              <div className="col">
                <button type="button" disabled={isLoading} className="btn btn-primary" onClick={generateInvoice}>
                  <ReportIcon /> Generate Invoice Now
                </button>
              </div>
              <div className="col">
                <button type="button" disabled={isLoading} className="ms-2 btn btn-secondary" data-bs-dismiss="modal" onClick={() => onClose()}>
                  <ClockIcon /> Generate Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCompletedActions;
