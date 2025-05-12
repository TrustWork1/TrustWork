import * as yup from 'yup'

export const membershipCreateValidationSchema = () =>
  yup.object().shape({
    user_type: yup.string().trim().optional().label('User Type'),
    plan_name: yup.string().trim().required().label('Plan Name'),
    plan_price: yup.string().label('Plan Price').required().typeError("Please check the value"),
    plan_details: yup
      .string()
      .trim()
      .required()
      .label('Plan Benefits')
      .min(3, 'Plan benefits must be at least 3 characters')
      .max(1000, 'Plan benefits must be at most 1000 characters'),
    plan_duration: yup.string().max(2).label('Plan Timeline').required().typeError("Please check the value"),

    // plan_duration: yup
    // .number()
    // .required('Timeline is required')
    // .typeError('Timeline must be a number')
    // .positive('Timeline must be a positive number')
    // .integer('Timeline must be an integer')
    // .max(99, 'Timeline cannot be more than 2 digit')
    // .transform((value) => Math.floor(value)),


    plan_hrs_week: yup.string().trim().required().default('Monthly').label('Plan Hrs/Week'),
  })
const membershipCreateSchemaType = membershipCreateValidationSchema();
export type TMembershipCreateSchemaInferType = yup.InferType<
  typeof membershipCreateSchemaType
>;

export const membershipUpdateValidationSchema = () =>
  yup.object().shape({
    user_type: yup.string().trim().optional().label('User Type'),
    plan_name: yup.string().trim().required().label('Plan Name'),
    plan_price: yup.string().label('Plan Price').required().typeError("Please check the value"),
    plan_details: yup
      .string()
      .trim()
      .required()
      .label('Plan Benefits')
      .min(3, 'Plan benefits must be at least 3 characters')
      .max(1000, 'Plan benefits must be at most 1000 characters'),
    // plan_duration: yup.string().max(2).label('Plan Timeline').required().typeError("Please check the value"),
    // plan_hrs_week: yup.string().trim().required().default('Monthly').label('Plan Hrs/Week'),
  })
const membershipUpdateSchemaType = membershipUpdateValidationSchema();
export type TMembershipUpdateSchemaInferType = yup.InferType<
  typeof membershipUpdateSchemaType
>;
