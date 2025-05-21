import type { FC } from 'react'
import type { AuctionType } from '../Models/auction'
import type { UserType } from '../Models/auth'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'
import { Button, Image } from 'react-bootstrap'

type Props = {
    auction: AuctionType
    user: UserType | null | undefined
}

const AuctionCard: FC<Props> = ({ auction, user }) => {
    //Get max price
    const price = auction.bids?.length > 0
        ? auction.bids[0].offer
        : auction.starting_price;

    //Handle image rendering - if no auction image is set, use placeholder
    var imageUrl = "";
    if (auction.image == null || auction.image == "") {
        imageUrl = 'https://e.snmc.io/i/600/s/cab1e2c39ec226ff402e086ec94d4189/5143549/agalloch-the-mantle-Cover-Art.jpg';
    } else {
        imageUrl = `${import.meta.env.VITE_API_URL}/files/${auction.image}`;
    }

    //Set status tag
    var status = {
        text: "",
        color: "black", //Black by default
        background: ""
    }

    if(new Date(auction.end_date) < new Date()) {
        status.text = "Done"
        status.color = "white" //Only set white if the bg is gray
        status.background = "#272d2d" //Gray
    } else if(auction.authorId === user?.id) {
        status.text = "In progress"
        status.background = "#f9ff90" //Yellow
    } else if(auction.bids[0]?.authorId === user?.id) {
        status.text = "Winning"
        status.background = "#adff90" //Green
    } else if(auction.bids?.some(bid => bid.authorId === user?.id)) {
        status.text = "Outbid"
        status.background = "#ffaa98" //Red
    } else {
        status.text = "In progress"
        status.background = "#f9ff90"
    }
    
    //Calculate time remaining until auction ends
    const remaining = new Date(auction.end_date).getTime() - new Date().getTime();
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
                <div style={{color: status.color, backgroundColor: status.background, borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '10px', paddingRight: '10px', fontSize: '12px'}}>{status.text}</div>
                {status.text != 'Done' && ( //Don't render clock infographic if status is 'Done'
                    <div style={{backgroundColor: timeTagColor, borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '5px', paddingRight: '5px', fontSize: '12px', display: 'inline-flex', alignItems: 'center'}}>
                        {timeText}
                        <img src='\clock.png' style={{ height: '12px', verticalAlign: 'middle', marginLeft: '3px' }}/>
                    </div>
                )}
            </div>
            <div className="text-muted" style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px', color: '#071015' }}>
                <Link to={`${routes.AUCTION}/${auction.id}`} className='text-decoration-none text-black'>{auction.title}</Link>
            </div>
            <div style={{ marginTop: '8px', marginLeft: '8px', marginRight: '8px', color: '#071015', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>
                {price} €
            </div>
            <div style={{ paddingBottom: '4px', paddingLeft: '4px', paddingRight: '4px', position: 'relative' }}>
                <Link to={`${routes.AUCTION}/${auction.id}`}><img style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} src={imageUrl} /></Link>
            
                {auction.authorId === user?.id && status.text !== 'Done' && (
                    <>
                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '8px' }}>
                            <Button variant='dark' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image src="/Trash.png" style={{ height: '15px' }} />
                            </Button>
                            <Button variant='light' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image src="/Edit.png" className='me-1' style={{ height: '15px' }} />
                                Edit
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuctionCard;