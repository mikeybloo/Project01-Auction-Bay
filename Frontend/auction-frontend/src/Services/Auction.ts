import { apiRoutes } from '../Constants/apiConstants'
import { apiRequest } from './Api'
import type { AuctionType } from '../Models/auction'
import type { UpdateUserFields } from '../Hooks/react-hook-form/useUpdateUser'
import type { CreateAuctionFields } from '../Hooks/react-hook-form/Auction/useCreateAuction'

export const fetchAuction = async (id: string) =>
    apiRequest<undefined, AuctionType>('get', `${apiRoutes.AUCTION_PREFIX}/${id}`)
  
  export const fetchAuctions = async (pageNumber: number) =>
    apiRequest<number, AuctionType[]>(
      'get',
      `${apiRoutes.AUCTIONS_PREFIX}?page=${pageNumber}`,
    )

  export const postAuction = async (data: CreateAuctionFields) => 
    apiRequest<CreateAuctionFields, void>('post', `${apiRoutes.USERS_PREFIX}/auction`, data)
  
  export const updateAuction = async (data: UpdateUserFields, id: string) =>
    apiRequest<UpdateUserFields, void>(
      'patch',
      `${apiRoutes.USERS_PREFIX}/auctions/${id}`,
      data,
    )
  
  export const deleteAuction = async (id: string) =>
    apiRequest<string, AuctionType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)
  