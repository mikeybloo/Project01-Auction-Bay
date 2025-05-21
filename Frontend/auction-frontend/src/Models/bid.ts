import type { UserType } from "./auth"

export type BidType = {
    id: string
    offer: number
    published_on: Date
    authorId: string
    author: UserType
    auctionId: string
}