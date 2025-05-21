import type { FC } from 'react'
import type { BidType } from '../Models/bid'
import { Button, Image, ListGroupItem } from 'react-bootstrap'
import dayjs from 'dayjs'

type Props = {
    bid: BidType
}

const BidRow: FC<Props> = ({ bid }) => {
    //Handle image rendering - if no profile image is set, use placeholder
    var imageUrl = "";
    if (bid.author.avatar == null || bid.author.avatar == "") {
        imageUrl = '/Default_User.png';
    } else {
        imageUrl = `${import.meta.env.VITE_API_URL}/files/${bid.author.avatar}`;
    }

    return (
        <ListGroupItem>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                    <Image src={imageUrl} className='border rounded-circle me-2' style={{ height: '40px' }}/>
                    <p className='text-muted mb-0' style={{ fontSize: '17px' }}>{bid.author.name} {bid.author.surname}</p>
                </div>
                <div className='d-flex align-items-center'>
                    <p className='text-muted mb-0' style={{ fontSize: '17px' }}>{dayjs(bid.published_on).format('HH:mm DD.MM.YYYY')}</p>
                    <Button className='ms-4' style={{ backgroundColor: '#f4ff47', color: 'black', border: 'none', fontWeight: '600', height: '38px', borderRadius: '15px' }}>{bid.offer} €</Button>
                </div>
            </div>
        </ListGroupItem>
    )
}

export default BidRow
