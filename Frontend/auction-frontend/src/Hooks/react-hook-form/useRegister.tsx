import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface RegisterUserFields {
  name?: Yup.Maybe<string | undefined>
  surname?: Yup.Maybe<string | undefined>
  email: string
  password: string
  confirm_password: string
}

export const useRegisterForm = () => {
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().notRequired(),
    surname: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must have at least one number, lower or upper case letter nad it has to be longer than 5 characters.',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Passwords do not match'),
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(RegisterSchema),
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export type RegisterForm = ReturnType<typeof useRegisterForm>
