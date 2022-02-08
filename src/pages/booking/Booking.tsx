import * as Yup from "yup";
import { useState } from "react";

import { IOption } from "common/types/form";
import SelectField from "common/components/form/Select";
import { FormikProvider, getIn, useFormik } from "formik";
import { StopIcon } from "@primer/octicons-react";
import InputField from "common/components/form/Input";
import TextArea from "common/components/form/TextArea";
import Modal from "common/components/atoms/Modal";

interface IService {
  name: string;
  description?: string;
  hourlyRate?: number;
  offer?: { rate: number; hours: number };
}

const cleaningFrequencyOptions = [
  {
    label: "Weekly",
    value: "WEEKLY",
  },
  {
    label: "Fortnightly",
    value: "FORTH_NIGHT",
  },
  {
    label: "Multi X per week",
    value: "MULTI_X_PER_WEEK",
  },
];

const bestDescribingYouOptions = [
  {
    label: "I am an individual receiving and paying for the service",
    value: "INDIVIDUAL",
  },
  {
    label: "I am a business paying for an individual",
    value: "BUSINESS",
  },
];

const NDISServiceOptions = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

const cleaningDayOptions = [
  {
    label: "Any Day",
    value: "ANY",
  },
  {
    label: "Monday",
    value: "MONDAY",
  },
  {
    label: "Tuesday",
    value: "TUESDAY",
  },
  {
    label: "Wednesday",
    value: "WEDNESDAY",
  },
  {
    label: "Thursday",
    value: "THURSDAY",
  },
  {
    label: "Friday",
    value: "FRIDAY",
  },
  {
    label: "Saturday *",
    value: "SATURDAY",
  },
];

