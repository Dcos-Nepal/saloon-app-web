import { FC } from "react";
import ReactModal from "react-modal";

interface IProps {
  isOpen: boolean;
  onRequestClose: () => any;
  children: JSX.Element;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0px",
    overflow: "hidden",
    color: "#666666",
    transform: "translate(-50%, -50%)",
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
