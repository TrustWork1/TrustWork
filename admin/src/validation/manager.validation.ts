import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const createSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters')
    .max(15, 'First name must be at least 15 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters')
    .max(15, 'Last name must be at least 15 characters'),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .email(validationConfig.error.email.format)
    .label('Email'),
  // .test('preventParticularDomain', validationConfig.error.email.domainValidation, (value: string) => {
  //   if (!value) return false

  //   return !!value && regex.emailRegex.test(value)
  // }),
  phone: yup
    .string()
    .required('Phone Number is required')
    .matches(/^[+]?[\d]+$/, 'Phone Number must be a valid number')
    .min(10, 'Phone number must be at least 10 characters')
    .max(12, 'Phone number must be at most 12 characters'),

  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
  permissions: yup
    .array()
    .of(yup.string().required('Each permission must be a string'))
    .min(1, 'At least one permission is required')
    .required('Permissions are required')
})

export const updateSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(3, 'First name must be at least 3 characters')
    .max(15, 'First name must be at least 15 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(3, 'Last name must be at least 3 characters')
    .max(15, 'Last name must be at least 15 characters'),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .email(validationConfig.error.email.format)
    .label('Email'),
  // .test('preventParticularDomain', validationConfig.error.email.domainValidation, (value: string) => {
  //   if (!value) return false

  //   return !!value && regex.emailRegex.test(value)
  // }),
  phone: yup
    .string()
    .required('Phone Number is required')
    .matches(/^[+]?[\d]+$/, 'Phone Number must be a valid number')
    .min(10, 'Phone number must be at least 10 characters')
    .max(12, 'Phone number must be at most 12 characters'),
  permissions: yup
    .array()
    .of(yup.string().required('Each permission must be a string'))
    .min(1, 'At least one permission is required')
    .required('Permissions are required')
})
