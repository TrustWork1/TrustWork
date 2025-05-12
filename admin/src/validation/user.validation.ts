import { showErrors } from 'src/utils/validationError'
import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const craeteUserSchema = yup.object().shape({
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
  name: yup
    .string()
    .min(3, obj => showErrors('Name', obj.value.length, obj.min))
    .required('Name is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
  phoneNumber: yup
    .number()
    .typeError('Phone Number must be a number')
    .positive('Phone Number must be a positive number')
    .integer('Phone Number must be an integer')
    .required('Phone Number is required'),
  branch: yup.string().required('Branch is required'),
  contactPerson: yup.string().required('Contact Person is required'),
  contactPersonPhone: yup.string().required('Contact Person Phone is required'),
  address: yup.string().required('Address is required'),
  houseNo: yup.string().required('House No is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  landmark: yup.string().required('Landmark is required'),
  zipCode: yup
    .number()
    .typeError('Zip Code must be a number')
    .positive('Zip Code must be a positive number')
    .integer('Zip Code must be an integer')
    .required('Zip Code is required')
})
