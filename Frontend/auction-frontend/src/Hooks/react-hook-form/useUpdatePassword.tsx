import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface UpdatePasswordFields {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const useUpdatePasswordForm = () => {
  const UpdatePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(),
    newPassword: Yup.string().matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must have at least one number, lower or upper case letter nad it has to be longer than 5 characters.',
      ).required(),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Passwords do not match')
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(UpdatePasswordSchema)
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export type UpdatePasswordForm = ReturnType<typeof useUpdatePasswordForm>
