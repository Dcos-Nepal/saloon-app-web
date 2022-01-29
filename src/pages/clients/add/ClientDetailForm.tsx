import { useState } from "react";

import PropertyDetail from "./PropertyDetail";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

const ClientDetailForm = () => {
  const [phoneNumberCount, setPhoneNumberCount] = useState(1);

  return (
    <form>
      <div className="row m-1">
        <div className="col card">
          <h5>Client Details</h5>
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
              <input
                className="form-control hidden"
                type="file"
                id="companyLogo"
              />
              <label htmlFor="companyLogo" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload company
                logo
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
            {Array.from(Array(phoneNumberCount), (_, index) => (
              <div className="row">
                <div className="col-1 pt-2 mt-4 ps-3 pointer">
                  <box-icon name="star" color="#F5E059" />
                </div>
                <div className="col-3">
                  <SelectField
                    label="Type"
                    value={{ value: "Main", label: "Main" }}
                  />
                </div>
                <div className="col">
                  <InputField
                    label="Phone number"
                    placeholder="Enter phone number"
                  />
                </div>
                {index ? (
                  <div className="col-1 pt-4 mt-2 ps-1 pointer">
                    <span
                      onClick={() => {
                        setPhoneNumberCount(
                          phoneNumberCount > 1
                            ? phoneNumberCount - 1
                            : phoneNumberCount
                        );
                      }}
                    >
                      <box-icon name="x-square" type="solid" color="#FF0048" />
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              setPhoneNumberCount(
                phoneNumberCount < 5 ? phoneNumberCount + 1 : phoneNumberCount
              );
            }}
            className="dashed bold txt-orange pointer"
          >
            + Add Phone number
          </div>
        </div>
        <div className="col card ms-3">
          <h5>Property Details</h5>
          <PropertyDetail />
        </div>
      </div>

      <div className="mb-3 mt-3">
        <button
          type="button"
          onClick={async () => {
            // await formik.handleSubmit();
            // navigate(-1);
          }}
          className="btn btn-primary"
        >
          Save client
        </button>
        <button
          type="button"
          onClick={async () => {
            // await formik.handleSubmit();
            // formik.resetForm();
          }}
          className="btn btn-secondary ms-3"
        >
          Save and create another
        </button>
        <button
          // onClick={() => navigate(-1)}
          type="button"
          className="btn ms-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ClientDetailForm;
