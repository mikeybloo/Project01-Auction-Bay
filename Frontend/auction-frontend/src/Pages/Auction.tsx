import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, type FC } from 'react'
import Layout from '../Components/Layout'
import { Container, Image, ListGroup, Toast, ToastContainer } from 'react-bootstrap'
import { useQuery } from 'react-query'
import * as API from '../Services/Api'
import { useParams } from 'react-router-dom'
import type { AuctionType } from '../Models/auction'
import authStore from '../Stores/auth.store'
import CreateBidForm from '../Components/CreateBidForm'
import type { BidType } from '../Models/bid'
import BidRow from '../Components/BidRow'

const Auction: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const user = authStore.user;

  const { data, isLoading, isError, error, refetch } = useQuery<{ data: AuctionType }, Error>(
      ['fetchAuction', id],
      () => API.fetchAuction(id!),
      {
          enabled: !!id,
          refetchOnWindowFocus: false,
          onError: (err) => {
              setApiError((err as Error).message)
              setShowError(true)
          },
          onSuccess: () => {
              setShowError(false)
              setApiError('')
          }
      }
  )

  if(data?.data.title === undefined) {
    return (
      <Layout>
        <Container>
          <h2>Auction does not exist</h2>
        </Container>
      </Layout>
    )
  }

  //Handle image rendering - if no auction image is set, use placeholder
  var imageUrl = "";
  if (data?.data.image == null || data?.data.image == "") {
      imageUrl = 'https://e.snmc.io/i/600/s/cab1e2c39ec226ff402e086ec94d4189/5143549/agalloch-the-mantle-Cover-Art.jpg';
  } else {
      imageUrl = `${import.meta.env.VITE_API_URL}/files/${data?.data.image}`;
  }

  //Set status tag
  var status = {
      text: "",
      color: "black", //Black by default
      background: ""
  }

  if(new Date(data?.data.end_date!) < new Date()) {
      status.text = "Done"
      status.color = "white" //Only set white if the bg is gray
      status.background = "#272d2d" //Gray
  } else if(data?.data.authorId === user?.id) {
      status.text = "In progress"
      status.background = "#f9ff90" //Yellow
  } else if(data?.data.bids[0]?.authorId === user?.id) {
      status.text = "Winning"
      status.background = "#adff90" //Green
  } else if(data?.data.bids?.some(bid => bid.authorId === user?.id)) {
      status.text = "Outbid"
      status.background = "#ffaa98" //Red
  } else {
      status.text = "In progress"
      status.background = "#f9ff90"
  }

  //Calculate time remaining until auction ends
  const remaining = new Date(data?.data.end_date).getTime() - new Date().getTime();
  var timeText = '';
  var timeTagColor = '';
  if(remaining < 3600000){
      timeText = `${Math.floor(remaining / 60000).toString()}m`;
      timeTagColor = '#ffaa98';
  } else {
      timeText = `${Math.floor(remaining / 3600000)}h`;
  }

  return (
    <Layout>
      <div style={{ display: 'flex', height: '80vh', overflow: 'hidden', margin: '0 0 0 0' }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={{ width: '50%', height: '100%', marginRight: '20px' }}>
              <Image fluid src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }}/>
            </div>
            <div style={{ width: '50%' }}>
              <div className="mb-3" style={{ backgroundColor: '#ffffff', height: '40%', borderRadius: '15px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div className='mt-3 ms-3' style={{color: status.color, backgroundColor: status.background, borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '15px', paddingRight: '15px', fontSize: '18px'}}>{status.text}</div>
                  {status.text != 'Done' && ( //Don't render clock infographic if status is 'Done'
                      <div className='mt-3 me-2' style={{backgroundColor: timeTagColor, borderRadius: '20px', fontWeight: 'lighter', paddingLeft: '5px', paddingRight: '5px', fontSize: '18px', display: 'inline-flex', alignItems: 'center'}}>
                          {timeText}
                          <img src='\clock.png' style={{ height: '18px', verticalAlign: 'middle', marginLeft: '3px' }}/>
                      </div>
                  )}
                </div>
                <div className='ms-3 mt-3'>
                  <h2 className='fw-bold'>{data?.data.title}</h2>
                  <p className='text-muted'>{data?.data.description}</p>
                </div>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                  {data?.data.authorId !== user?.id && status.text != 'Done' && (
                    <CreateBidForm auction={data?.data} onBidSuccess={refetch}/>
                  )}
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', height: '60%', borderRadius: '15px' }}>
                  <div className='ps-3 pt-3'>
                    <h3 className='fw-bold'>Bidding history({data?.data.bids.length})</h3>
                  </div>
                  <div className='mt-3' style={{ width: '100%' }}>
                    <ListGroup variant='flush'>
                      {data?.data.bids.map((bid: BidType) => (
                          <BidRow bid={bid}/>
                      ))}
                    </ListGroup>
                  </div>
              </div>
            </div>
          </>
        )}
      </div>
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

export default Auction
