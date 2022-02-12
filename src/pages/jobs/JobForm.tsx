import { FC } from 'react'

import InputField from 'common/components/form/Input'
import SelectField from 'common/components/form/Select'

interface IProps {
  closeModal: () => void
}

const JobForm: FC<IProps> = ({ closeModal }) => {
  return (
    <form>
      <InputField label="Client name" placeholder="Enter client name" type="text" />
      <InputField label="Address" placeholder="Enter address" />
      <div className="row">
        <div className="col">
          <InputField label="Job number" placeholder="Enter job number" />
        </div>
        <div className="col">
          <InputField label="Title" placeholder="Enter title" />
        </div>
      </div>
      <SelectField label="Team" value={{ value: 'ORANGE', label: 'Orange Team' }} />
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <InputField label="Start date" type="date" />
          </div>
          <div className="col">
            <InputField label="End date" type="date" />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="row">
          <div className="col">
            <InputField label="Start time" type="time" />
          </div>
          <div className="col">
            <InputField label="End time" type="time" />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <button onClick={() => {}} type="button" className="btn btn-primary">
          Save
        </button>
        <button onClick={closeModal} type="button" className="btn">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default JobForm
