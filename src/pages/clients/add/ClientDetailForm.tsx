import * as Yup from "yup";
import { useFormik } from "formik";
import { FC, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IOption } from "common/types/form";
import PropertyDetail from "./PropertyDetail";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import * as clientsActions from "store/actions/clients.actions";

interface IProps {
  actions: {
    addClient: (data: any) => any;
  };

  isClientsLoading: boolean;
}

const ClientDetailForm: FC<IProps> = ({ actions }) => {
  const navigate = useNavigate();

  const [phoneNumberCount, setPhoneNumberCount] = useState(1);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    roles: ["CLIENT"],
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
        type: "COMPANY-LOGO",
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
    email: Yup.string().required(`Email is required`).email("Invalid email"),
    phoneNumber: Yup.string()
      .label("Phone Number")
      .required(`Phone number is required`)
      .length(10),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string().required(`Street 2 is required`),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`),
    }),
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
      return await actions.addClient(data);
    },
  });

  const statesOption = [{ label: "LA", value: "LA" }];
  const countriesOption = [{ label: "Aus", value: "AUS" }];

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row m-1">
        <div className="col card">
          <h5>Client Details</h5>
          <div className="row mt-3">
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
          <InputField label="Company name" placeholder="Enter company name" />
          <div className="mb-3">
            <label className="form-label txt-dark-grey">Company logo</label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="companyLogo"
                name="userDocuments[0].documentUrl"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="companyLogo" className="txt-orange dashed-file">
                Click to browse or drag and drop your file to upload company
                logo
              </label>
              {formik.errors.userDocuments && formik.touched.userDocuments ? (
                <div className="txt-red">{formik.errors.userDocuments}</div>
              ) : null}
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
            <label className="txt-bold mb-2">Contact details</label>
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
                    name="phoneNumber"
                    helperComponent={
                      formik.errors.phoneNumber &&
                      formik.touched.phoneNumber ? (
                        <div className="txt-red">
                          {formik.errors.phoneNumber}
                        </div>
                      ) : null
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
            className="dashed bold txt-orange pointer mb-3"
          >
            + Add Phone number
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
          <h5>Property Details</h5>
          <PropertyDetail />
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
          Save client
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
    isClientsLoading: state.clients.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addClient: (data: any) => {
      dispatch(clientsActions.addClient(data));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetailForm);
