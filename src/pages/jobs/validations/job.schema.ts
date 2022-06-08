import * as Yup from 'yup';

export const JobFormSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required').min(3, 'Job title seems to be too short'),
  instruction: Yup.string().required('Job instruction is required'),
  jobFor: Yup.object().shape({
    label: Yup.string().required('Please select a client'),
    value: Yup.string()
  }),
  jobType: Yup.string().required('Please select a service type'),
  jobRequest: Yup.string().notRequired(),
  property: Yup.string().notRequired().nullable(),
  lineItems: Yup.array().of(
    Yup.object().shape({
      name: Yup.object().shape({
        label: Yup.string().required('Write or search a line item name'),
        value: Yup.string()
      }).required(),
      description: Yup.string(),
      quantity: Yup.number(),
      unitPrice: Yup.number(),
      total: Yup.number().notRequired()
    })
  )
});
