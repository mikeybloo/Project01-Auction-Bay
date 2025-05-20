import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import type { AuctionType } from '../../../Models/auction'

export interface UpdateAuctionFields {
    title: string
    description: string
    end_date: Date
}

interface Props {
  defaultValues?: AuctionType
}

export const useUpdateAuctionForm = ({ defaultValues }: Props) => {
  const UpdateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    end_date: Yup.date().required('End date is required')
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      end_date: new Date(),
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(UpdateAuctionSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type UpdateAuctionForm = ReturnType<typeof useUpdateAuctionForm>
