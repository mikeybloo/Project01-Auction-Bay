import { useEffect, useState, type FC } from 'react'
import { Button, ButtonGroup, Container, Image, Modal, Navbar, Toast, ToastContainer } from 'react-bootstrap'
import authStore from '../Stores/auth.store'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { routes } from '../Constants/routesConstants'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import CreateAuctionForm from './CreateAuctionForm'
import UpdateUserForm from './UpdateUserForm'
import UpdatePasswordForm from './UpdatePasswordForm'
import ProfilePictureModal from './ProfilePictureModal'
import { observer } from 'mobx-react'

const Navigation: FC = () => {
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [avatarImagePath, setAvatarImagePath] = useState('');

  const [showProfile, setShowProfile] = useState(false);
  const handleCloseProfile = () => setShowProfile(false);
  const handleShowProfile = () => setShowProfile(true);

  const [showAuctionForm, setShowAuctionForm] = useState(false);
  const handleCloseAuctionForm = () => setShowAuctionForm(false);
  const handleShowAuctionForm = () => setShowAuctionForm(true);

  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const handleCloseProfileSettings = () => setShowProfileSettings(false);
  const handleShowProfileSettings = () => setShowProfileSettings(true);

  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const handleClosePasswordSettings = () => setShowPasswordSettings(false);
  const handleShowPasswordSettings = () => setShowPasswordSettings(true);

  const [showProfilePictureSettings, setShowProfilePictureSettings] = useState(false);
  const handleCloseProfilePictureSettings = () => setShowProfilePictureSettings(false);
  const handleShowProfilePictureSettings = () => setShowProfilePictureSettings(true);

  const location = useLocation();
  const currentPath = location.pathname;
  

  const signout = async () => {
    const response = await API.signout()
    if(response.data?.statusCode === statusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if(response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.signout()
      navigate('/')
    }
  }

  useEffect(() => {
    if(authStore.user?.avatar == null || authStore.user?.avatar == "" || authStore.user?.avatar == undefined) {
      setAvatarImagePath('/Default_User.png');
    } else {
      console.log(`AVATYAR URL: ${import.meta.env.VITE_API_URL}/files/${authStore.user?.avatar}`)
      setAvatarImagePath(`${import.meta.env.VITE_API_URL}/files/${authStore.user?.avatar}`);
    }
  }, [authStore.user?.avatar])

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container style={{ backgroundColor: '#f6f6f4'}} className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <Navbar.Brand><Image src="\Logo.png" alt="Logo" height={70} width={70}/></Navbar.Brand>
            <ButtonGroup className='bg-white rounded-pill ms-4' style={{ height: '55px' }}>
              {currentPath === '/profile' ? (
                <>
                  <Button className='rounded-pill bg-transparent border-0 text-dark d-flex align-items-center'><img src="\Home_Black.png" height={15} className='me-2' style={{ verticalAlign: "middle" }}/><Link to={routes.AUCTIONS} className='text-decoration-none text-black'>Auctions</Link></Button>
                  <Button className='rounded-pill border-0 ms-1 d-flex align-items-center' style={{ backgroundColor: '#272d2d' }}><img src="\Profile_White.png" height={15} className='me-2'/><Link to={`${routes.PROFILE}`} className='text-decoration-none text-white'>Profile</Link></Button>
                </>
              ) : currentPath === '/auctions' ? (
                <>
                  <Button className='rounded-pill text-white d-flex align-items-center border-0' style={{ backgroundColor: '#272d2d' }}><img src="\Home_White.png" height={15} className='me-2' style={{ verticalAlign: "middle" }}/><Link to={routes.AUCTIONS} className='text-decoration-none text-white'>Auctions</Link></Button>
                  <Button className='rounded-pill bg-transparent ms-1 d-flex align-items-center border-0'><img src="\Profile_Black.png" height={15} className='me-2'/><Link to={`${routes.PROFILE}`} className='text-decoration-none text-black'>Profile</Link></Button>
                </>
              ) : (
                <>
                  <Button className='rounded-pill bg-transparent border-0 d-flex align-items-center'><img src="\Home_Black.png" height={15} className='me-2' style={{ verticalAlign: "middle" }}/><Link to={routes.AUCTIONS} className='text-decoration-none text-black'>Auctions</Link></Button>
                  <Button className='rounded-pill bg-transparent border-0 ms-1 d-flex align-items-center'><img src="\Profile_Black.png" height={15} className='me-2'/><Link to={`${routes.PROFILE}`} className='text-decoration-none text-black'>Profile</Link></Button>
                </>
              )}
            </ButtonGroup>
          </div>
          <ButtonGroup className='bg-white rounded-pill ms-4' style={{ height: '50px' }}>
            <Button onClick={handleShowAuctionForm} className='rounded-pill text-black d-flex align-items-center' style={{ backgroundColor: '#f4ff47', borderColor: '#f4ff47', width: '50px' }}><span style={{ fontWeight: '300', fontSize: '30px', marginBottom: '5px', marginLeft: '2px' }}>+</span></Button>
            <Button onClick={handleShowProfile} className="rounded-circle bg-white border-black ms-1 d-flex align-items-center justify-content-center p-0" style={{ height: '50px', width: '50px' }}><Image src={avatarImagePath} className="rounded-circle" style={{ height: '48px', width: '48px', objectFit: 'cover' }}/></Button>
          </ButtonGroup>
        </Container>
      </Navbar>

      <Modal show={showProfile} onHide={handleCloseProfile}>
        <Modal.Body className='d-flex flex-column align-items-center justify-content-center'>
          <Button variant='light' className='d-flex align-items-center mt-4 mb-1' onClick={handleShowProfileSettings}><Image src='/Settings.png' className='me-2' style={{ height: '15px' }}/> Profile settings</Button>
          <Button variant='light' className='d-flex align-items-center my-1' onClick={handleShowPasswordSettings}><Image src='/Settings.png' className='me-2' style={{ height: '15px' }}/> Change password</Button>
          <Button variant='light' className='d-flex align-items-center mt-1 mb-4' onClick={handleShowProfilePictureSettings}><Image src='/Settings.png' className='me-2' style={{ height: '15px' }}/> Change profile picture</Button>
          <Button variant='outline-dark' style={{ borderRadius: '20px' }} onClick={signout}>Sign out</Button>
        </Modal.Body>
      </Modal>

      {/* Modal for profile settings */}
      <Modal show={showProfileSettings} onHide={handleCloseProfileSettings}>
        <Modal.Header>
          <Modal.Title><h5 className='fw-bold'>Profile settings</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateUserForm onProfileUpdate={handleCloseProfileSettings} defaultValues={authStore.user!}/>
        </Modal.Body>
      </Modal>

      {/* Modal for password change */}
      <Modal show={showPasswordSettings} onHide={handleClosePasswordSettings}>
        <Modal.Header>
          <Modal.Title><h5 className='fw-bold'>Change password</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdatePasswordForm onPasswordUpdate={handleClosePasswordSettings} />
        </Modal.Body>
      </Modal>

      {/* Modal for profile picture change */}
      <Modal show={showProfilePictureSettings} onHide={handleCloseProfilePictureSettings}>
        <Modal.Header>
          <Modal.Title><h5 className='fw-bold'>Change profile picture</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProfilePictureModal onProfilePictureUpdate={handleCloseProfilePictureSettings} />
        </Modal.Body>
      </Modal>

      <Modal show={showAuctionForm} onHide={handleCloseAuctionForm}>
        <Modal.Header>
          <Modal.Title><h5 className='fw-bold'>Add auction</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateAuctionForm onAuctionCreate={handleCloseAuctionForm}/>
        </Modal.Body>
      </Modal>
      
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default observer(Navigation)
