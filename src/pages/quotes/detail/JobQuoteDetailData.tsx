import { AlertFillIcon, StopIcon } from "@primer/octicons-react";
import { Loader } from "common/components/atoms/Loader";
import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import * as quotesActions from "store/actions/quotes.actions";

interface IProps {
  actions: {
    fetchQuote: (id: string) => void;
  };
  isLoading: boolean;
  currentQuote: any;
}

const JobQuoteDetailData: FC<IProps> = ({isLoading, actions, currentQuote}) => {
  const { id } = useParams();

  useEffect(() => {
    if (id) actions.fetchQuote(id);
  }, [id, actions]);

  return (
    <div>
      <div className="row mt-3 mb-3">
        <Loader isLoading={isLoading} />
        {currentQuote?.status?.status === 'CHANGE_REQUESTED' ? (
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <AlertFillIcon /> {currentQuote?.status.reason}
            </div>
          </div>
        ) : null }

        {currentQuote?.status?.status === 'REJECTED' ? (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <AlertFillIcon /> {currentQuote?.status.reason}
            </div>
          </div>
        ) : null }
        <div className="col">
          <div className="card">
            <div className="row">
              <div className="col">
                <h5 className="txt-bold">{`${currentQuote?.quoteFor.firstName} ${currentQuote?.quoteFor.lastName}`}</h5>
                <div>
                  <span className={`status txt-orange`}>
                    {currentQuote?.status?.status}
                  </span>
                </div>
              </div>
              <div className="col">
                <h4 className="txt-bold d-flex float-end mt-2">${currentQuote?.lineItems.reduce((current: number, next: { quantity: number; unitPrice: number; }) => (current += next.quantity * next.unitPrice), 0)} cash</h4>
              </div>
            </div>
            {currentQuote?.property ? (
              <div className="row mt-3 border-bottom">
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Property address</div>
                  <div className="txt-grey">Name: <strong>{currentQuote?.property.name}</strong></div>
                    <div className="">{currentQuote?.property?.street1}, {currentQuote?.property?.postalCode}, {currentQuote?.property?.city}, {currentQuote?.property?.state}, {currentQuote?.property?.country}</div>
                </div>
              </div>
            ) : (
              <div className="row mt-3 border-bottom">
                <div className="col p-2 ps-4">
                  <div className="txt-grey">Property address</div>
                  <div className="txt-orange"><StopIcon size={14} /> No property listed for this client.</div>
                </div>
              </div>
            )}
            <div className="row mb-4">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Contact details</div>
                <div className="">{currentQuote?.quoteFor.phoneNumber}/{currentQuote?.quoteFor.email}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Quote Details</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Quote number</div>
                <div className="row">
                  <div className="col">#13</div>
                  {/* <div className="col txt-orange pointer">Change</div> */}
                </div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Created on</div>
                <div className="">{(new Date(currentQuote?.createdAt)).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-2 mb-3" >
              <h6 className="p-2">Quote Status Revisions</h6>
              <div className="mt-3" style={{maxHeight: '150px', overflowY: 'scroll'}}>
                {currentQuote?.statusRevision.map((revision: any) => (<dl key={revision.updatedAt} className="row ms-2">
                  <dt className="col-sm-3">{(new Date(revision.updatedAt)).toLocaleString()}</dt>
                  <dd className="col-sm-9">
                    <span className="status status-green">{revision.status}</span>&nbsp;
                    <span className="txt-grey">{(new Date(revision.updatedAt)).toLocaleString()}</span>
                  </dd>
                </dl>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h6 className="txt-bold">Line items</h6>
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
              {currentQuote?.lineItems.map((item: any, index: number) => (
                <tr key={index}>
                  <th scope="row">#00{index + 1}</th>
                  <td>
                    <div><strong>{item.name}</strong></div>
                    <div><small>{item.description}</small></div>
                  </td>
                  <td><strong>{item.quantity}</strong></td>
                  <td><strong>${item.unitPrice}</strong></td>
                  <td><strong>${item.quantity*item.unitPrice}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row border-top">
          <div className="col d-flex flex-row mt-3">
            <h6 className="txt-bold mt-2">Quote Total</h6>
          </div>
          <div className="col txt-bold mt-3">
            <div className="d-flex float-end">
              <h5 className="txt-bold mt-2">${currentQuote?.lineItems.reduce((current: number, next: { quantity: number; unitPrice: number; }) => (current += next.quantity * next.unitPrice), 0)}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.quotes.isLoading,
    currentQuote: state.quotes.currentItem,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchQuote: (id: string) => {
      dispatch(quotesActions.fetchQuote(id, {}));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(JobQuoteDetailData);
