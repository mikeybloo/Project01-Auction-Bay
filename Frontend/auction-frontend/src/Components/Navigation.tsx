import type { FC } from 'react'
import { Button, ButtonGroup, Container, Image, Navbar } from 'react-bootstrap'
import authStore from '../Stores/auth.store'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'

const Navigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  var avatarImagePath = "";

  if(authStore.user?.avatar == null || authStore.user?.avatar == "" || authStore.user?.avatar == undefined) {
    avatarImagePath = '/Default_User.png';
  }


  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container style={{ backgroundColor: '#f6f6f4'}} className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <Navbar.Brand><Image src="\Logo.png" alt="Logo" height={70} width={70}/></Navbar.Brand>
            <ButtonGroup className='bg-white rounded-pill ms-4' style={{ height: '55px' }}>
              {currentPath.startsWith('/profile/') ? (
                <>
                  <Button className='rounded-pill bg-transparent border-white text-dark d-flex align-items-center'><img src="\Home_Black.png" height={15} className='me-2' style={{ verticalAlign: "middle" }}/><Link to={routes.AUCTIONS} className='text-decoration-none text-black'>Auctions</Link></Button>
                  <Button className='rounded-pill bg-black border-black ms-1 d-flex align-items-center'><img src="\Profile_White.png" height={15} className='me-2'/><Link to={`${routes.PROFILE}/myauctions`} className='text-decoration-none text-white'>Profile</Link></Button>
                </>
              ) : currentPath === '/auctions' ? (
                <>
                  <Button className='rounded-pill bg-black border-black text-white d-flex align-items-center'><img src="\Home_White.png" height={15} className='me-2' style={{ verticalAlign: "middle" }}/><Link to={routes.AUCTIONS} className='text-decoration-none text-white'>Auctions</Link></Button>
                  <Button className='rounded-pill bg-transparent border-white ms-1 d-flex align-items-center'><img src="\Profile_Black.png" height={15} className='me-2'/><Link to={`${routes.PROFILE}/myauctions`} className='text-decoration-none text-black'>Profile</Link></Button>
                </>
              ) : null}
            </ButtonGroup>
          </div>
          <ButtonGroup className='bg-white rounded-pill ms-4' style={{ height: '50px' }}>
            <Button className='rounded-pill text-black d-flex align-items-center' style={{ backgroundColor: '#f4ff47', borderColor: '#f4ff47', width: '50px' }}><span style={{ fontWeight: '300', fontSize: '30px', marginBottom: '5px', marginLeft: '2px' }}>+</span></Button>
            <Button className='rounded-pill bg-white border-black ms-1 d-flex align-items-center'><img src={avatarImagePath} height={25}/></Button>
          </ButtonGroup>
        </Container>
      </Navbar>
    </>
  )
}

export default Navigation
