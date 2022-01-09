import InputField from "common/components/form/Input";

const ResetPassword = () => {

  return (
    <form>
      <div className="row mt-3">
        <div className="col">
          <InputField type={"email"} label="Email" placeholder="Your email" />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-primary btn-full">Send email</button>
      </div>
    </form>
  );
};

export default ResetPassword;
