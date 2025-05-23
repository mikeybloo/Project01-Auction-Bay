import { apiRoutes } from '../Constants/apiConstants'
import { apiRequest } from './Api'
import type { AuctionType } from '../Models/auction'
import type { CreateAuctionFields } from '../Hooks/react-hook-form/Auction/useCreateAuction'
import type { CreateBidFields } from '../Hooks/react-hook-form/useCreateBid'
import type { UpdateAuctionFields } from '../Hooks/react-hook-form/Auction/useUpdateAuction'

export const fetchAuction = async (id: string) =>
    apiRequest<undefined, AuctionType>('get', `${apiRoutes.AUCTIONS_PREFIX}/${id}`)
  
  export const fetchAuctions = async (pageNumber: number) =>
    apiRequest<number, AuctionType[]>(
      'get',
      `${apiRoutes.AUCTIONS_PREFIX}?page=${pageNumber}`,
    )

  export const fetchDemoAuctions = async () =>
    apiRequest<number, AuctionType[]>(
      'get',
      `${apiRoutes.AUCTIONS_PREFIX}/demo`,
    )

  export const fetchMyAuctions = async () =>
    apiRequest<number, AuctionType[]>(
      'get',
      `${apiRoutes.AUCTIONS_PREFIX}/myauctions`,
    )

  export const fetchMyBidding = async () =>
    apiRequest<number, AuctionType[]>(
      'get',
      `${apiRoutes.AUCTIONS_PREFIX}/bidding`,
    )

  export const postBid = async (data: CreateBidFields, id: string) =>
    apiRequest<CreateBidFields, void>('post', `${apiRoutes.AUCTIONS_PREFIX}/${id}/bid`, data)

  export const postAuction = async (data: CreateAuctionFields) => 
    apiRequest<CreateAuctionFields, void>('post', `${apiRoutes.USERS_PREFIX}/auction`, data)
  
  export const updateAuction = async (data: UpdateAuctionFields, id: string) =>
    apiRequest<UpdateAuctionFields, void>(
      'patch',
      `${apiRoutes.USERS_PREFIX}/auction/${id}`,
      data,
    )
  
  export const deleteAuction = async (id: string) =>
    apiRequest<string, AuctionType>('delete', `${apiRoutes.AUCTIONS_PREFIX}/${id}`)

  export const uploadAuctionImage = async (formData: FormData, id: string) =>
    apiRequest<FormData, void>(
      'post',
      `${apiRoutes.AUCTIONS_PREFIX}/upload/${id}`,
      formData,
    )
  