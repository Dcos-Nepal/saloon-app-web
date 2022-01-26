import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

const RequestAddForm = () => {

  return (
    <form>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Details</h6>
            <InputField label="Job title" placeholder="Enter job title" />
            <InputField label="Job type" placeholder="Enter job type" />
            <div className="mb-3">
              <label
                htmlFor="instructions"
                className="form-label txt-dark-grey"
              >
                Job description
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows={12}
                className={`form-control`}
                placeholder={"Enter job description"}
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold mb-5">Client Details</h6>

            <SelectField
              label="Client name"
              value={{ value: "MOCK", label: "Albert Flores" }}
            />
            <div className="row border-bottom mt-2">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Phone number</div>
                <div className="">123456789</div>
              </div>
            </div>
            <div className="txt-bold mt-3 txt-grey">Property -1</div>
            <div className="row mb-4 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Street 1</div>
                <div className="">91 Woolnough Road</div>
              </div>
            </div>
            <div className="row mb-4 border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Street 2</div>
                <div className="">7 Delan Road</div>
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col p-2 ps-4">
                <div className="txt-grey">City</div>
                <div className="">Tusmore</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">State</div>
                <div className="">South Australia</div>
              </div>
            </div>
            <div className="row border-bottom mb-3">
              <div className="col p-2 ps-4">
                <div className="txt-grey">Post code</div>
                <div className="">5065</div>
              </div>
              <div className="col p-2 ps-4">
                <div className="txt-grey">Country</div>
                <div className="">Australia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 mt-3">
        <button onClick={() => {}} type="button" className="btn btn-primary">
          Save Request
        </button>
        <button
          onClick={() => {}}
          type="button"
          className="btn btn-secondary ms-3"
        >
          Save and create another
        </button>
        <button onClick={() => []} type="button" className="btn ms-3">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RequestAddForm;
