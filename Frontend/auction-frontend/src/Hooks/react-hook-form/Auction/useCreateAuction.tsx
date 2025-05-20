import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import type { AuctionType } from '../../../Models/auction'

export interface CreateAuctionFields {
    title: string
    description: string
    starting_price: number
    end_date: Date
}

interface Props {
  defaultValues?: AuctionType
}

export const useCreateAuctionForm = ({ defaultValues }: Props) => {
  const CreateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
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
      price: 0,
      end_date: new Date(),
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateAuctionSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateAuctionForm = ReturnType<typeof useCreateAuctionForm>
