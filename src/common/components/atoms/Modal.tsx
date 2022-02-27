import { FC } from "react";
import ReactModal from "react-modal";

interface IProps {
  isOpen: boolean;
  children: JSX.Element;
  onRequestClose: () => any;

}

const customStyles = {
  content: {
    inset: "auto",
    padding: "0"
  },
};

const Modal: FC<IProps> = ({ isOpen, children, onRequestClose, }) => {
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
