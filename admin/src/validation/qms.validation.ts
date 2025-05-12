import * as yup from 'yup';

export const qmsSchema = yup.object().shape({
  subject: yup.string().required().label('Subject'),
  query: yup.string().required().label('Query'),
  content: yup.string().required().label('Content')
});

export const qmsViewSchema = yup.object().shape({
  subject: yup.string().optional().label('Subject'),
  query: yup.string().optional().label('Query'),
  content: yup.string().optional().label('Content')
});

