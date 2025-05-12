import * as yup from 'yup'

export const aboutInfoValidationSchema = yup.object({
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

  image1: yup.mixed().required('Image is required'),
  image2: yup.mixed().required('Image is required')
})

export type AboutInfoValidationSchemaType = yup.InferType<typeof aboutInfoValidationSchema>


export const whyTrustUsValidationSchema = yup.object({
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
  mission_title: yup
    .string()
    .trim()
    .required('Title is required')
    .test('no-leading-space', 'Title cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  mission_description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
  vision_title: yup
    .string()
    .trim()
    .required('Title is required')
    .test('no-leading-space', 'Title cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  vision_description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  image: yup.mixed().required('Image is required'),
  section_image: yup.mixed().required('Image is required')
})

export type WhyTrsutUsValidationSchemaType = yup.InferType<typeof whyTrustUsValidationSchema>