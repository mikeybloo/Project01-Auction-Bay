import type { FC } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Button, Navbar, Nav, Image } from 'react-bootstrap'

const Home: FC = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" className="px-4">
        <Navbar.Brand href="#home" className="text-warning fw-bold fs-3"><Image src="public\Logo_Demo.png" alt="Logo" height={75} className="d-inline-block align-top"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
          </Nav>
          <div>
            <Button variant="link" className="me-2">Log in</Button>
            or
            <Button variant="dark">Sign Up</Button>
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
            <Image src="public\Auctions_Demo.png" rounded />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
