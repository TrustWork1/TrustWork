import * as yup from 'yup';
import regex from '../lib/regex';

export const selectPlanQuerySchema = yup.object({
  full_name: yup
    .string()
    .trim()
    .matches(/^(?!\d+$)[a-zA-Z\s.'-]+$/, 'Name must only contain letters')
    .required('Full name is required'),
  email: yup.string().trim().email('Invalid email').required('Email is required'),
  subscription_frequency: yup.string().trim().required('Subscription Frequency is required'),
  amount: yup.string().trim().required('Amont is required'),
  phone: yup
    .string()
    .trim()
    .matches(regex.phoneRegex, 'Phone number must be 9–12 digits')
    .required('Phone number is required'),
});

export type SelectPlanQueryFormValues = yup.InferType<typeof selectPlanQuerySchema>;
