import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, type FC } from 'react'
import Layout from '../../Components/Layout'
import authStore from '../../Stores/auth.store'
import { Button, ButtonGroup } from 'react-bootstrap'

const Profile: FC = () => {
  const [auctionButton, setAuctionsButton] = useState({ text: '#ffffff', bg: '#272d2d' });
  const [biddingButton, setBiddingButton] = useState({ text: '#272d2d', bg: '#ffffff' });
  const [wonButton, setWonButton] = useState({ text: '#272d2d', bg: '#ffffff' });

  const myAuctionsActive = () => {
    setAuctionsButton({ text: '#ffffff', bg: '#272d2d' })
    setBiddingButton({ text: '#272d2d', bg: '#ffffff' })
    setWonButton({ text: '#272d2d', bg: '#ffffff' })
  }

  const biddingActive = () => {
    setAuctionsButton({ text: '#272d2d', bg: '#ffffff' })
    setBiddingButton({ text: '#ffffff', bg: '#272d2d' })
    setWonButton({ text: '#272d2d', bg: '#ffffff' })
  }

  const wonActive = () => {
    setAuctionsButton({ text: '#272d2d', bg: '#ffffff' })
    setBiddingButton({ text: '#272d2d', bg: '#ffffff' })
    setWonButton({ text: '#ffffff', bg: '#272d2d' })
  }

  return (
    <Layout>
        <h2 className='fw-bold'>Hello {authStore.user?.name} {authStore.user?.surname} !</h2>
        <div className='d-flex justify-content-center'>
          <ButtonGroup className='bg-white ms-4' style={{ height: '40px', borderRadius: '15px', backgroundColor: '#edf4f2' }}>
            <Button onClick={myAuctionsActive} className='ms-1 border-0' style={{ borderRadius: '15px', backgroundColor: auctionButton.bg, color: auctionButton.text, width: '120px' }}>My auctions</Button>
            <Button onClick={biddingActive} className='ms-1 border-0' style={{ borderRadius: '15px', backgroundColor: biddingButton.bg, color: biddingButton.text, width: '120px' }}>Bidding</Button>
            <Button onClick={wonActive} className='ms-1 border-0' style={{ borderRadius: '15px', backgroundColor: wonButton.bg, color: wonButton.text, width: '120px' }}>Won</Button>
          </ButtonGroup>
        </div>
    </Layout>
  )
}

export default Profile
