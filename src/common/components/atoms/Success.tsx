import { CheckCircleIcon } from "@primer/octicons-react";
import { FC } from "react";

const Success: FC<{ msg: string; okMsg: string; okHandler: () => void }> = ({
  msg,
  okMsg,
  okHandler,
}) => {
  return (
    <div className="text-center">
      <CheckCircleIcon size={18} className="text-green"/>
      <div className="row mt-2">
        <b>{msg}</b>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button type="button" onClick={okHandler} className="btn btn-primary">
          {okMsg}
        </button>
      </div>
    </div>
  );
};

export default Success;
