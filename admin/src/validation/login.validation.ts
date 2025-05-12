import * as yup from 'yup'
import validationConfig from './validationConfig'
import regex from 'src/regex'

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required()
    .email(validationConfig.error.email.format)
    .label('Email'),
  // .test('preventParticularDomain', validationConfig.error.email.domainValidation, (value: string) => {
  //   if (!value) return false

  //   return !!value && regex.emailRegex.test(value)
  // }),
  password: yup.string().min(5).required().label('Password')
})
