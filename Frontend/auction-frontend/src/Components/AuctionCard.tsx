import type { FC } from 'react'
import type { AuctionType } from '../Models/auction'

type Props = {
    auction: AuctionType
}

const AuctionCard: FC<Props> = ({ auction }) => {
    //Calculate time remaining until auction ends
    const remaining = auction.end_date.getTime() - auction.published_on.getTime();
    var timeText = '';
    var timeTagColor = '';
    if(remaining < 3600000){
        timeText = `${Math.floor(remaining / 60000).toString()}m`;
        timeTagColor = '#ffaa98';
    } else {
        timeText = `${Math.floor(remaining / 3600000)}h`;
    }

    return (
        <div style={{ height: '250px', width: '216px', backgroundColor: '#FFFFFF', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'}}>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{backgroundColor: '#f9ff90', borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '10px', paddingRight: '10px', fontSize: '12px'}}>In progress</div>
                <div style={{backgroundColor: timeTagColor, borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '5px', paddingRight: '5px', fontSize: '12px', display: 'inline-flex', alignItems: 'center'}}>
                    {timeText}
                    <img src='\clock.png' style={{ height: '12px', verticalAlign: 'middle', marginLeft: '3px' }}/>
                </div>
            </div>
            <div className="text-muted" style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px', color: '#071015' }}>
                {auction.title}
            </div>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px', color: '#071015', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                {auction.starting_price} €
            </div>
            <div style={{ paddingBottom: '4px', paddingLeft: '4px', paddingRight: '4px' }}>
                <img style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} src='https://e.snmc.io/i/600/s/cab1e2c39ec226ff402e086ec94d4189/5143549/agalloch-the-mantle-Cover-Art.jpg' />
            </div>
        </div>
    );
}

export default AuctionCard;