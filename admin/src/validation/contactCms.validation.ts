import * as yup from 'yup'
import validationConfig from './validationConfig'

export const contactInfoValidationSchema = yup.object({
  section_header: yup
    .string()
    .trim()
    .required('Section Header is required')
    .test('no-leading-space', 'Section Header cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  section_description: yup
    .string()
    .trim()
    .required('Section Description  is required')
    .test('no-leading-space', 'Section Description  cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .test('no-leading-space', 'Title cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  call_center_number: yup
      .string()
      .trim()
      .required('Call Center Number is required'),
  email: yup
      .string()
      .trim()
      .lowercase()
      .required()
      .email(validationConfig.error.email.format),
  location: yup
    .string()
    .trim()
    .required('Location is required')
    .test('no-leading-space', 'Location cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  facebook_url: yup.string().trim().required('Facebook Link is required').url('Must be a valid URL'),
  x_url: yup.string().trim().required('X-Platform Link is required').url('Must be a valid URL'),
  linkedin_url: yup.string().trim().required('LinkedIn Link is required').url('Must be a valid URL'),
  youtube_url: yup.string().trim().required('Youtube Link is required').url('Must be a valid URL'),
  map_url: yup.string().trim().required('Map Link is required'),
  longitude: yup
    .string()
    .trim()
    .required('Longitude is required'),
  latitude: yup
    .string()
    .trim()
    .required('Latitude is required'),
  get_in_touch_title: yup
    .string()
    .trim()
    .required('Get In Touch title is required')
    .test('no-leading-space', 'Title cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  get_in_touch_description: yup
    .string()
    .trim()
    .required('Get In Touch description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
})

export type ContactInfoValidationSchemaType = yup.InferType<typeof contactInfoValidationSchema>