import { yupResolver } from '@hookform/resolvers/yup'
import type { UserType } from '../../Models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface UpdateUserFields {
  first_name?: string
  last_name?: string
  email: string
}

interface Props {
  defaultValues?: UserType
}

export const useUpdateUserForm = ({ defaultValues }: Props) => {
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email')
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
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