const heardFromOptions = [
  {
    label: "Google",
    value: "GOOGLE",
  },
  {
    label: "Facebook",
    value: "FACEBOOK",
  },
  {
    label: "Referral",
    value: "REFERRAL",
  },
  {
    label: "Instagram",
    value: "INSTAGRAM",
  },
  {
    label: "Email",
    value: "EMAIL",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

const cleaningHourOptions = [
  {
    label: "2 Hours",
    value: 2,
  },
  {
    label: "3 Hours",
    value: 3,
  },
  {
    label: "4 Hours",
    value: 4,
  },
  {
    label: "5 Hours",
    value: 5,
  },
];

const serviceTypeOptions = [
  {
    label: "Move out/End of lease",
    value: "MOVE_OUT_END_OF_LEASE",
  },
  {
    label: "Moving In",
    value: "MOVING_IN",
  },
  {
    label: "Spring Clean",
    value: "SPRING_CLEAN",
  },
];

const statesOption = [{ label: "New South Wales", value: "New South Wales" }];

const countriesOption = [
  {
    label: "AUS",
    value: "AUS",
  },
];

const serviceAreas = [
  {
    area: {
      name: "Baandee",
      postalCode: "WA 6412",
    },
    services: [
      {
        name: "Weekly/Fortnightly",
        description:
          "Book an ongoing weekly or fortnightly clean and never worry about the general chores again!",
        hourlyRate: 26,
        offer: { rate: 73, hours: 2 },
      },
    ],
  },
  {
    area: {
      name: "Sadliers Crossing",
      postalCode: "QLD 4305",
    },
    services: [
      {
        name: "Weekly/Fortnightly",
        description:
          "Book an ongoing weekly or fortnightly clean and never worry about the general chores again!",
        hourlyRate: 30,
        offer: { rate: 82, hours: 2 },
      },
      {
        name: "Moving Out/Spring Clean",
        description:
          "Our spring clean takes the hard work out of a big cleaning job by using our expert one-off cleaners.",
        hourlyRate: 60,
        offer: { rate: 235, hours: 3 },
      },
    ],
  },
  {
    area: {
      name: "Sadliers",
      postalCode: "MOCK 1231",
    },
    services: [
      {
        name: "Weekly/Fortnightly",
        description:
          "Book an ongoing weekly or fortnightly clean and never worry about the general chores again!",
        hourlyRate: 30,
        offer: { rate: 82, hours: 2 },
      },
      {
        name: "Moving Out/Spring Clean",
        description:
          "Our spring clean takes the hard work out of a big cleaning job by using our expert one-off cleaners.",
        hourlyRate: 60,
        offer: { rate: 235, hours: 3 },
      },
      {
        name: "Aged Care/Disability",
        description:
          "Providers for NDIS, Veteran Affairs, Workers Compensation, Insurance and aged care providers.",
        hourlyRate: undefined,
        offer: undefined,
      },
    ],
  },
  {
    area: {
      name: "MOCK City",
      postalCode: "MOCK 321",
    },
    services: [],
  },
];

const Booking = () => {
  const [selectedServiceArea, setSelectedServiceArea] = useState<any | never>();
  const [selectedService, setSelectedService] = useState<IService | never>();
  const [initialValues, setInitialValues] = useState<any>({
    postalCode: "",
    cleaningService: "",
    cleaningFrequency: "",
    cleaningHour: 2,
    numberOfDaysPerWeek: 1,
    cleaningDays: [],
    startDate: undefined,
    heardFrom: "",
    serviceType: "",
    bestDescribedAs: "",
    numberOfBedrooms: undefined,
    numberOfBathrooms: undefined,
    userData: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: {
        street1: "",
        street2: "",
        city: "",
        state: "",
        country: "",
      },
    },
    isNDIS: undefined,
    agedCareDisabilityCleaningService: "",
  });

  const postalCodeOptions = serviceAreas.map((serviceArea) => {
    return {
      label: `${serviceArea.area.name} (${serviceArea.area.postalCode})`,
      value: serviceArea.area.postalCode,
    };
  });

  const BookingSchema = Yup.object().shape({
    postalCode: Yup.string().required("Please select postal code"),
    cleaningService: Yup.string().required("Please select service"),
    cleaningFrequency: Yup.string().required("Please select frequency"),
    cleaningHour: Yup.number().required("Please select cleaning hour"),
    numberOfDaysPerWeek: Yup.number().required(
      "Please enter number of days per week"
    ),
    // numberOfBedrooms: Yup.number().required("Please enter number bedrooms"),
    // numberOfBathrooms: Yup.number().required("Please enter number bathrooms"),
    cleaningDays: Yup.array(Yup.string()).min(
      1,
      "Please select days to clean (More than 1 preferred)"
    ),
    startDate: Yup.string().required("Please select start date"),
    serviceType: Yup.string().optional(),
    heardFrom: Yup.string().optional(),
    userData: Yup.object().shape({
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
        postalCode: Yup.string().required(`Postal Code is required`),
        country: Yup.string().required(`Country is required`),
      }),
      isNDIS: Yup.boolean(),
      agedCareDisabilityCleaningService: Yup.string(),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: BookingSchema,
    onSubmit: async (data: any) => {
      console.log(data);
    },
  });

  const ErrorMessage = ({ name }: { name: string }) => {
    if (!name) return null;

    const error = getIn(formik.errors, name);
    const touch = getIn(formik.touched, name);

    return error && touch ? (
      <div className="row txt-red">
        <div className="col-1" style={{ width: "16px" }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  const NotAvailableCard = () => {
    return (
      <div className="card txt-grey col m-2 text-center">
        <h5 className="txt-bold p-4">Not available at the moment</h5>

        <div className="hr-orange mb-5 mt-3"></div>

        <p className="mb-5 p-3 lh-lg">
          Sorry the service is not in this area. Please check another services.
          Thank you!
        </p>
        <div className="mt-3">
          <span className="txt-orange txt-l txt-bold">{`$${0} `}</span>
          <label className="float-left">
            for
            <span className="txt-bold"> 1 </span>
            hours
          </label>
          <div>$0/hour thereafter</div>
        </div>

        <div className="m-3">
          <button disabled className="btn btn-full p-2 bg-light-grey">
            UNAVAILABLE
          </button>
        </div>
      </div>
    );
  };

  const ServiceSelectionCards = () => {
    return selectedServiceArea ? (
      selectedServiceArea.services.length ? (
        <>
          <div className="hr-orange mb-4 mt-2"></div>
          <h4 className="txt-bold">Select a cleaning service</h4>
          <div className="row p-2">
            {selectedServiceArea.services.map((service: IService) => (
              <div
                key={service.name}
                onClick={() => {
                  if (selectedService?.name === service.name) {
                    setSelectedService(undefined);
                    return;
                  }

                  setSelectedService(service);
                  formik.setFieldValue("cleaningService", service.name);
                }}
                className={`card hover-card m-2 col text-center ${
                  selectedService?.name === service.name
                    ? "border-orange-color"
                    : ""
                }`}
              >
                <h5 className="txt-bold p-4">{service.name}</h5>
                <div className="hr-orange mb-5 mt-3"></div>
                <p className="mb-5 p-3 lh-lg">{service.description}</p>
                <div className="mt-3">
                  {service.offer ? (
                    <>
                      <span className="txt-orange txt-l txt-bold">
                        {`$${service.offer.rate} `}
                      </span>
                      <label className="float-left">
                        for
                        <span className="txt-bold">
                          {` ${service.offer.hours || 1} `}
                        </span>
                        hours
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  <div>
                    {service.hourlyRate ? (
                      `$${service.hourlyRate}/hour${
                        service.offer ? " thereafter" : ""
                      }`
                    ) : (
                      <div className="txt-orange m-3 p-1">
                        Specific rates apply
                      </div>
                    )}
                  </div>
                </div>
                <div className="m-3">
                  <button
                    type="button"
                    className={`btn btn-full p-2 txt-bold ${
                      selectedService?.name === service.name
                        ? "btn-primary"
                        : "bg-grey"
                    }`}
                  >
                    {selectedService?.name === service.name
                      ? "UNSELECT"
                      : "SELECT"}
                  </button>
                </div>
              </div>
            ))}
            {selectedServiceArea.services.length < 3 ? (
              <>
                <NotAvailableCard />
                {selectedServiceArea.services.length === 1 ? (
                  <NotAvailableCard />
                ) : null}
              </>
            ) : null}
          </div>
          <ErrorMessage name="cleaningService" />
          <ServiceDetails />
        </>
      ) : (
        <>
          <div className="hr-orange mb-3"></div>
          <div className="card">
            <h5 className="text-center">
              Sorry no cleaning service available in this area
            </h5>
          </div>
        </>
      )
    ) : null;
  };

  const CleaningFrequency = () => {
    return (
      <>
        <h4 className="txt-bold">How often will the cleaner be required?</h4>
        <div className="row p-2">
          {cleaningFrequencyOptions.map((frequencyOption) => (
            <div
              className={`col text-center card hover-card m-2 txt-bold ${
                formik.values.cleaningFrequency === frequencyOption.value
                  ? "bg-orange txt-white"
                  : ""
              }`}
              onClick={() =>
                formik.setFieldValue("cleaningFrequency", frequencyOption.value)
              }
            >
              {frequencyOption.label}
            </div>
          ))}
          <ErrorMessage name="cleaningFrequency" />
        </div>
      </>
    );
  };

  const BestDescribeYou = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">What best describes you?</h4>
        <div className="row p-2">
          {bestDescribingYouOptions.map((bestDescribingOption) => (
            <div
              className={`col text-center card hover-card m-2 txt-bold ${
                formik.values.bestDescribedAs === bestDescribingOption.value
                  ? "bg-orange txt-white"
                  : ""
              }`}
              onClick={() =>
                formik.setFieldValue(
                  "bestDescribedAs",
                  bestDescribingOption.value
                )
              }
            >
              {bestDescribingOption.label}
            </div>
          ))}
          <ErrorMessage name="bestDescribedAs" />
        </div>
      </>
    );
  };

  const NDISService = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">Is this an NDIS Service?</h4>
        <div className="row p-2">
          {NDISServiceOptions.map((NDISServiceOption) => (
            <div
              className={`col text-center card hover-card m-2 txt-bold ${
                formik.values.isNDIS === NDISServiceOption.value
                  ? "bg-orange txt-white"
                  : ""
              }`}
              onClick={() =>
                formik.setFieldValue("isNDIS", NDISServiceOption.value)
              }
            >
              {NDISServiceOption.label}
            </div>
          ))}
          <ErrorMessage name="isNDIS" />
        </div>
      </>
    );
  };

  const CleaningHour = () => {
    return (
      <>
        <h4 className="txt-bold">
          How many hours will your cleaner be required?
        </h4>
        <div className="row p-2">
          {cleaningHourOptions.map((hourOption) => (
            <div
              className={`col text-center card hover-card m-2 txt-bold ${
                formik.values.cleaningHour === hourOption.value
                  ? "bg-orange txt-white"
                  : ""
              }`}
              onClick={() =>
                formik.setFieldValue("cleaningHour", hourOption.value)
              }
            >
              {hourOption.label}
            </div>
          ))}
          <ErrorMessage name="cleaningHour" />
        </div>
      </>
    );
  };

  const NumberOfDaysPerWeek = () => {
    return (
      <>
        <h4 className="txt-bold">
          How many days per week would you like the clean to occur?
        </h4>
        <div className="row p-2">
          <div className="row col-3">
            <div className="col-2 me-1 mt-3 p-1">
              <button
                onClick={() =>
                  formik.setFieldValue(
                    "numberOfDaysPerWeek",
                    formik.values?.numberOfDaysPerWeek
                      ? formik.values?.numberOfDaysPerWeek + 1
                      : 1
                  )
                }
                className="btn btn-circle border-orange-color txt-bold"
              >
                +
              </button>
            </div>
            <div className="col">
              <InputField
                label=""
                type="number"
                placeholder="Enter number of days per week"
                name="numberOfDaysPerWeek"
                value={formik.values.numberOfDaysPerWeek}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-2 ms-1 mt-3 p-1">
              <button
                onClick={() =>
                  formik.setFieldValue(
                    "numberOfDaysPerWeek",
                    formik.values?.numberOfDaysPerWeek &&
                      formik.values?.numberOfDaysPerWeek > 1
                      ? formik.values?.numberOfDaysPerWeek - 1
                      : 1
                  )
                }
                className="btn btn-circle border-orange-color txt-bold"
              >
                -
              </button>
            </div>
          </div>
          <ErrorMessage name="numberOfDaysPerWeek" />
        </div>
      </>
    );
  };

  const ServiceType = () => {
    return (
      <>
        <h4 className="txt-bold">Type of service</h4>
        <div className="row p-2">
          {serviceTypeOptions.map((serviceTypeOption) => (
            <div
              className={`col text-center card hover-card m-2 txt-bold ${
                formik.values.serviceType === serviceTypeOption.value
                  ? "bg-orange txt-white"
                  : ""
              }`}
              onClick={() =>
                formik.setFieldValue("serviceType", serviceTypeOption.value)
              }
            >
              {serviceTypeOption.label}
            </div>
          ))}
          <ErrorMessage name="serviceType" />
        </div>
      </>
    );
  };

  const CleaningDays = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">
          What day would you like your clean on?
        </h4>
        <div className="row p-2 me-5">
          {cleaningDayOptions.map((dayOption) => (
            <div className="col">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formik.values.cleaningDays?.includes(dayOption.value)}
                onChange={({ target }) => {
                  if (target.checked) {
                    formik.setFieldValue("cleaningDays", [
                      ...formik.values.cleaningDays,
                      dayOption.value,
                    ]);
                  } else {
                    formik.setFieldValue(
                      "cleaningDays",
                      formik.values.cleaningDays.filter(
                        (existingDay: string) => existingDay !== dayOption.value
                      )
                    );
                  }
                }}
                name="cleaningDays"
                id={dayOption.value}
              />
              <label
                className="ms-2 form-check-label"
                htmlFor={dayOption.value}
              >
                {dayOption.label}
              </label>
            </div>
          ))}
          <ErrorMessage name="cleaningDays" />
        </div>
      </>
    );
  };

  const StartDate = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">
          When would you like the clean to start?
        </h4>
        <div className="row p-2">
          <InputField
            name="startDate"
            label=""
            type="date"
            onChange={formik.handleChange}
            value={formik.values.startDate || ""}
            placeholder="Special Requirements"
          />
          <ErrorMessage name="startDate" />
        </div>
      </>
    );
  };

  const SpecialRequirements = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">Special requirements</h4>

        <i className="txt-grey">
          Please be aware these comments will be shown to cleaners.
        </i>
        <div className="row pb-2">
          <TextArea
            name="specialRequirements"
            label=""
            rows={3}
            onChange={({ target }: { target: { value: string } }) => {
              formik.setFieldValue("specialRequirements", target.value);
            }}
            placeholder="Special Requirements"
            handleBlur={formik.handleBlur}
            value={formik.values.specialRequirements || ""}
          />
          <ErrorMessage name="specialRequirements" />
        </div>
      </>
    );
  };

  const HeardFrom = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">How did you hear about us?</h4>
        <div className="row p-2 me-5 pe-5">
          {heardFromOptions.map((dayOption) => (
            <div className="col-2">
              <input
                className="form-check-input"
                type="radio"
                checked={formik.values.heardFrom === dayOption.value}
                onChange={() => {
                  formik.setFieldValue("heardFrom", dayOption.value);
                }}
                name="heardFrom"
                id={dayOption.value}
              />
              <label
                className="ms-2 form-check-label"
                htmlFor={dayOption.value}
              >
                {dayOption.label}
              </label>
            </div>
          ))}

          <ErrorMessage name="heardFrom" />
        </div>
      </>
    );
  };

  const AdditionalInfo = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">Additional Information</h4>
        <div className="row p-2">
          <div className="col">
            <InputField
              label=""
              type="number"
              placeholder="Enter number of bedrooms"
              name="numberOfBedrooms"
              value={formik.values.numberOfBedrooms}
              onChange={formik.handleChange}
            />
            <ErrorMessage name="numberOfBedrooms" />
          </div>
          <div className="col">
            <InputField
              label=""
              type="number"
              placeholder="Enter number of bathrooms"
              name="numberOfBathrooms"
              value={formik.values.numberOfBathrooms}
              onChange={formik.handleChange}
            />
            <ErrorMessage name="numberOfBathrooms" />
          </div>
        </div>
      </>
    );
  };

  const UserData = () => {
    return (
      <>
        <h4 className="txt-bold mt-3">Your Details*</h4>
        <div className="row p-2 me-5 pe-5">
          <div className="row mt-3">
            <div className="col">
              <InputField
                label="First name"
                value={formik.values.userData.firstName}
                placeholder="Enter first name"
                name="userData.firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="userData.firstName" />
            </div>
            <div className="col">
              <InputField
                value={formik.values.userData.lastName}
                label="Last name"
                placeholder="Enter last name"
                name="userData.lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="userData.lastName" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <InputField
                label="Email address"
                value={formik.values.userData.email}
                placeholder="Enter email address"
                type="email"
                name="userData.email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="userData.email" />
            </div>
            <div className="col">
              <InputField
                value={formik.values.userData.phoneNumber}
                label="Phone number"
                placeholder="Enter phone number"
                name="userData.phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ErrorMessage name="userData.phoneNumber" />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col">
              <InputField
                label="Street 1"
                placeholder="Enter street 1"
                name="userData.address.street1"
                helperComponent={
                  <ErrorMessage name="userData.address.street1" />
                }
                value={formik.values.userData.address?.street1 || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col">
              <InputField
                label="Street 2"
                placeholder="Enter street 2"
                name="userData.address.street2"
                helperComponent={
                  <ErrorMessage name="userData.address.street2" />
                }
                value={formik.values.userData?.address?.street2 || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col">
              <InputField
                label="City"
                placeholder="Enter city"
                name="userData.address.city"
                value={formik.values.userData?.address?.city}
                helperComponent={<ErrorMessage name="userData.address.city" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col">
              <SelectField
                label="State"
                name="userData.address.state"
                options={statesOption}
                helperComponent={<ErrorMessage name="userData.address.state" />}
                value={statesOption.find(
                  (option) =>
                    option.value === formik.values.userData?.address?.state
                )}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue(
                    "userData.address.state",
                    selectedOption.value
                  );
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
                name="userData.address.postalCode"
                value={formik.values.userData?.address?.postalCode || ""}
                helperComponent={
                  <ErrorMessage name="userData.address.postalCode" />
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col">
              <SelectField
                label="Country"
                name="userData.address.country"
                options={countriesOption}
                helperComponent={
                  <ErrorMessage name="userData.address.country" />
                }
                value={countriesOption.find(
                  (option) =>
                    option.value === formik.values.userData?.address?.country
                )}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue(
                    "userData.address.country",
                    selectedOption.value
                  );
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ReadyToBook = () => {
    const [sendMeEmailOpen, setSendMeEmailOpen] = useState(false);
    const [showMultipleOptions, setShowMultipleOptions] = useState(false);

    return (
      <div className="card bg-light-grey p-5">
        <h4 className="txt-bold text-center">
          Ready to book or just need a quote?
        </h4>
        <div className="row p-4 ms-5 me-5">
          <div
            className={`col bg-light-blue text-center card hover-card m-2 ms-5`}
            onClick={() => {
              setSendMeEmailOpen(true);
              setShowMultipleOptions(false);
            }}
          >
            Email me a Quote
          </div>
          <div
            className={`col bg-orange text-center card hover-card m-2 me-5`}
            onClick={() => {
              setShowMultipleOptions(true);

              setSendMeEmailOpen(false);
            }}
          >
            BOOK NOW
          </div>

          {showMultipleOptions ? (
            <>
              <div className="hr-orange mb-4 mt-4"></div>
              <AdditionalInfo />

              <div className="hr-orange mb-4 mt-2"></div>
              <StartDate />

              <div className="hr-orange mb-4 mt-2"></div>
              <UserData />

              <div className="hr-orange mb-4 mt-2"></div>
              <HeardFrom />
              <SpecialRequirements />

              <div>
                <button className="btn btn-primary mt-3">
                  BOOK NOW
                </button>
              </div>
            </>
          ) : null}

          <Modal
            isOpen={sendMeEmailOpen}
            onRequestClose={() => setSendMeEmailOpen(false)}
          >
            <div className="p-2">
              <div className="p-5 m-5">
                <div className="txt-light-grey text-center ms-5 me-5">
                  Please enter your name and email below
                </div>
                <div className="txt-light-grey text-center ms-5 me-5">
                  so we can can email you a copy of the quote
                </div>
                <div className="ms-5 me-5">
                  <InputField label="" placeholder="First Name" />
                  <InputField label="" placeholder="Last Name" />
                  <InputField label="" placeholder="Email" />
                </div>
              </div>
              <button className="btn btn-primary mb-2 float-end">SUBMIT</button>
            </div>
          </Modal>
        </div>
      </div>
    );
  };

  const WeeklyFortnightly = () => {
    return (
      <>
        <div className="hr-orange mb-4 mt-2"></div>
        <CleaningFrequency />

        <div className="hr-orange mb-4 mt-2"></div>
        <CleaningHour />

        <div className="hr-orange mb-4 mt-2"></div>
        <NumberOfDaysPerWeek />

        <CleaningDays />

        <StartDate />

        <div className="hr-orange mb-4 mt-2"></div>
        <HeardFrom />

        <SpecialRequirements />

        <UserData />

        <div className="mt-4 mb-4">
          <button type="submit" className="btn btn-primary">
            BOOK NOW
          </button>
        </div>
      </>
    );
  };

  const MovingOutSpringClean = () => {
    return (
      <>
        <div className="hr-orange mb-4 mt-2"></div>
        <ServiceType />
        <div className="hr-orange mb-4 mt-2"></div>
        <CleaningHour />
        <AdditionalInfo />
        <div className="hr-orange mb-4 mt-2"></div>
        <StartDate />
        <div className="hr-orange mb-4 mt-2"></div>
        <HeardFrom />
        <SpecialRequirements />
        <UserData />
        <div className="mt-4 mb-4">
          <button type="submit" className="btn btn-primary">
            BOOK NOW
          </button>
        </div>
      </>
    );
  };

  const AgedCareDisability = () => {
    return (
      <>
        <div className="hr-orange mb-4 mt-2"></div>
        <BestDescribeYou />

        <div className="hr-orange mb-4 mt-2"></div>
        <NDISService />

        <div className="hr-orange mb-4 mt-2"></div>

        <AgedCareDisabilityDetail />
      </>
    );
  };

  const AgedCareDisabilityServiceDetails = () => {
    switch (formik.values.agedCareDisabilityCleaningService) {
      case "Weekly/Fortnightly":
        return (
          <>
            <div className="hr-orange mb-4 mt-2"></div>
            <CleaningFrequency />

            <div className="hr-orange mb-4 mt-2"></div>
            <CleaningHour />
          </>
        );
      case "Moving Out/Spring Clean":
        return (
          <>
            <div className="hr-orange mb-4 mt-2"></div>
            <ServiceType />

            <div className="hr-orange mb-4 mt-2"></div>
            <CleaningHour />

            <AdditionalInfo />

            <div className="hr-orange mb-4 mt-2"></div>
            <ReadyToBook />
          </>
        );
      default:
        return null;
    }
  };

  const AgedCareDisabilityServiceType = () => {
    const agedCareDisabilityServices = [
      {
        name: "Weekly/Fortnightly",
        description:
          "Book an ongoing weekly or fortnightly clean and never worry about the general chores again!",
        hourlyRate: 130,
        offer: { rate: 110, hours: 2 },
      },
      {
        name: "Moving Out/Spring Clean",
        description:
          "Our spring clean takes the hard work out of a big cleaning job by using our expert one-off cleaners.",
        hourlyRate: 160,
        offer: { rate: 235, hours: 3 },
      },
    ];

    return (
      <>
        <h4 className="txt-bold">Select a cleaning service</h4>
        <div className="row p-2">
          {agedCareDisabilityServices.map((service: IService) => (
            <div
              onClick={() => {
                formik.setFieldValue(
                  "agedCareDisabilityCleaningService",
                  service.name
                );
              }}
              key={service.name}
              className={`card hover-card m-2 col text-center ${
                formik.values.agedCareDisabilityCleaningService === service.name
                  ? "border-orange-color"
                  : ""
              }`}
            >
              <h5 className="txt-bold p-4">{service.name}</h5>
              <div className="hr-orange mb-5 mt-3"></div>
              <p className="mb-5 p-3 lh-lg">{service.description}</p>
              <div className="mt-3">
                {service.offer ? (
                  <>
                    <span className="txt-orange txt-l txt-bold">
                      {`$${service.offer.rate} `}
                    </span>
                    <label className="float-left">
                      for
                      <span className="txt-bold">
                        {` ${service.offer.hours || 1} `}
                      </span>
                      hours
                    </label>
                  </>
                ) : (
                  ""
                )}
                <div>
                  {service.hourlyRate ? (
                    `$${service.hourlyRate}/hour${
                      service.offer ? " thereafter" : ""
                    }`
                  ) : (
                    <div className="txt-orange m-3 p-1">
                      Specific rates apply
                    </div>
                  )}
                </div>
              </div>
              <div className="m-3">
                <button
                  type="button"
                  className={`btn btn-full p-2 txt-bold ${
                    formik.values.agedCareDisabilityCleaningService ===
                    service.name
                      ? "btn-primary"
                      : "bg-grey"
                  }`}
                >
                  {formik.values.agedCareDisabilityCleaningService ===
                  service.name
                    ? "UNSELECT"
                    : "SELECT"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <ErrorMessage name="agedCareDisabilityCleaningService" />

        <AgedCareDisabilityServiceDetails />
      </>
    );
  };

  const AgedCareDisabilityDetail = () => {
    switch (formik.values.isNDIS) {
      case true:
        return (
          <>
            <div className="hr-orange mb-4 mt-2"></div>
            <CleaningFrequency />

            <div className="hr-orange mb-4 mt-2"></div>
            <CleaningHour />
          </>
        );
      case false:
        return (
          <>
            <div className="hr-orange mb-4 mt-2"></div>
            <AgedCareDisabilityServiceType />
          </>
        );
      default:
        return null;
    }
  };

  const ServiceDetails = () => {
    switch (selectedService?.name) {
      case "Weekly/Fortnightly":
        return <WeeklyFortnightly />;
      case "Moving Out/Spring Clean":
        return <MovingOutSpringClean />;
      case "Aged Care/Disability":
        return <AgedCareDisability />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="main-container">
        <form onSubmit={formik.handleSubmit}>
          <FormikProvider value={formik}>
            <div className="row m-5 ps-5 pe-5">
              <div className="col-8 card border-orange-color ms-5 me-3 p-4 pt-5">
                <h4 className="txt-bold">Enter your suburb/postcode</h4>
                <SelectField
                  options={postalCodeOptions}
                  handleChange={(selectedOption: IOption) => {
                    setSelectedServiceArea(
                      serviceAreas.find(
                        (serviceArea) =>
                          serviceArea.area.postalCode === selectedOption.value
                      )
                    );
                    setSelectedService(undefined);
                    formik.setFieldValue(
                      "postalCode",
                      selectedOption.value.toString()
                    );

                    formik.setFieldValue(
                      "userData.address.postalCode",
                      selectedOption.value.toString()
                    );
                    formik.setFieldValue(
                      "userData.address.city",
                      selectedOption.label.toString()
                    );
                  }}
                  name="postalCode"
                  handleBlur={formik.handleBlur}
                />
                <ErrorMessage name="postalCode" />

                <ServiceSelectionCards />
              </div>
              <div className="col card me-5 border-orange-color p-4 pt-5">
                <h5 className="txt-bold">Your booking summary</h5>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className="">Hours</div>
                  </div>
                  <div className="col p-2 ps-4 text-end">
                    <div className="">{formik.values?.cleaningHour}</div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className="">Clean Type</div>
                  </div>
                  <div className="col p-2 ps-4 text-end">
                    <div className="">{selectedService?.name}</div>
                  </div>
                </div>
                <div className="row mt-2 border-bottom pb-2 mb-2">
                  <div className="col p-2 ps-4">
                    <div className="">Where</div>
                  </div>
                  <div className="col p-2 ps-4 text-end">
                    <div className="">{selectedServiceArea?.area?.name}</div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col p-2 ps-4">
                    <div className=""></div>
                  </div>
                  <div className="col p-2 ps-4 pe-4">
                    <div className="float-end">
                      <div className="txt-bold text-end">YOUR TOTAL</div>
                      <h2 className="txt-orange txt-bold text-end">
                        $
                        {formik.values?.cleaningHour &&
                        selectedService?.hourlyRate
                          ? formik.values?.cleaningHour *
                            selectedService?.hourlyRate
                          : 0}
                      </h2>
                      <div className="txt-orange">
                        * Weekend rates will apply
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormikProvider>
        </form>
      </div>
    </div>
  );
};

export default Booking;
