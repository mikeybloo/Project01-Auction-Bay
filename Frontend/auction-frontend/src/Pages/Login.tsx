import type { FC } from 'react'
import { Card, Col, Container, Image, Row } from 'react-bootstrap'
import LoginForm from '../Components/user/LoginForm'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'
import type { AuctionType } from '../Models/auction'
import AuctionCard from '../Components/AuctionCard'

const auctions: AuctionType[] =[
  {
    id: '1',
    title: 'Macbook Pro 15 2015',
    description: 'Used MacBook in good condition',
    image: '',
    starting_price: 200,
    published_on: new Date(),
    end_date: new Date(Date.now() + 86400000), // +1 day
    active: true,
  },
  {
    id: '2',
    title: 'iPad Pro 13inch',
    description: 'iPad Pro with Apple Pencil',
    image: '',
    starting_price: 500,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000), // +2 days
    active: true,
  },
  {
    id: '3',
    title: 'Item 3',
    description: 'Description of item #3',
    image: '',
    starting_price: 100,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000), // +2 days
    active: true,
  },
  {
    id: '4',
    title: 'Item 4',
    description: 'Description of item #4',
    image: '',
    starting_price: 200,
    published_on: new Date(),
    end_date: new Date(Date.now() + 172800000), // +2 days
    active: true,
  }
]

const Login: FC = () => {
  return (
    <>
      <Container fluid >
        <Row className='min-vh-100'>
          <Col sm={8} style={{ backgroundColor: '#f6f6f4'}}>
            <Row className='g-4 p-4'>
              {auctions.map((auction) => (
                <Col md={6} key={auction.id}>
                  <AuctionCard auction={auction} />
                </Col>
              ))}
            </Row>
          </Col>
          <Col sm={4}>
            <div style={{ width: '100%' }}>
              <div className='align-items-center d-flex flex-column' style={{ height: '400px'}}>
                <Image src="public\Logo.png" alt="Logo" height={100} width={100} className="d-inline-block p-3 my-5"/>
                <div className='text-center' style={{ marginTop: 'auto'}}>
                  <h3 className='mt-5 fw-bold'>Welcome back!</h3>
                  <p className='text-muted'>Please enter your details</p>
                </div>
              </div>
              <div className='w-100 px-5 mt-4'>
                  <LoginForm />
              </div>
              <div className='w-100 align-items-center d-flex flex-column' style={{ height: '150px'}}>
                <small className='text-muted' style={{ marginTop: 'auto'}}>Don't have an account? <Link to={`${routes.SIGNUP}`} className='fw-bold text-black text-decoration-none'>Sign Up</Link></small >
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Login
