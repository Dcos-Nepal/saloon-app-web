import { FC } from "react";
import ReactModal from "react-modal";

interface IProps {
  isOpen: boolean;
  onRequestClose: () => any;
  children: JSX.Element;
}

const customStyles = {
  content: {
    inset: "auto",
    padding: "0",

    // top: "50%",
    // left: "50%",
    // right: "auto",
    // bottom: "auto",
    // marginRight: "-50%",
    // overflow: "auto",
    // color: "#666666",
    // transform: "translate(-50%, -50%)",
  },
};

const Modal: FC<IProps> = ({ isOpen, onRequestClose, children }) => {
  ReactModal.setAppElement('#root');

  return (
    <ReactModal
      isOpen={isOpen}
      style={customStyles}
      onRequestClose={onRequestClose}
    >

      {children}
    </ReactModal>
  );
};

export default Modal;

// Body

{/* <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
        <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        // body
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(`/dashboard/quotes/${event.extendedProps?.meta?.job?._id}`)}>View Details</button>
        <button type="button" className="btn btn-primary" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
</div> */}
