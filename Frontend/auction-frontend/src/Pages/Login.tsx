import type { FC } from 'react'
import { Card, Col, Container, Image, Row } from 'react-bootstrap'
import LoginForm from '../Components/user/LoginForm'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'

const Login: FC = () => {
  return (
    <>
      <Container fluid >
        <Row className='min-vh-100'>
          <Col sm={8} style={{ backgroundColor: '#f6f6f4'}}>
            <Card>meow</Card>
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
