import { IMAGE_ACCEPT } from 'src/configs/constant'
import * as yup from 'yup'

export const categoryCreateValidationSchema = () =>
  yup.object().shape({
    category_name: yup.string().trim().required().label('Category Name'),
    category_details: yup
      .string()
      .trim()
      .required()
      .label('Category Details')
      .min(3, 'Category details must be at least 3 characters')
      .max(250, 'Category details must be at most 250 characters'),
    imageUrl: yup.string().optional(),
    image: yup
      .mixed()
      // .optional()
      .label('Image')
      // .typeError('Image must be valid')
      .when('imageUrl', {
        is: (value: string) => !value?.length,
        then: rule => rule.required().label('Image')
      })
      .test('fileFormat', '"Please upload a valid image file (PNG, GIF, JPEG, JPG, or TIFF)"', (value: any) => {
        if (!value) {
          return true
        }

        return value && IMAGE_ACCEPT?.split(',').includes(value.type)
      })
  })
const categoryCreateSchemaType = categoryCreateValidationSchema()
export type TCategoryCreateSchemaInferType = yup.InferType<typeof categoryCreateSchemaType>

export const categoryUpdateValidationSchema = () =>
  yup.object().shape({
    category_name: yup.string().trim().required().label('Category Name'),
    category_details: yup
      .string()
      .trim()
      .required()
      .label('Category Details')
      .min(3, 'Category details must be at least 3 characters')
      .max(250, 'Category details must be at most 250 characters'),
    imageUrl: yup.string().optional(),
    image: yup
      .mixed()
      // .optional()
      .label('Image')
      // .typeError('Image must be valid')
      .when('imageUrl', {
        is: (value: string) => !value?.length,
        then: rule => rule.required().label('Image')
      })
      .test('fileFormat', '"Please upload a valid image file (PNG, GIF, JPEG, JPG, or TIFF)"', (value: any) => {
        if (!value) {
          return true
        }

        return value && IMAGE_ACCEPT?.split(',').includes(value.type)
      })
  })
const categoryUpdateSchemaType = categoryUpdateValidationSchema()
export type TCategoryUpdateSchemaInferType = yup.InferType<typeof categoryUpdateSchemaType>
