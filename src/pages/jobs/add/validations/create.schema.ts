import * as Yup from 'yup';

export const CreateSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required').min(3, 'Job title seems to be too short'),
  instruction: Yup.string().required('Job instruction is required'),
  jobFor: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string()
  }).required('Please select a client'),
  jobType: Yup.string().required('Please select a service type'),
  jobRequest: Yup.string().notRequired(),
  property: Yup.string().notRequired().nullable(),
  lineItems: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      quantity: Yup.number().min(1),
      unitPrice: Yup.number(),
      total: Yup.number().notRequired()
    })
  )
});
