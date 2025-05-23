import 'bootstrap/dist/css/bootstrap.min.css'
import type { FC } from 'react'
import type { AuctionType } from '../Models/auction'
import { Col, Container, Image, Row } from 'react-bootstrap'
import AuctionCardDemo from '../Components/AuctionCardDemo'
import RegisterForm from '../Components/user/RegisterForm'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'

const auctions: AuctionType[] =[
  {
    id: '1',
    title: 'Macbook Pro 15 2015',
    description: '',
    image: '/Demos/laptopdemo.png',
    starting_price: 200,
    published_on: new Date(),
    end_date: new Date(Date.now() + 600000),
    active: true,
    authorId: "",
    bids: []
  },
  {
    id: '2',
    title: 'iPad Pro 13inch',
    description: '',
    image: '/Demos/ipaddemo.png',
    starting_price: 500,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000),
    active: true,
    authorId: "",
    bids: []
  },
  {
    id: '3',
    title: 'Earphones',
    description: '',
    image: '/Demos/earbudsdemo.png',
    starting_price: 77,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000),
    active: true,
    authorId: "",
    bids: []
  },
  {
    id: '4',
    title: 'iMac 27inch 2019 combo',
    description: 'Description of item #4',
    image: '/Demos/macdemo.png',
    starting_price: 600,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000),
    active: true,
    authorId: "",
    bids: []
  }
]

const Register: FC = () => {
  return (
    <>
      <Container fluid >
        <Row className='min-vh-100'>
          <Col sm={8} style={{ display: 'flex', backgroundColor: '#f6f6f4', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '50%', height: '50%', gap: '1rem' }}>
              {auctions.map((auction) => (
                <AuctionCardDemo key={auction.id} auction={auction} />
              ))}
            </div>
          </Col>
          <Col sm={4}>
            <div style={{ width: '100%' }}>
              <div className='align-items-center d-flex flex-column' style={{ height: '300px'}}>
                <Image src="\Logo.png" alt="Logo" height={100} width={100} className="d-inline-block p-3 my-5"/>
                <div className='text-center' style={{ marginTop: 'auto'}}>
                  <h3 className='mt-5 fw-bold'>Hello!</h3>
                  <p className='text-muted'>Please enter your details</p>
                </div>
              </div>
              <div className='w-100 px-5 mt-5'>
                  <RegisterForm />
              </div>
              <div className='w-100 align-items-center d-flex flex-column' style={{ height: '150px'}}>
                <small className='text-muted' style={{ marginTop: 'auto'}}>Already have an account? <Link to={`${routes.LOGIN}`} className='fw-bold text-black text-decoration-none'>Log In</Link></small >
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Register
