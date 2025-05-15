import React from 'react'
import type { FC } from 'react'
import type { AuctionType } from '../Models/auction'

type Props = {
    auction: AuctionType
}

const AuctionCard: FC<Props> = ({ auction }) => {
    const remaining = ((auction.end_date.getTime() - auction.published_on.getTime()) / 1000 ) / (3600)

    return (
        <div style={{ height: '250px', width: '216px', backgroundColor: '#FFFFFF', borderRadius: '16px'}}>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px' }}></div>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px' }}>
                {auction.title}
            </div>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px' }}>
                {auction.starting_price} €
            </div>
            <div style={{ marginTop: '4px', marginLeft: '4px', marginBottom: '4px' }}></div>
        </div>
    );
}

export default AuctionCard;