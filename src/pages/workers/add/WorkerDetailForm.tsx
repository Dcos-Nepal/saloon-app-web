import { FC } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IOption } from "common/types/form";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import * as workersActions from "store/actions/workers.actions";
import { DAYS_OF_WEEK } from "common/constants";

interface IProps {
  actions: {
    addWorker: (data: any) => any;
  };

  isWorkersLoading: boolean;
}

const WorkerDetailForm: FC<IProps> = ({ actions }) => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    roles: ["WORKER"],
    phoneNumber: "",
    password: "password",
    address: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      postalCode: undefined,
      country: "",
    },
    userDocuments: [
      {
        documentUrl: "",
        type: "ID-CARD",
      },
      {
        documentUrl: "",
        type: "CLINICAL-CERTIFICATE",
      },
      {
        documentUrl: "",
        type: "POLICE-CERTIFICATE",
      },
    ],
    userImage: "",
  };

  const RequestSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(`First name is required`)
      .min(2, "Too Short!")
      .max(20, "Too Long!"),
    lastName: Yup.string()
      .required(`Last name is required`)
      .min(2, "Too Short!")
      .max(20, "Too Long!"),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string().required(`Street 2 is required`),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`),
    }),
    email: Yup.string().required(`Email is required`).email("Invalid email"),
    phoneNumber: Yup.string()
      .label("Phone Number")
      .required(`Phone number is required`)
      .length(10),
    userDocuments: Yup.array(
      Yup.object().shape({
        documentUrl: Yup.string(),
        type: Yup.string(),
      })
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RequestSchema,
    onSubmit: async (data: any) => {
      return await actions.addWorker(data);
    },
  });

  const statesOption = [{ label: "LA", value: "LA" }];
  const countriesOption = [{ label: "Aus", value: "AUS" }];

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
                helperComponent={
                  formik.errors.firstName && formik.touched.firstName ? (
                    <div className="txt-red">{formik.errors.firstName}</div>
                  ) : null
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                name="lastName"
                helperComponent={
                  formik.errors.lastName && formik.touched.lastName ? (
                    <div className="txt-red">{formik.errors.lastName}</div>
                  ) : null
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <InputField
            label="Email address"
            placeholder="Enter email address"
            type="email"
            name="email"
            helperComponent={
              formik.errors.email && formik.touched.email ? (
                <div className="txt-red">{formik.errors.email}</div>
              ) : null
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputField
            label="Phone number"
            placeholder="Enter phone number"
            name="phoneNumber"
            helperComponent={
              formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                <div className="txt-red">{formik.errors.phoneNumber}</div>
              ) : null
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            <div className="col week-list">
              <label className="form-label txt-dark-grey">
                Available working days and time
              </label>
              <ul>
                {DAYS_OF_WEEK.map((day) => (
                  <li
                    key={day}
                    // className={`${
                    //   formik.values.weekDay &&
                    //   getDayFromDate(formik.values.weekDay) === day
                    //     ? "selected"
                    //     : null
                    // }`}
                    // onClick={() => onWeekDayChange(day)}
                  >
                    <span className="item">
                      {day[0].toString().toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-3">
            <label className="txt-bold mt-2 mb-2">Address</label>

            <InputField
              label="Street 1"
              placeholder="Enter street 1"
              name="address.street1"
              helperComponent={
                formik.errors.address?.street1 &&
                formik.touched.address?.street1 ? (
                  <div className="txt-red">
                    {formik.errors.address?.street1}
                  </div>
                ) : null
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputField
              label="Street 2"
              placeholder="Enter street 2"
              name="address.street2"
              helperComponent={
                formik.errors.address?.street2 &&
                formik.touched.address?.street2 ? (
                  <div className="txt-red">
                    {formik.errors.address?.street2}
                  </div>
                ) : null
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="City"
                  placeholder="Enter city"
                  name="address.city"
                  helperComponent={
                    formik.errors.address?.city &&
                    formik.touched.address?.city ? (
                      <div className="txt-red">
                        {formik.errors.address?.city}
                      </div>
                    ) : null
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col">
                <SelectField
                  label="State"
                  name="address.state"
                  options={statesOption}
                  helperComponent={
                    formik.errors.address?.state &&
                    formik.touched.address?.state ? (
                      <div className="txt-red">
                        {formik.errors.address?.state}
                      </div>
                    ) : null
                  }
                  value={statesOption.find(
                    (option) => option.value === formik.values.address?.state
                  )}
                  handleChange={(selectedOption: IOption) => {
                    formik.setFieldValue("address.state", selectedOption.value);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="Post code"
                  placeholder="Enter post code"
                  name="address.postalCode"
                  helperComponent={
                    formik.errors.address?.postalCode &&
                    formik.touched.address?.postalCode ? (
                      <div className="txt-red">
                        {formik.errors.address?.postalCode}
                      </div>
                    ) : null
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col">
                <SelectField
                  label="Country"
                  name="address.country"
                  options={countriesOption}
                  helperComponent={
                    formik.errors.address?.country &&
                    formik.touched.address?.country ? (
                      <div className="txt-red">
                        {formik.errors.address?.country}
                      </div>
                    ) : null
                  }
                  value={countriesOption.find(
                    (option) => option.value === formik.values.address?.country
                  )}
                  handleChange={(selectedOption: IOption) => {
                    formik.setFieldValue(
                      "address.country",
                      selectedOption.value
                    );
                  }}
                  onBlur={formik.handleBlur}
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
                id="idCard"
                name="userDocuments[0].documentUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="idCard" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload ID card
              </label>
              {formik.errors.userDocuments && formik.touched.userDocuments ? (
                <div className="txt-red">{formik.errors.userDocuments}</div>
              ) : null}
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
                id="clinicCertificate"
                name="userDocuments[1].documentUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label
                htmlFor="clinicCertificate"
                className="txt-orange dashed-file"
              >
                Click to browse or drag and drop your file to upload clinic
                certificate
              </label>
              {formik.errors.userDocuments && formik.touched.userDocuments ? (
                <div className="txt-red">{formik.errors.userDocuments}</div>
              ) : null}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label txt-dark-grey">Police check</label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="policyCheck"
                name="userDocuments[2].documentUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="policyCheck" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload police
                check
              </label>
              {formik.errors.userDocuments && formik.touched.userDocuments ? (
                <div className="txt-red">{formik.errors.userDocuments}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-3 mt-3">
        <button
          type="button"
          onClick={async () => {
            await formik.handleSubmit();
            // navigate(-1);
          }}
          className="btn btn-primary"
        >
          Save worker
        </button>
        <button
          type="button"
          onClick={async () => {
            await formik.handleSubmit();
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

const mapStateToProps = (state: any) => {
  return {
    isWorkersLoading: state.workers.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addWorker: (data: any) => {
      dispatch(workersActions.addWorker(data));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetailForm);
