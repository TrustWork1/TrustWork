import * as yup from 'yup'

export const termsPolicyValidationSchema = yup.object({
  section_header: yup
    .string()
    .trim()
    .required('Header is required')
    .test('no-leading-space', 'Title cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  section_description: yup
    .string()
    .trim()
    .required('Description is required')
    .test('no-leading-space', 'Description cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),

  details: yup
    .string()
    .trim()
    .required('Content is required')
    .test('no-leading-space', 'Content cannot start with a space', value => {
      return value ? !value.startsWith(' ') : true
    }),
})

export type TermsPolicyValidationSchemaType = yup.InferType<typeof termsPolicyValidationSchema>

