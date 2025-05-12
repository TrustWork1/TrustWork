import * as yup from 'yup';

export const contactUsValidationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message should be at least 10 characters'),
});

export type TContactUsForm = yup.InferType<typeof contactUsValidationSchema>;
