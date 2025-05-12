import * as yup from 'yup'

export const cmsSchema = yup.object().shape({
  title: yup.string().required().label('Title').min(5, 'Title must be at least 5 characters'),
  content: yup.string().required().label('Content')
})
