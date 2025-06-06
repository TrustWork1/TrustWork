import { IMAGE_ACCEPT } from 'src/configs/constant'
import * as yup from 'yup'

export const appReferralCreateValidationSchema = () =>
  yup.object().shape({
    content: yup
      .string()
      .trim()
      .required()
      .label(' Description')
      .min(3, ' Description must be at least 3 characters')
      .max(250, ' Description must be at most 250 characters'),
    imageUrl: yup.string().optional(),
    image: yup
      .mixed()
      // .optional()
      .label('Icon')
      // .typeError('Icon must be valid')
      .when('imageUrl', {
        is: (value: string) => !value?.length,
        then: rule => rule.required().label('Icon')
      })
      .test('fileFormat', '"Please upload a valid image file (PNG, GIF, JPEG, JPG, or TIFF)"', (value: any) => {
        if (!value) {
          return true
        }

        return value && IMAGE_ACCEPT?.split(',').includes(value.type)
      })
  })
const appCreateSchemaType = appReferralCreateValidationSchema()
export type TAppFeatureCreateSchemaInferType = yup.InferType<typeof appCreateSchemaType>

export const appReferralUpdateValidationSchema = () =>
  yup.object().shape({
    content: yup
      .string()
      .trim()
      .required()
      .label('Feature Description')
      .min(3, 'Feature description must be at least 3 characters')
      .max(250, 'Feature description must be at most 250 characters'),
    imageUrl: yup.string().optional(),
    image: yup
      .mixed()
      // .optional()
      .label('Icon')
      // .typeError('Icon must be valid')
      .when('imageUrl', {
        is: (value: string) => !value?.length,
        then: rule => rule.required().label('Icon')
      })
      .test('fileFormat', '"Please upload a valid image file (PNG, GIF, JPEG, JPG, or TIFF)"', (value: any) => {
        if (!value) {
          return true
        }

        return value && IMAGE_ACCEPT?.split(',').includes(value.type)
      })
  })
const appUpdateSchemaType = appReferralUpdateValidationSchema()
export type TAppFeatureUpdateSchemaInferType = yup.InferType<typeof appUpdateSchemaType>
