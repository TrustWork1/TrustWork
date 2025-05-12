import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const changePasswordSchema = yup.object().shape({
  current_password: yup.string().required().label("Current password"),
  new_password: yup
    .string()
    .nullable()
    .required()
    .label("New password")
    .min(8, validationConfig?.error?.passwordLength)
    .max(15, validationConfig?.error?.passwordLength)
    .test(
      "not-one-of",
      validationConfig?.error?.passowrdNotConfirmMtch,
      function (value) {
        const currentPassword = this.resolve(yup.ref("current_password"));
        if (!value || value.length === 0) {
          return true;
        }

        return value !== currentPassword;
      }
    )
    .matches(regex.password, validationConfig?.error?.passwordFormat),
  confirm_password: yup
    .string()
    .required()
    .oneOf(
      [yup.ref("new_password")],
      validationConfig?.error?.passowrdConfirmMtch
    )
    .label("Confirm password")
})
