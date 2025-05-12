import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const providerCreateValidationSchema = () =>
  yup.object().shape({
    user_type: yup.string().optional().default('Service Provider'),
    full_name: yup
      .string()
      .trim()
      .required()
      .label('Full Name')
      .min(3, 'Name must be at least 3 characters')
      .max(25, 'Name must be at most 25 characters'),
    email: yup.string().trim().lowercase().email(validationConfig.error.email.format).label('Email').required(),
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
    street: yup.string().trim().optional().nullable(),
    city: yup.string().trim().required().label('City'),
    state: yup.string().trim().required().label('State'),
    // zip_code: yup
    //   .string()
    //   .required()
    //   .label('Zip Code')
    //   .min(4, 'Zip Code must be at least 4 characters')
    //   .max(8, 'Zip Code must be at most 8 characters'),
    zip_code: yup
      .string()
      .trim()
      .optional()
      .test({
        name: 'zip-length-validation',
        message: 'Zip Code must be between 4 and 8 characters',
        test: value => {
          if (!value) return true

          return value.length >= 4 && value.length <= 8
        }
      }),
    country: yup.string().trim().required().label('Country'),
    latitude: yup.string().trim().required().label('Latitude'),
    longitude: yup.string().trim().required().label('Longitude'),
    job_category: yup
      .array()
      .of(yup.number().required())
      .min(1, 'At least one job category selection is required')
      .required('At least one job category selection is required')
  })
const providerCreateSchemaType = providerCreateValidationSchema()
export type TProviderCreateSchemaInferType = yup.InferType<typeof providerCreateSchemaType>

export const providerUpdateValidationSchema = () =>
  yup.object().shape({
    user_type: yup.string().optional().default('Service Provider'),
    provider_id: yup.string().optional(),
    full_name: yup
      .string()
      .trim()
      .required()
      .label('Full Name')
      .min(3, 'Name must be at least 3 characters')
      .max(25, 'Name must be at most 25 characters'),
    email: yup.string().trim().lowercase().required().email(validationConfig.error.email.format).label('Email'),
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
    street: yup.string().trim().optional().nullable(),
    city: yup.string().trim().required().label('City'),
    state: yup.string().trim().required().label('State'),
    // zip_code: yup
    //   .string()
    //   .required()
    //   .label('Zip Code')
    //   .min(4, 'Zip Code must be at least 4 characters')
    //   .max(8, 'Zip Code must be at most 8 characters'),
    zip_code: yup
      .string()
      .trim()
      .optional()
      .test({
        name: 'zip-length-validation',
        message: 'Zip Code must be between 4 and 8 characters',
        test: value => {
          if (!value) return true

          return value.length >= 4 && value.length <= 8
        }
      }),
    country: yup.string().trim().required().label('Country'),
    latitude: yup.string().trim().required().label('Latitude'),
    longitude: yup.string().trim().required().label('Longitude'),
    job_category: yup
      .array()
      .of(yup.number().required())
      .min(1, 'At least one job category selection is required')
      .required('At least one job category selection is required')
  })
const providerUpdateSchemaType = providerUpdateValidationSchema()
export type TProviderUpdateSchemaInferType = yup.InferType<typeof providerUpdateSchemaType>
