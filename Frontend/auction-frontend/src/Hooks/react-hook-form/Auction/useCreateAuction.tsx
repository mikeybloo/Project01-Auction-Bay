import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateAuctionFields {
    title: string
    description: string
    starting_price: number
    end_date: Date
}

export const useCreateAuctionForm = () => {
  const CreateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    starting_price: Yup.number().required('Price is required').min(
      1,
      'The price has to be at least 1 eur'
    ),
    end_date: Yup.date().required('End date is required').min(
      new Date(Date.now() + 86400000) ,
      'End date has to be at least a DAY after current date'
    )
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      starting_price: 0,
      end_date: new Date()
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
