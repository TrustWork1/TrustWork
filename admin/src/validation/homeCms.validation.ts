import * as yup from 'yup'

export const appInfoValidationSchema = yup.object({
  tagline: yup
    .string()
    .trim()
    .required('Tagline is required')
    .test('no-leading-space', 'Tagline cannot start with a space', value => {
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

  playstore_link: yup.string().trim().required('Play Store Link is required').url('Must be a valid URL'),

  appstore_link: yup.string().trim().required('App Store Link is required').url('Must be a valid URL'),

  image: yup.mixed().required('Image is required')
})

export type AppInfoValidationSchemaType = yup.InferType<typeof appInfoValidationSchema>

export const featuresInfoValidationSchema = yup.object({
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
  features: yup.array().of(
    yup.object().shape({
      displayIndex: yup.number().optional(),
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
      icon: yup.mixed().required('Icon is required')
    })
  )
})

// export type AppFeaturesValidationSchemaType = yup.InferType<typeof featuresInfoValidationSchema>


export const appFeatureContentValidationSchema = yup.object({
  header: yup
    .string()
    .trim()
    .required('Header is required')
    .test('no-leading-space', 'Header cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
})

export type AppFeatureContentValidationSchemaType = yup.InferType<typeof appFeatureContentValidationSchema>


export const howItWorksContentValidationSchema = yup.object({
  header: yup
    .string()
    .trim()
    .required('Header is required')
    .test('no-leading-space', 'Header cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  image: yup.mixed().required('Image is required'),
})

export type HowItWorksContentValidationSchemaType = yup.InferType<typeof howItWorksContentValidationSchema>


export const referralContentValidationSchema = yup.object({
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

  button_title: yup.string().trim().required('Button Title is required'),

  button_link: yup.string().trim().required('Button Link is required').url('Must be a valid URL'),

  image: yup.mixed().required('Image is required')
})

export type ReferralContentValidationSchemaType = yup.InferType<typeof referralContentValidationSchema>


export const downloadAppValidationSchema = yup.object({
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

  playstore_link: yup.string().trim().required('Play Store Link is required').url('Must be a valid URL'),

  appstore_link: yup.string().trim().required('App Store Link is required').url('Must be a valid URL'),

  image: yup.mixed().required('Image is required')
})

export type DownloadAppValidationSchemaType = yup.InferType<typeof downloadAppValidationSchema>