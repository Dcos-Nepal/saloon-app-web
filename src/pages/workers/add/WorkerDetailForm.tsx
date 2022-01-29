import { useNavigate } from "react-router-dom";

import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";

const WorkerDetailForm = () => {
  const navigate = useNavigate();

  return (
    <form>
      <div className="row mt-3">
        <div className="col card">
          <h5>Worker Details</h5>
          <div className="row">
            <div className="col">
              <InputField
                label="First name"
                placeholder="Enter first name"
                name="firstName"
                // helperComponent={
                //   formik.errors.firstName && formik.touched.firstName ? (
                //     <div className="txt-red">{formik.errors.firstName}</div>
                //   ) : null
                // }
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
              />
            </div>
            <div className="col">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                name="lastName"
                // helperComponent={
                //   formik.errors.lastName && formik.touched.lastName ? (
                //     <div className="txt-red">{formik.errors.lastName}</div>
                //   ) : null
                // }
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <InputField
            label="Email address"
            placeholder="Enter email address"
            type="email"
            name="email"
            // helperComponent={
            //   formik.errors.email && formik.touched.email ? (
            //     <div className="txt-red">{formik.errors.email}</div>
            //   ) : null
            // }
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
          />
          <InputField
            label="Phone number"
            placeholder="Enter phone number"
            name="phoneNumber"
            // helperComponent={
            //   formik.errors.phoneNumber && formik.touched.phoneNumber ? (
            //     <div className="txt-red">{formik.errors.phoneNumber}</div>
            //   ) : null
            // }
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
          />
          <div className="mb-3 row">
            <div className="col">
              <InputField
                label="Working hours"
                placeholder="Enter working hours"
                name="workingHours"
                // helperComponent={
                //   formik.errors.workingHours && formik.touched.workingHours ? (
                //     <div className="txt-red">{formik.errors.workingHours}</div>
                //   ) : null
                // }
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
              />
            </div>
            <div className="col"></div>
          </div>

          <div className="mb-3">
            <label className="txt-bold mt-2 mb-2">Address</label>

            <InputField
              label="Street 1"
              placeholder="Enter street 1"
              name="street1"
              // helperComponent={
              //   formik.errors.street1 && formik.touched.street1 ? (
              //     <div className="txt-red">{formik.errors.street1}</div>
              //   ) : null
              // }
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
            />
            <InputField
              label="Street 2"
              placeholder="Enter street 2"
              name="street2"
              // helperComponent={
              //   formik.errors.street2 && formik.touched.street2 ? (
              //     <div className="txt-red">{formik.errors.street2}</div>
              //   ) : null
              // }
              // onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
            />
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="City"
                  placeholder="Enter city"
                  name="city"
                  // helperComponent={
                  //   formik.errors.city && formik.touched.city ? (
                  //     <div className="txt-red">{formik.errors.city}</div>
                  //   ) : null
                  // }
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                />
              </div>
              <div className="col">
                <SelectField
                  label="State"
                  name="state"
                  options={[]}
                  // helperComponent={
                  //   formik.errors.state && formik.touched.state ? (
                  //     <div className="txt-red">{formik.errors.state}</div>
                  //   ) : null
                  // }
                  // value={statesOption.find(
                  //   (option) => option.value === formik.values.state
                  // )}
                  // handleChange={(selectedOption: IOption) => {
                  //   formik.setFieldValue("state", selectedOption.value);
                  //   setActiveState(
                  //     states.find((state) => state._id === selectedOption.value)
                  //   );
                  // }}
                  // onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="Post code"
                  placeholder="Enter post code"
                  name="postalCode"
                  // helperComponent={
                  //   formik.errors.postalCode && formik.touched.postalCode ? (
                  //     <div className="txt-red">{formik.errors.postalCode}</div>
                  //   ) : null
                  // }
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                />
              </div>
              <div className="col">
                <SelectField
                  label="Country"
                  name="country"
                  options={[]}
                  // helperComponent={
                  //   formik.errors.country && formik.touched.country ? (
                  //     <div className="txt-red">{formik.errors.country}</div>
                  //   ) : null
                  // }
                  // value={countriesOption.find(
                  //   (option) => option.value === formik.values.country
                  // )}
                  // handleChange={(selectedOption: IOption) => {
                  //   formik.setFieldValue("country", selectedOption.value);
                  //   setActiveCountry(
                  //     countries.find((country) => country._id === selectedOption.value)
                  //   );
                  // }}
                  // onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col card ms-3">
          <h5>Upload documents</h5>
          <div className="mb-3">
            <label className="form-label txt-dark-grey">ID card</label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="companyLogo"
              />
              <label htmlFor="companyLogo" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload ID card
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label txt-dark-grey">
              Clinic certificate
            </label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="companyLogo"
              />
              <label htmlFor="companyLogo" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload clinic
                certificate
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label txt-dark-grey">Police check</label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="companyLogo"
              />
              <label htmlFor="companyLogo" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload police
                check
              </label>
            </div>
          </div>
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
          Save worker
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
        <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WorkerDetailForm;
