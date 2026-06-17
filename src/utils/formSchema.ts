import * as yup from 'yup';

export const formSchema = yup.object({
  name: yup
    .string()
    .required('Название обязательно для заполнения')
    .trim() // автоматически убирает пробелы по краям
    .min(3, 'Название должно быть не менее 3 символов')
    .max(50, 'Название не должно превышать 50 символов'),
  info: yup
    .string()
    .required('Описание обязательно для заполнения')
    .trim()
    .min(3, 'Описание должно быть не менее 3 символов')
    .max(100, 'Описание не должно превышать 100 символов'),
  important: yup.boolean().required(),
  completed: yup.boolean(),
}).required();