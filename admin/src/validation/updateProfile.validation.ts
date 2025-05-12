import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'
import { IMAGE_ACCEPT } from 'src/configs/constant'

export const updateProfileSchema = yup.object().shape({
  profile_image: yup
    .mixed()
    .optional()
    .test('fileFormat', validationConfig?.error?.invalidImageFileFormat, (value: any) => {
      if (!value) {
        return true
      }

      if (value instanceof File && value.type) {
        return IMAGE_ACCEPT.split(',').includes(value.type)
      }

      return false
    }),
  full_name: yup
    .string()
    .trim()
    .required()
    .label('Full Name')
    .min(3, 'Name must be at least 3 characters')
    .max(25, 'Name must be at most 25 characters'),
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
    .trim()
    .required()
    .label('Phone Number')
    .matches(/^[+]?[\d]+$/, 'Phone Number must be a valid number')
    .min(10, 'Phone number must be at least 10 characters')
    .max(12, 'Phone number must be at most 12 characters'),
  address: yup.string().trim().required().label('Address'),
  street: yup.string().trim().nullable(),
  city: yup.string().trim().required().label('City'),
  state: yup.string().trim().required().label('State'),
  zip_code: yup
    .string()
    .required()
    .label('Zip Code')
    .min(4, 'Zip Code must be at least 4 characters')
    .max(8, 'Zip Code must be at most 8 characters'),
  country: yup.string().required().label('Country'),
  latitude: yup.string().required().label('Latitude'),
  longitude: yup.string().required().label('Longitude')
})
