import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

const SignupForm = () => {
  return (
    <form>
      <div className="row mt-3">
        <SelectField
          label="User type"
          value={{ label: "Client", value: "Client" }}
          options={[{ label: "Client", value: "Client" }]}
        />
      </div>
      <div className="row">
        <div className="col">
          <InputField label="First name" placeholder="Your first name" />
        </div>
        <div className="col">
          <InputField label="Last name" placeholder="Your last name" />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <InputField label="Phone number" placeholder="Your phone number" />
        </div>
        <div className="col">
          <InputField type={"email"} label="Email" placeholder="Your email" />
        </div>
      </div>
      <div className="row">
        <InputField label="Password" type="password" placeholder="Password" />
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-primary btn-long">Sign up</button>
      </div>
    </form>
  );
};

export default SignupForm;
