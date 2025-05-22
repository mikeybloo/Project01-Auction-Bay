import 'bootstrap/dist/css/bootstrap.min.css'
import { useMemo, useState, type FC } from 'react'
import Layout from '../../Components/Layout'
import authStore from '../../Stores/auth.store'
import { Button, ButtonGroup, Col, Row, Toast, ToastContainer } from 'react-bootstrap'
import { useQuery } from 'react-query'
import * as API from '../../Services/Api'
import type { AuctionType } from '../../Models/auction'
import AuctionCard from '../../Components/AuctionCard'

const Profile: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [auctionButton, setAuctionsButton] = useState({ text: '#ffffff', bg: '#272d2d' });
  const [biddingButton, setBiddingButton] = useState({ text: '#272d2d', bg: '#ffffff' });
  const [wonButton, setWonButton] = useState({ text: '#272d2d', bg: '#ffffff' });
  const [activeTab, setActiveTab] = useState('my');

  const fetchTab = () => {
    console.log(JSON.stringify(filteredAuctions))
    if(activeTab == 'bidding' || activeTab == 'won') return API.fetchMyBidding()
    return API.fetchMyAuctions() 
  }

  const { data, isLoading, isError, error } = useQuery<AuctionType[]>(
      ['fetchMyAuctions', activeTab],
      fetchTab,
      {
          keepPreviousData: true,
          refetchOnWindowFocus: false,
          onError: (err) => {
            setApiError((err as Error).message)
            setShowError(true)
          },
          onSuccess: () => {
            setShowError(false)
            setApiError('')
          }
      },
  )

  const filteredAuctions = useMemo(() => {
    if (activeTab !== 'won') return data?.data

    return data?.data.filter(auction => {
      const topBid = auction.bids?.[0]
      const auctionEnded = new Date(auction.end_date) < new Date()
      return auctionEnded && topBid && topBid.authorId === authStore.user?.id
    })
  }, [data, activeTab])

  const myAuctionsActive = () => {
    setActiveTab('myauctions')
    setAuctionsButton({ text: '#ffffff', bg: '#272d2d' })
    setBiddingButton({ text: '#272d2d', bg: '#ffffff' })
    setWonButton({ text: '#272d2d', bg: '#ffffff' })
  }

  const biddingActive = () => {
    setActiveTab('bidding')
    setAuctionsButton({ text: '#272d2d', bg: '#ffffff' })
    setBiddingButton({ text: '#ffffff', bg: '#272d2d' })
    setWonButton({ text: '#272d2d', bg: '#ffffff' })
  }

  const wonActive = () => {
    setActiveTab('won')
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
        {isLoading ? (
            <div>Loading auctions...</div>
        ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {activeTab !== 'won' ? (
                  <Row className='g-5 p-4'>
                      {Array.isArray(data?.data) && data.data.map((auction: AuctionType) => (
                          <Col xs={12} sm={6} md={4} lg={2} key={auction.id}>
                              <AuctionCard auction={auction} user={authStore.user}/>
                          </Col>
                      ))}
                  </Row>
                ) : (
                  <Row className='g-5 p-4'>
                      {Array.isArray(filteredAuctions) && filteredAuctions.map((auction: AuctionType) => (
                          <Col xs={12} sm={6} md={4} lg={2} key={auction.id}>
                              <AuctionCard auction={auction} user={authStore.user}/>
                          </Col>
                      ))}
                  </Row>
                )}
            </div>
        )}
        {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
    </Layout>
  )
}

export default Profile
