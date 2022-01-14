import { FC } from "react";
import JobForm from "./JobForm";

interface IProps {
  closeModal: () => void;
}

const JobAdd: FC<IProps> = ({ closeModal }) => {
  return (
    <div className="">
      <div className="modal-header row bg-background-grey">
        <h5 className="col">Add Job</h5>
        <div className="col">
          <span onClick={closeModal} className="pointer d-flex float-end">
            <box-icon name="x" />
          </span>
        </div>
      </div>
      <div className="modal-body">
        <JobForm closeModal={closeModal} />
      </div>
    </div>
  );
};

export default JobAdd;
