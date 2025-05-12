import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const resetPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .required()
    .min(8, validationConfig?.error?.passwordLength)
    .max(15, validationConfig?.error?.passwordLength)
    .matches(regex.password, validationConfig?.error?.passwordFormat)
    .label("Password"),

  confirm_password: yup
    .string()
    .required()
    .oneOf(
      [yup.ref("new_password")],
      validationConfig?.error?.passowrdConfirmMtch
    )
    .label("Confirm Password")

})
