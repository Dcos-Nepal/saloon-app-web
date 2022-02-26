const DeleteConfirm = ({ onDelete, closeModal }: { onDelete: any; closeModal: () => void }) => {
  return (
    <div className="modal-container p-4 text-center">
      <h4 className="txt-bold"> Are you sure you want to delete?</h4>
      <div className="mt-4">
        <button onClick={onDelete} type="button" className="btn btn-danger">
          Delete
        </button>
        <button onClick={closeModal} type="button" className="btn btn--secondary ms-3">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirm;
