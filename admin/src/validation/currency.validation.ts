import * as yup from 'yup'

export const currencyValidationSchema = yup.object({
  xaf_currency: yup
    .string()
    .trim()
    .required('Currency is required')
    .matches(/^\d+(\.\d+)?$/, 'Currency must be a valid number')
})

export type CurrencyValidationSchemaType = yup.InferType<typeof currencyValidationSchema>
