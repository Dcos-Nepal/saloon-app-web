import { useState } from "react";

interface IImage {
  className: string;
  fileSrc: string;
  style: any;
}

const Image = (props: IImage) => {
  const [success, setSuccess] = useState<any>(false);
  const [error, setError] = useState<any>(false);

  const handleSuccess = () => {
    setSuccess(true);
    setError(false);
  }

  const handleError = () => {
    setSuccess(false);
    setError(true);
  }

  return (<>
    {!success && !error ? (
      <img
        style = {props.style}
        className={props.className}
        src={props.fileSrc}
        onLoad={handleSuccess}
        onError={handleError}
        alt=""
      />
    ) : (
      <img
        style = {props.style}
        className={props.className}
        src={error ? 'https://via.placeholder.com/295x295?text=Image+Not+Available' : props.fileSrc}
        alt="Uploaded File"
      />
    )}
  </>);
};

export default Image;
