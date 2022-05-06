import * as Yup from 'yup';

export const CreateSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required').min(3, 'Job title seems to be too short'),
  instruction: Yup.string(),
  jobFor: Yup.string().required('Please select a client'),
  jobRequest: Yup.string().notRequired(),
  property: Yup.string().notRequired(),
  lineItems: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Please select a line item.'),
      description: Yup.string(),
      quantity: Yup.number().min(1),
      unitPrice: Yup.number(),
      total: Yup.number().notRequired()
    })
  )
});
