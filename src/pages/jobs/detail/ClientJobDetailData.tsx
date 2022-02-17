import _ from 'lodash';
import { rrulestr } from 'rrule';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import pinterpolate from 'pinterpolate';
import { useNavigate } from 'react-router-dom';
import { Column, useTable } from 'react-table';
import { useEffect, useMemo, useState } from 'react';

import * as jobsActions from 'store/actions/job.actions';
import { endpoints } from 'common/config';

interface IVisitList {
  overdue: any;
  completed: any;
  [key: string]: any;
}

const ClientJobDetailData = ({ id, actions, job }: any) => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<IVisitList>({ overdue: [], completed: [] });

  const mapVisits = (visitSettings: any[]) => {
    const mappedVisits = visitSettings.reduce((acc: any, visitSetting) => {
      rrulestr(visitSetting.rruleSet)
        .all()
        .map((visit) => {
          let visitMonth = DateTime.fromJSDate(visit).toFormat('LLL');
          if (visitSetting.status.status === 'COMPLETED') visitMonth = 'completed';
          else if (new Date(visit).valueOf() < new Date().valueOf()) visitMonth = 'overdue';

          const visitObj = {
            ...visitSetting,
            startDate: DateTime.fromJSDate(visit).toFormat('yyyy LLL dd'),
            instruction: job.instruction,
            team: job.team.map((t: any) => t.fullName).join(', ')
          };
          if (acc[visitMonth]) acc[visitMonth].push(visitObj);
          else acc[visitMonth] = [visitObj];
          return true;
        });
      return acc;
    }, {});
    console.log(mappedVisits);
    return mappedVisits;
  };

  useEffect(() => {
    if (id) actions.fetchJob(id);
  }, [id, actions]);

  useEffect(() => {
    if (!job) return;
    const visits = mapVisits([job.primaryVisit]);
    setVisits(visits);
  }, [job]);

  return (
    <div>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <div className="row">
              <div className="col">
                <h5 className="txt-bold">{job?.jobFor.fullName}</h5>
                <div>
                  <span className={`status status-green`}>Requires invoicing</span>
                </div>
              </div>
              <div className="col">
                <h4 className="txt-bold d-flex float-end mt-2">$80 cash</h4>
              </div>
            </div>
            <div className="row mt-3 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Property address</div>
                <div className="">
                  {job?.property.street1} {job?.property.country}
                </div>
              </div>
            </div>
            <div className="row mb-4 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Contact details</div>
                <div className="">{job?.jobFor.phoneNumber}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Detail</h6>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job number</div>
                <div className="row">
                  <div className="col">#13</div>
                  <div className="col txt-orange pointer">Change</div>
                </div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Job type</div>
                <div className="">{job?.type}</div>
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Started on</div>
                <div className="">{DateTime.fromISO(job?.startDate).toFormat('yyyy LLL dd')}</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Lasts for</div>
                <div className="">6 years</div>
              </div>
            </div>
            <div className="row border-bottom mb-3">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Billing frequency</div>
                <div className="">After every visit</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Schedule</div>
                {job && <div className="">{_.startCase(rrulestr(job?.primaryVisit.rruleSet).toText())}</div>}
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
              {job?.lineItems.map((item: any, index: number) => (
                <tr key={index}>
                  <th scope="row">#00{index + 1}</th>
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
            <h6 className="txt-bold mt-2">Total</h6>
          </div>
          <div className="col txt-bold mt-3">
            <div className="d-flex float-end">
              <h5 className="txt-bold mt-2">
                ${job?.lineItems.reduce((current: number, next: { quantity: number; unitPrice: number }) => (current += next.quantity * next.unitPrice), 0)}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row bg-grey m-2 p-3">
          <div className="col d-flex flex-row">
            <h6 className="txt-bold mt-2">Visits</h6>
          </div>
          <div className="col">
            <button onClick={() => {}} type="button" className="btn btn-primary d-flex float-end">
              New visit
            </button>
          </div>
        </div>

        <table className="table txt-dark-grey">
          <thead>
            <tr className="rt-head">
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          {Object.keys(visits).map((visitKey: string) => (
            <>
              <thead>
                <tr className="rt-head">
                  <th colSpan={7} scope="col" className="th-overdue">
                    {visitKey}
                  </th>
                </tr>
              </thead>

              <tbody className="rt-tbody">
                {visits[visitKey].map((v: any) => (
                  <tr className="rt-tr-group">
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{v.startDate}</td>
                    <td>{v.instruction}</td>
                    <td>{v.team}</td>
                    <td>asd</td>
                  </tr>
                ))}
              </tbody>
            </>
          ))}
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.jobs.isLoading,
    job: state.jobs.job
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJob: (id: string) => {
      dispatch(jobsActions.fetchJob(id, {}));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientJobDetailData);
