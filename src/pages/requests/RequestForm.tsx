import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";

import { IOption } from "common/types/form";
import { IClient } from "common/types/client";
import InputField from "common/components/form/Input";
import SelectField from "common/components/form/Select";
import * as clientsActions from "store/actions/clients.actions";
import * as jobRequestsActions from "store/actions/job-requests.actions";

interface IProps {
  actions: {
    fetchClients: (payload: any) => any;
    addJobRequest: (data: any) => any;
  };
  clients: IClient[];
  id?: string;

  isClientsLoading: boolean;
}

const RequestAddForm: FC<IProps> = ({ actions, clients }) => {
  const navigate = useNavigate();

  const [clientsOption, setClientsOption] = useState<IOption[]>([]);
  const [activeClient, setActiveClient] = useState<IClient | never>();

  useEffect(() => {
    actions.fetchClients({ roles: "CLIENT" });
  }, [actions]);

  useEffect(() => {
    const clientsLabelValues = clients.map((client) => {
      return {
        label: client.fullName || `${client.firstName} ${client.lastName}`,
        value: client._id || "",
      };
    });

    setClientsOption(clientsLabelValues);
  }, [clients]);

  const initialValues = {
    name: "",
    description: "",
    type: "",
    client: "",
  };

  const RequestSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    description: Yup.string().required(`Description is required`),
    type: Yup.string().required(`Type is required`),
    client: Yup.string().required(`Client is required`),
    status: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RequestSchema,
    onSubmit: async (data: any) => {
      return await actions.addJobRequest(data);
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row mt-3 mb-3">
        <div className="col">
          <div className="card">
            <h6 className="txt-bold">Job Details</h6>
            <InputField
              label="Job title"
              placeholder="Enter job title"
              name="name"
              helperComponent={
                formik.errors.name && formik.touched.name ? (
                  <div className="txt-red">{formik.errors.name}</div>
                ) : null
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputField
              label="Job type"
              placeholder="Enter job type"
              name="type"
              helperComponent={
                formik.errors.type && formik.touched.type ? (
                  <div className="txt-red">{formik.errors.type}</div>
                ) : null
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="mb-3">
              <label
                htmlFor="instructions"
                className="form-label txt-dark-grey"
              >
                Job description
              </label>
              <textarea
                id="instructions"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={12}
                className={`form-control`}
                placeholder={"Enter job description"}
              />
              {formik.errors.description && formik.touched.description ? (
                <div className="txt-red">{formik.errors.description}</div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h6 className="txt-bold mb-5">Client Details</h6>
            <SelectField
              label="Client name"
              name="client"
              options={clientsOption}
              helperComponent={
                formik.errors.client && formik.touched.client ? (
                  <div className="txt-red">{formik.errors.client}</div>
                ) : null
              }
              value={clientsOption.find(
                (option) => option.value === formik.values.client
              )}
              handleChange={(selectedOption: IOption) => {
                formik.setFieldValue("client", selectedOption.value);
                setActiveClient(
                  clients.find((client) => client._id === selectedOption.value)
                );
              }}
              onBlur={formik.handleBlur}
            />
            {activeClient ? (
              <>
                <div className="row border-bottom mt-2">
                  <div className="col p-2 ps-4">
                    <div className="txt-grey">Phone number</div>
                    <div className="">{activeClient.phoneNumber}</div>
                  </div>
                </div>
                <div className="txt-bold mt-3 txt-grey">Property -1</div>
                {activeClient.address ? (
                  <>
                    <div className="row mb-4 border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Street 1</div>
                        <div className="">{activeClient.address.street1}</div>
                      </div>
                    </div>
                    <div className="row mb-4 border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Street 2</div>
                        <div className="">{activeClient.address.street2}</div>
                      </div>
                    </div>
                    <div className="row border-bottom">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">City</div>
                        <div className="">{activeClient.address.city}</div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">State</div>
                        <div className="">{activeClient.address.state}</div>
                      </div>
                    </div>
                    <div className="row border-bottom mb-3">
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Post code</div>
                        <div className="">
                          {activeClient.address.postalCode}
                        </div>
                      </div>
                      <div className="col p-2 ps-4">
                        <div className="txt-grey">Country</div>
                        <div className="">{activeClient.address.country}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="row border-bottom mb-3">
                    <div className="col p-2 ps-4">
                      <div className="txt-grey">No address data</div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
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
          Save Request
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
    clients: state.clients.clients?.data?.rows || [],
    isClientsLoading: state.clients.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchClients: (payload: any) => {
      dispatch(clientsActions.fetchClients(payload));
    },
    addJobRequest: (data: any) => {
      dispatch(jobRequestsActions.addJobRequest(data));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestAddForm);
