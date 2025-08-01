import * as yup from 'yup'

export const packageCreateValidationSchema = () => {
  return yup.object().shape({
    plan_name: yup.string().required('Plan name is required').trim(),

    description: yup.string().trim().required('Description is required'),

    price: yup
      .string()
      .required('Price is required')
      .matches(/^\d+(\.\d+)?$/, 'Only positive numbers and decimals are allowed')
      .test('is-positive', 'Price cannot be negative', function (value) {
        return value ? parseFloat(value) >= 0 : false
      })
      .trim(),

    billing_cycle: yup.string().trim().required('Billing cycle is required'),

    features: yup
      .array()
      .of(
        yup.object().shape({
          features: yup.string().required('Feature is required').trim(),
          is_active: yup.string()
        })
      )
      .min(1, 'At least one feature is required')
  })
}
const packageCreateSchemaType = packageCreateValidationSchema()
export type TPackageCreateSchemaInferType = yup.InferType<typeof packageCreateSchemaType>

export const packageUpdateValidationSchema = () => {
  return yup.object().shape({
    plan_name: yup.string().required('Plan name is required').trim(),

    description: yup.string().required('Description is required').trim(),

    price: yup
      .string()
      .trim()
      .required('Price is required')
      .matches(/^\d+(\.\d+)?$/, 'Only positive numbers and decimals are allowed')
      .test('is-positive', 'Price cannot be negative', function (value) {
        return value ? parseFloat(value) >= 0 : false
      }),

    billing_cycle: yup.string().trim().required('Billing cycle is required'),

    features: yup
      .array()
      .of(
        yup.object().shape({
          features: yup.string().required('Feature is required').trim(),
          is_active: yup.string().trim()
        })
      )
      .min(1, 'At least one feature is required'),
    is_popular: yup.string().trim().default('false')
  })
}
const packageUpdateSchemaType = packageUpdateValidationSchema()
export type TPackageUpdateSchemaInferType = yup.InferType<typeof packageUpdateSchemaType>
