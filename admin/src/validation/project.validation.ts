import * as yup from 'yup'

export const projectCreateValidationSchema = () =>
  yup.object().shape({
    project_category: yup.string().trim().required().label('Category'),
    project_location: yup.string().trim().required().label('Location'),
    client: yup.string().trim().required().label('Client'),
    project_title: yup
      .string()
      .trim()
      .required()
      .label('Project title')
      .min(3, 'Project title must be at least 3 characters')
      .max(250, 'Project tile must be at most 250 characters'),
    project_description: yup
      .string()
      .trim()
      .required()
      .label('Project description')
      .min(3, 'Project description must be at least 3 characters')
      .max(1000, 'Project description must be at most 1000 characters'),
    project_address: yup.string().trim().required().label('Address'),
    project_budget: yup.string().label('Budget').required().typeError('Please check the value'),
    project_timeline: yup.string().label('Timeline').required().typeError('Please check the value'),
    project_hrs_week: yup.string().trim().required().default('Hrs').label('Project Hrs/Week'),
    latitude: yup.string().required().label('Latitude'),
    longitude: yup.string().required().label('Longitude'),
    zip_code: yup.string()
  })
const projectCreateSchemaType = projectCreateValidationSchema()
export type TProjectCreateSchemaInferType = yup.InferType<typeof projectCreateSchemaType>

export const projectUpdateValidationSchema = () =>
  yup.object().shape({
    project_category: yup.string().trim().required().label('Category'),
    project_location: yup.string().trim().required().label('Location'),
    client: yup.string().trim().required().label('Client'),
    project_title: yup
      .string()
      .trim()
      .required()
      .label('Project title')
      .min(3, 'Project title must be at least 3 characters')
      .max(250, 'Project tile must be at most 250 characters'),
    project_description: yup
      .string()
      .trim()
      .required()
      .label('Project description')
      .min(3, 'Project description must be at least 3 characters')
      .max(1000, 'Project description must be at most 1000 characters'),
    project_address: yup.string().trim().required().label('Address'),
    project_budget: yup.string().label('Budget').required().typeError('Please check the value'),
    project_timeline: yup.string().label('Timeline').required().typeError('Please check the value'),
    project_hrs_week: yup.string().trim().required().default('Hrs').label('Project Hrs/Week'),
    latitude: yup.string().required().label('Latitude'),
    longitude: yup.string().required().label('Longitude'),
    zip_code: yup.string()
  })
const projectUpdateSchemaType = projectUpdateValidationSchema()
export type TProjectUpdateSchemaInferType = yup.InferType<typeof projectUpdateSchemaType>
