import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateBidFields {
  offer: number
}

export const useCreateBidForm = () => {
  const CreateBidSchema = Yup.object().shape({
    offer: Yup.number().required().min(
        1,
        'The minimum offer has to be 1 or greater!'
    )
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      offer: 0,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateBidSchema)
  })

  return {
    handleSubmit,
    errors,
    reset,
    control,
  }
}

export type CreateBidForm = ReturnType<typeof useCreateBidForm>
