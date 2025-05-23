import { useEffect, useRef, useState } from 'react'
import type { FC, ChangeEvent } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'
import authStore from '../Stores/auth.store'

type Props = {
    onProfilePictureUpdate: () => void
}

const CreateAuctionForm: FC<Props> = ({ onProfilePictureUpdate }) => {
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>('');
  //const [fileError, setFileError] = useState(false);

  useEffect(() => {
    if(authStore.user?.avatar == null){
        setPreview("/Default_User.png");
    } else {
        setPreview(authStore.user?.avatar);
    }
  }, [authStore.user?.avatar])

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if(target.files) {
        const myfile = target.files[0]
        setFile(myfile)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    if(!file) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('submitting file');
    
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file, file.name);
    const fileResponse = await API.uploadAvatar(formData);
    console.log('i sent that shit');

    if (fileResponse.data?.statusCode === statusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message);
        setShowError(true);
    } else if (fileResponse.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
        setApiError(fileResponse.data.message);
        setShowError(true);
    } else {
      const user = await API.fetchUser()
      authStore.login(user.data);
      onProfilePictureUpdate();
    }
};

  console.log(file)

  return (
    <>
      <Form className="update-form d-flex flex-column align-items-center" onSubmit={onSubmit}>
        <img src={preview} className='mt-3' style={{ width: '50px', height: '50px', borderRadius: '15px' }}/>
        <Form.Control
            onChange={handleFileChange}
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            aria-label="Product image"
            aria-describedby="image"
            className='form-control'
            style={{ display: 'none' }}
        />
        <Button variant="outline-dark" className='my-3' style={{ borderRadius: '15px' }} onClick={handleFileClick}>Upload new picture</Button>
        <div>
            <Button type="submit" style={{ borderRadius: '10px' , backgroundColor: '#f4ff47', color: 'black', border: 'none', fontWeight: '600' }}>
                Save changes
            </Button>
        </div>
      </Form>
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

export default observer(CreateAuctionForm)
