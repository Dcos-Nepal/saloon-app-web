import InputField from "common/components/form/Input";

const ChangePassword = () => {
  return (
    <form>
      <div className="row mt-3 min-width-22">
        <InputField
          label="New password"
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="row">
        <InputField
          label="Confirm password"
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-primary btn-full">Submit</button>
      </div>
    </form>
  );
};

export default ChangePassword;
