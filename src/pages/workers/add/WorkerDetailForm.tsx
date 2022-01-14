import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

const WorkerDetailForm = () => {
  return (
    <form>
      <div className="row mt-3">
        <div className="col">
          <InputField label="First name" placeholder="Enter first name" />
        </div>
        <div className="col">
          <InputField label="Last name" placeholder="Enter last name" />
        </div>
      </div>
      <InputField
        label="Email address"
        placeholder="Enter email address"
        type="email"
      />
      <InputField label="Company name" placeholder="Enter company name" />
      <div className="mb-3">
        <label className="form-label txt-dark-grey">Company logo</label>
        <div>
          <input className="form-control hidden" type="file" id="companyLogo" />
          <label htmlFor="companyLogo" className="txt-orange dashed-file">
            Click to browse or drag and drop your file to upload company logo
          </label>
        </div>
      </div>
      <div className="mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
        <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
          Use company name as the primary name
        </label>
      </div>
      <div className="mb-3">
        <label className="bold mb-2">Contact details</label>
        <div className="row">
          <div className="col-1 pt-3 mt-4 ps-3 pointer">
            <box-icon name="star" color="#F5E059" />
          </div>
          <div className="col-3">
            <SelectField
              label="Type"
              value={{ value: "Main", label: "Main" }}
            />
          </div>
          <div className="col">
            <InputField label="Phone number" placeholder="Enter phone number" />
          </div>
        </div>
        <div className="row">
          <div className="col-1 pt-3 mt-4 ps-3 pointer">
            <box-icon name="star" color="#F5E059" />
          </div>
          <div className="col-3">
            <SelectField
              label="Type"
              value={{ value: "Main", label: "Main" }}
            />
          </div>
          <div className="col">
            <InputField label="Phone number" placeholder="Enter phone number" />
          </div>
          <div className="col-1 pt-4 mt-3 ps-1 pointer">
            <box-icon name="x-square" type="solid" color="#FF0048" />
          </div>
        </div>
      </div>
      <div className="dashed bold txt-orange pointer">+ Add Phone number</div>
    </form>
  );
};

export default WorkerDetailForm;
