import type { FC } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Button, Navbar, Nav, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'

const Home: FC = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" className="px-4">
        <Navbar.Brand href="#home" className="text-warning fw-bold fs-3"><Image src="\Logo.png" alt="Logo" height={75} className="d-inline-block align-top"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
          </Nav>
          <div className='d-flex align-items-center justify-content-center'>
            <Link to={`${routes.LOGIN}`} className='text-decoration-none text-black fw-bold me-2'>Log in</Link>
            or
            <Link to={`${routes.SIGNUP}`} className='btn btn-dark rounded-pill ms-2'>Sign Up</Link>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="text-center py-5 bg-light" style={{ minHeight: '60vh' }}>
        <Row className="justify-content-center align-items-center h-100">
          <Col>
            <h1 className="fw-bold" style={{fontSize: 70}}>E-auctions made easy!</h1>
            <p className="lead">Simple way for selling your unused products, or <br /> getting a deal on product you want!</p>
            <Button size="lg" style={{backgroundColor: '#f4ff47', color: '#000000', border: 'none'}}>Start bidding</Button>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row className="g-4">
          <Col>
            <Image src="\Auctions_Demo.png" rounded />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
