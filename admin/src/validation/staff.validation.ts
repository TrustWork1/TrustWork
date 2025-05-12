import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const validationSchema = (mode: 'add' | 'edit') =>
  yup.object().shape({
    staff_id: mode === 'edit' ? yup.string().required('Staff ID is required') : yup.string().optional(),
    full_name: yup.string().required('Full Name is required'),
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
    phone: yup.string().required('Phone is required'),
    password: mode === 'add' ? yup.string().required('Password is required') : yup.string().optional(),
    confirm_password:
      mode === 'add' ? yup.string().oneOf([yup.ref('password'), ''], 'Passwords must match') : yup.string().optional(),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    landmark: yup.string().optional(),
    zipcode: yup.string().required('Zipcode is required'),
    country: yup.string().required('Country is required'),
    dob: yup.string().optional(),
    start_time: yup
      .string()
      .required('Start Time is required')
      .matches(/^\d{2}:\d{2}$/, 'Start Time must be in HH:MM format'),
    end_time: yup
      .string()
      .required('End Time is required')
      .matches(/^\d{2}:\d{2}$/, 'End Time must be in HH:MM format'),
    shift_id: yup.string().required('Shift ID is required'),
    service_ids: yup.array().of(yup.string().required()).required('At least one service ID is required'),
    staff_complieation:
      mode === 'add'
        ? yup.array().of(
          yup.object().shape({
            staffcompliance_id: yup.string().required(),
            document_type_id: yup.string().required('Document Type is required'),
            file: yup.mixed().required('File is required'),
            isVerified: yup.boolean().required('Verification status is required')
          })
        )
        : yup.array().optional()
  })
