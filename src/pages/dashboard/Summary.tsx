import ReactRRuleGenerator, { translations } from "common/components/rrule-form";
import { useState } from "react";

const Summary = () => {
  const [rruleStr, setRruleStr] = useState('DTSTART:20220114T035500Z RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=1;UNTIL=20220127T050300Z');
  const getTranslation = () => {
    switch ('en') {
      case 'en': return translations.english;
      default: return translations.english;
    };
  };

  const handleChange = (newRRule: any) => {
    setRruleStr(newRRule);
  };

  return (<>
    <div className="row">
      <div className="col d-flex flex-row">
        <h1>Home</h1>
      </div>
      <div className="col">
        <button type="button" className="btn btn-primary d-flex float-end">
          Create
        </button>
      </div>
    </div>
    <div className="rounded-radius bg-white mt-4 p-4">
      <b className="">Today’s appointments</b>
      <div className="row mt-4 mb-4">
        <div className="col row">
          <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-grey">
            3
          </div>
          <div className="col dashboard-main-label">
            Total <p className="txt-bold-big mt-2">$0.00</p>
          </div>
        </div>
        <div className="col row">
          <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-red">
            3
          </div>
          <div className="col dashboard-main-label">
            To Go <p className="txt-bold-big mt-2">$0.00</p>
          </div>
        </div>
        <div className="col row">
          <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-blue">
            0
          </div>
          <div className="col dashboard-main-label">
            Active <p className="txt-bold-big mt-2">$0.00</p>
          </div>
        </div>
        <div className="col row">
          <div className="col p-3-4 text-center dashboard-h1 rounded-radius bg-light-green">
            0
          </div>
          <div className="col dashboard-main-label">
            Complete <p className="txt-bold-big mt-2">$0.00</p>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Recurring Rule Form</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ReactRRuleGenerator
                onChange={handleChange as any}
                value={rruleStr as string}
                config={{
                  hideStart: false,
                } as any}
                translations={getTranslation() as any}
              />
              <div className="col-12">
                <small>{rruleStr.split(';').join("; ")}</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default Summary;
