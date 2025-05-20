import { useState } from 'react'
import type { FC, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Row, Col } from 'react-bootstrap'
import { useCreateAuctionForm } from '../Hooks/react-hook-form/Auction/useCreateAuction'
import type { CreateAuctionFields } from '../Hooks/react-hook-form/Auction/useCreateAuction'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'

const CreateAuctionForm: FC = () => {
  const navigate = useNavigate();
  const { handleSubmit, errors, control } = useCreateAuctionForm();
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);

  const handleFileError = () => {
    if (!file) setFileError(true);
    else setFileError(false);
  }

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if(target.files) {
        const myfile = target.files[0]
        setFile(myfile)
    }
  }

  const onSubmit = handleSubmit(async (data: CreateAuctionFields) => {
    if (!file) return
    const response = await API.postAuction(data);

    if (response.data?.statusCode === statusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
        const formData = new FormData();
        formData.append('image', file, file.name);
        const fileResponse = await API.uploadAuctionImage(
            formData,
            response.data.id
        )

        if(fileResponse.data?.statusCode === statusCode.BAD_REQUEST) {
            setApiError(fileResponse.data.message)
            setShowError(true)
        } else if(fileResponse.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR){
            setApiError(fileResponse.data.message)
            setShowError(true)
        } else {
            navigate('/profile/myauctions');
        }
    }
  })

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            onChange={handleFileChange}
            id="image"
            name="image"
            type="file"
            aria-label="Product image"
            aria-describedby="image"
            className={fileError ? 'form-control is-invalid' : 'form-control'}
          />
          {fileError && (
            <div className="d-block invalid-feedback text-danger mb-2">
              Field product image is required
            </div>
          )}
        </Form.Group>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="title">Title</FormLabel>
              <input
                {...field}
                type="title"
                placeholder="Write item name here"
                aria-label="Title"
                aria-describedby="title"
                className={
                  errors.title ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.title && (
                <div className="invalid-feedback text-danger">
                  {errors.title.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                {...field}
                placeholder="Write description here..."
                aria-label="Description"
                aria-describedby="description"
                className={
                  errors.description ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.description && (
                <div className="invalid-feedback text-danger">
                  {errors.description.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Row>
            <Controller
                control={control}
                name="starting_price"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                        <FormLabel htmlFor="starting_price">Starting price</FormLabel>
                        <input
                            {...field}
                            value={field.value ?? ''}
                            placeholder='Price'
                            type="text"
                            aria-label="Price"
                            aria-describedby="price"
                            className={
                                errors.starting_price ? 'form-control is-invalid' : 'form-control'
                            }
                        />
                        {errors.starting_price && (
                            <div className="invalid-feedback text-danger">
                                {errors.starting_price.message}
                            </div>
                        )}
                    </Form.Group>
                )}
            />
            <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                        <FormLabel htmlFor="end_date">End date</FormLabel>
                        <input
                            {...field}
                            value={field.value 
                                ? new Date(field.value).toISOString().split('T')[0]
                                : new Date().toISOString().split('T')[0]
                            }
                            type="date"
                            aria-label="End date"
                            aria-describedby="end date"
                            className={
                                errors.end_date ? 'form-control is-invalid' : 'form-control'
                            }
                        />
                        {errors.end_date && (
                            <div className="invalid-feedback text-danger">
                            {errors.end_date.message}
                            </div>
                        )}
                    </Form.Group>
                )}
            />
        </Row>
        <div>
            <Button type="submit" style={{ borderRadius: '10px' , backgroundColor: '#f4ff47', color: 'black', border: 'none', fontWeight: '600' }}>
                Start auction
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
