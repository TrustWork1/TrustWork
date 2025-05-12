import * as yup from 'yup'

export const packageCreateValidationSchema = () => {
  return yup.object().shape({
    plan_name: yup
      .string()
      .required('Plan name is required')
      .matches(/^\S+$/, 'No blank spaces allowed in plan name'),
    
    description: yup
      .string()
      .required('Description is required')
      .matches(/^\S+$/, 'No blank spaces allowed in description'),
    
    price: yup
      .string()
      .required('Price is required')
      .matches(/^\d+(\.\d+)?$/, 'Only positive numbers and decimals are allowed')
      .test('is-positive', 'Price cannot be negative', function(value) {
        return value ? parseFloat(value) >= 0 : false;
      })
      .matches(/^\S+$/, 'No blank spaces allowed in price'),
    
    
    billing_cycle: yup
      .string()
      .required('Billing cycle is required')
      .matches(/^\S+$/, 'No blank spaces allowed in billing cycle'),
    
    features: yup
      .array()
      .of(
        yup.object().shape({
          features: yup
            .string()
            .required('Feature is required')
            .matches(/^\S+$/, 'No blank spaces allowed in feature'),
          is_active: yup.string()
        })
      )
      .min(1, 'At least one feature is required')
  });
};
const packageCreateSchemaType = packageCreateValidationSchema()
export type TPackageCreateSchemaInferType = yup.InferType<typeof packageCreateSchemaType>


export const packageUpdateValidationSchema = () => {
  return yup.object().shape({
    plan_name: yup
      .string()
      .required('Plan name is required')
      .matches(/^\S+$/, 'No blank spaces allowed in plan name'),
    
    description: yup
      .string()
      .required('Description is required')
      .matches(/^\S+$/, 'No blank spaces allowed in description'),
    
    price: yup
      .string()
      .required('Price is required')
      .matches(/^\d+(\.\d+)?$/, 'Only positive numbers and decimals are allowed')
      .test('is-positive', 'Price cannot be negative', function(value) {
        return value ? parseFloat(value) >= 0 : false;
      })
      .matches(/^\S+$/, 'No blank spaces allowed in price'),
    
    
    billing_cycle: yup
      .string()
      .required('Billing cycle is required')
      .matches(/^\S+$/, 'No blank spaces allowed in billing cycle'),
    
    features: yup
      .array()
      .of(
        yup.object().shape({
          features: yup
            .string()
            .required('Feature is required')
            .matches(/^\S+$/, 'No blank spaces allowed in feature'),
          is_active: yup.string()
        })
      )
      .min(1, 'At least one feature is required')
  });
};
const packageUpdateSchemaType = packageUpdateValidationSchema()
export type TPackageUpdateSchemaInferType = yup.InferType<typeof packageUpdateSchemaType>