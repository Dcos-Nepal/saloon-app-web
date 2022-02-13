import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { getIn, useFormik } from "formik";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IOption } from "common/types/form";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import * as workersActions from "store/actions/workers.actions";
import { DAYS_OF_WEEK } from "common/constants";
import {
  EllipsisIcon,
  StopIcon,
  UploadIcon,
  XCircleIcon,
} from "@primer/octicons-react";
import { deletePublicFile, uploadPublicFile } from "services/files.service";

interface IProps {
  actions: {
    addWorker: (data: any) => any;
    fetchWorker: (id: string) => void;
    updateWorker: (data: any) => void;
  };
  id?: string;
  currentWorker?: any;
  isWorkersLoading: boolean;
}

const WorkerDetailForm: FC<IProps> = ({
  id,
  actions,
  currentWorker,
  isWorkersLoading,
}) => {
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState({
    idCard: false,
    cleaningCert: false,
    policeCheck: false,
  });
  const [isDeleting, setIsDeleting] = useState({
    idCard: false,
    cleaningCert: false,
    policeCheck: false,
  });

  const [getDocument, setDocument] = useState<{
    idCard: File | null;
    cleaningCert: File | null;
    policeCheck: File | null;
  }>({
    idCard: null,
    cleaningCert: null,
    policeCheck: null,
  });
  const statesOption = [{ label: "LA", value: "LA" }];
  const countriesOption = [{ label: "Aus", value: "AUS" }];

  useEffect(() => {
    if (id) actions.fetchWorker(id);
  }, [id, actions]);

  const initialValues =
    id && currentWorker
      ? currentWorker
      : {
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
          documents: {
            idCard: {
              url: "",
              key: "",
              type: "ID_CARD",
            },
            cleaningCert: {
              url: "",
              key: "",
              type: "CLEANING_CERTIFICATE",
            },
            policeCheck: {
              url: "",
              key: "",
              type: "POLICE_CERTIFICATE",
            },
          },
          userImage: "",
        };

  const WorkerSchema = Yup.object().shape({
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
    documents: Yup.object().shape({
      idCard: Yup.object().shape({
        key: Yup.string(),
        url: Yup.string(),
        type: Yup.string(),
      }),
      cleaningCert: Yup.object().shape({
        key: Yup.string(),
        url: Yup.string(),
        type: Yup.string(),
      }),
      policeCheck: Yup.object().shape({
        key: Yup.string(),
        url: Yup.string(),
        type: Yup.string(),
      }),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: WorkerSchema,
    onSubmit: async (data: any) => {
      // For updating worker
      if (id) await actions.updateWorker(data);
      // For creating worker
      else await actions.addWorker(data);

      navigate(-1);
    },
  });

  /**
   * Handle File Select
   * @param event
   * @param key
   */
  const handleFileSelect = async (event: any, key: string) => {
    const file = event.target.files[0];
    setDocument({ ...getDocument, [key]: file });
  };

  /**
   * Handle File Upload
   * @param docKey
   */
  const handleFileUpload = async (docKey: string) => {
    const formData = new FormData();
    formData.append(
      "file",
      (getDocument as any)[docKey],
      (getDocument as any)[docKey].name
    );

    setIsUploading({ ...isUploading, [docKey]: true });

    try {
      const uploadedFile = await uploadPublicFile(formData);

      // Setting Formik form document properties
      formik.setFieldValue(
        `documents[${docKey}].key`,
        uploadedFile.data.data.key
      );
      formik.setFieldValue(
        `documents[${docKey}].url`,
        uploadedFile.data.data.url
      );

      setIsUploading({ ...isUploading, [docKey]: false });
    } catch (error) {
      setIsUploading({ ...isUploading, [docKey]: false });
    }
  };

  /**
   * Handles file delete
   * @param docKey
   */
  const handleFileDelete = async (docKey: string) => {
    if ((formik.values.documents as any)[docKey].key) {
      setIsDeleting({ ...isDeleting, [docKey]: true });
      try {
        await deletePublicFile((formik.values.documents as any)[docKey].key);

        // Setting Formik form document properties
        formik.setFieldValue(`documents[${docKey}].key`, "");
        formik.setFieldValue(`documents[${docKey}].url`, "");

        setIsDeleting({ ...isDeleting, [docKey]: false });
      } catch (error) {
        console.log("Error: ", error);
        setIsDeleting({ ...isDeleting, [docKey]: false });
      }
    }
    setDocument({ ...getDocument, [docKey]: null });
  };

  /**
   * Custom Error Message
   * @param param0 Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ name }: any) => {
    if (!name) return <></>;

    const error = getIn(formik.errors, name);
    const touch = getIn(formik.touched, name);

    return (touch && error) || error ? (
      <div className="row txt-red">
        <div className="col-1" style={{ width: "20px" }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col card">
          <h5>Worker Details</h5>
          <div className="row">
            <div className="col">
              <InputField
                label="First name"
                placeholder="Enter first name"
                name="firstName"
                helperComponent={<ErrorMessage name="firstName" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
            </div>
            <div className="col">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                name="lastName"
                helperComponent={<ErrorMessage name="lastName" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
            </div>
          </div>
          <InputField
            label="Email address"
            placeholder="Enter email address"
            type="email"
            name="email"
            helperComponent={<ErrorMessage name="email" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <InputField
            label="Phone number"
            placeholder="Enter phone number"
            name="phoneNumber"
            helperComponent={<ErrorMessage name="phoneNumber" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
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
              helperComponent={<ErrorMessage name="address.street1" />}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address?.street1}
            />
            <InputField
              label="Street 2"
              placeholder="Enter street 2"
              name="address.street2"
              helperComponent={<ErrorMessage name="address.street2" />}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address?.street2}
            />
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="City"
                  placeholder="Enter city"
                  name="address.city"
                  helperComponent={<ErrorMessage name="address.city" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address?.city}
                />
              </div>
              <div className="col">
                <SelectField
                  label="State"
                  name="address.state"
                  options={statesOption}
                  helperComponent={<ErrorMessage name="address.state" />}
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
                  helperComponent={<ErrorMessage name="address.postalCode" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address?.postalCode}
                />
              </div>
              <div className="col">
                <SelectField
                  label="Country"
                  name="address.country"
                  options={countriesOption}
                  helperComponent={<ErrorMessage name="address.country" />}
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
            <label className="form-label txt-dark-grey">
              ID Card/ Driving License:
            </label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="idCard"
                name="documents['idCard'].url"
                onChange={(event) => handleFileSelect(event, "idCard")}
                onBlur={formik.handleBlur}
                // value={
                //   formik.values.documents &&
                //   formik.values.documents["idCard"]?.url
                // }
              />
              {getDocument.idCard ? (
                <div className="row">
                  <div className="col-9">1. {getDocument.idCard.name}</div>
                  <div className="col-3">
                    <button
                      type="button"
                      title="Upload"
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        handleFileUpload("idCard");
                      }}
                    >
                      {isUploading.idCard ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <UploadIcon size={16} />
                      )}
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      title="Delete"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        handleFileDelete("idCard");
                      }}
                    >
                      {isDeleting.idCard ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <XCircleIcon size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
              {!getDocument.idCard ? (
                <label htmlFor="idCard" className="txt-orange dashed-file">
                  Click to browse or drag and drop your file to upload ID card
                </label>
              ) : null}
              {formik.errors.documents && formik.touched.documents ? (
                <div className="txt-red">{formik.errors.documents}</div>
              ) : null}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label txt-dark-grey">
              Cleaning certificate
            </label>
            <div>
              <input
                className="form-control hidden"
                type="file"
                id="clinicCertificate"
                name="documents['cleaningCert'].url"
                onChange={(event) => handleFileSelect(event, "cleaningCert")}
                onBlur={formik.handleBlur}
              />
              {getDocument.cleaningCert ? (
                <div className="row">
                  <div className="col-9">
                    1. {getDocument.cleaningCert.name}
                  </div>
                  <div className="col-3">
                    <button
                      type="button"
                      title="Upload"
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        handleFileUpload("cleaningCert");
                      }}
                    >
                      {isUploading.cleaningCert ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <UploadIcon size={16} />
                      )}
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      title="Delete"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        handleFileDelete("cleaningCert");
                      }}
                    >
                      {isDeleting.cleaningCert ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <XCircleIcon size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
              {!getDocument.cleaningCert ? (
                <label
                  htmlFor="clinicCertificate"
                  className="txt-orange dashed-file"
                >
                  Click to browse or drag and drop your file to upload clinic
                  certificate
                </label>
              ) : null}
              {formik.errors.documents && formik.touched.documents ? (
                <div className="txt-red">{formik.errors.documents}</div>
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
                name="documents['policeCheck'].url"
                onChange={(event) => handleFileSelect(event, "policeCheck")}
                onBlur={formik.handleBlur}
              />
              {getDocument.policeCheck ? (
                <div className="row">
                  <div className="col-9">1. {getDocument.policeCheck.name}</div>
                  <div className="col-3">
                    <button
                      type="button"
                      title="Upload"
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        handleFileUpload("policeCheck");
                      }}
                    >
                      {isUploading.policeCheck ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <UploadIcon size={16} />
                      )}
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      title="Delete"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        handleFileDelete("policeCheck");
                      }}
                    >
                      {isDeleting.policeCheck ? (
                        <EllipsisIcon size={16} />
                      ) : (
                        <XCircleIcon size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
              {!getDocument.policeCheck ? (
                <label htmlFor="policyCheck" className="txt-orange dashed-file">
                  Click to browse or drag and drop your file to upload police
                  check
                </label>
              ) : null}
              {formik.errors.documents && formik.touched.documents ? (
                <div className="txt-red">{formik.errors.documents}</div>
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
        {id ? null : (
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
        )}
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
    currentWorker: state.workers.currentUser,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addWorker: (data: any) => {
      dispatch(workersActions.addWorker(data));
    },
    fetchWorker: (id: string) => {
      dispatch(workersActions.fetchWorker(id));
    },
    updateWorker: (data: any) => {
      dispatch(workersActions.updateWorker(data));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetailForm);
