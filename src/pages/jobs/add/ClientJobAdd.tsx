import { InfoIcon } from "@primer/octicons-react";
import { useNavigate } from "react-router-dom";

import JobForm from "../JobForm";

const ClientAdd = () => {
  const navigate = useNavigate();

  /**
   * Initial values for Job Creation Form
   */
  const initialValues = {
    title: '',
    instruction: '',
    jobFor: { label: '', value: '' },
    property: null,
    type: 'ONE-OFF',
    team: [],
    jobType: '',
    lineItems: [
      {
        name: { label: '', value: '' },
        description: '',
        quantity: 0,
        unitPrice: 0,
        total: 0
      }
    ],
    schedule: { rruleSet: '', startDate: '', startTime: '', endDate: '', endTime: '' },
    oneOff: { rruleSet: '', startDate: '', startTime: '', endDate: '', endTime: '' },
    notifyTeam: false,
    notes: '',
    docs: []
  };
  

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer mb-3" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        <div className="d-flex flex-row">
          <div className='mt-2'>
            <h3 className="txt-bold extra">Create Job for Client</h3>
            <p className="text-secondary"><InfoIcon /> This is the Job Creation form. Please add all the information for the Job.</p>
          </div>
        </div>
      </div>
      <div className="">
        <JobForm initialValues={initialValues}/>
      </div>
    </>
  );
};

export default ClientAdd;
