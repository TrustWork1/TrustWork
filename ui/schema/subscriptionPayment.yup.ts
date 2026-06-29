import {
  cameroonMobileMoneyPhoneError,
  normalizeCameroonMobileMoneyPhone,
} from '@/lib/functions/subscriptionPayment.lib';
import * as yup from 'yup';

export const mobileMoneyPaymentSchema = yup.object({
  full_name: yup.string().trim(),
  phone: yup
    .string()
    .trim()
    .test('cameroon-mobile-money-phone', cameroonMobileMoneyPhoneError, value =>
      value ? Boolean(normalizeCameroonMobileMoneyPhone(value)) : true
    )
    .required('Phone number is required'),
});

export type TMobileMoneyPaymentForm = yup.InferType<typeof mobileMoneyPaymentSchema>;

export const stripePaymentSchema = yup.object({
  full_name: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().email('Invalid email').required('Email is required'),
});

export type TStripePaymentForm = yup.InferType<typeof stripePaymentSchema>;
