import { yupResolver } from '@hookform/resolvers/yup'
import type { UserType } from '../../Models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface UpdateUserFields {
  name?: string | null
  surname?: string | null
  email?: string | null
}

interface Props {
  defaultValues?: UserType
}

export const useUpdateUserForm = ({ defaultValues }: Props) => {
  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().notRequired(),
    surname: Yup.string().notRequired(),
    email: Yup.string().email().required('Email is required!')
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
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(UpdateUserSchema)
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export type UpdateUserForm = ReturnType<typeof useUpdateUserForm>
