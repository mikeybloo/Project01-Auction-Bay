import { useEffect, useRef, useState } from 'react'
import type { FC, ChangeEvent } from 'react'
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
import { useMutation, useQueryClient } from 'react-query'

type Props = {
    onAuctionCreate: () => void
}

const CreateAuctionForm: FC<Props> = ({ onAuctionCreate }) => {
  const queryClient = useQueryClient();
  const { handleSubmit, errors, control } = useCreateAuctionForm();
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>('');
  //const [fileError, setFileError] = useState(false);

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if(target.files) {
        const myfile = target.files[0]
        setFile(myfile)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click();
  }

  const handleRemoveFile = () => {
    setFile(null)
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

  const createAuctionMutation = useMutation(
    async (data: CreateAuctionFields) => {
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

            return response.data;
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchAuctions']);
            queryClient.invalidateQueries(['fetchMyAuctions']);
            onAuctionCreate();
        },
        onError: (error: any) => {
            setApiError(error.message || 'Auction creation failed');
            setShowError(true);
        }
    }
  )

  const onSubmit = handleSubmit(async (data: CreateAuctionFields) => {
    createAuctionMutation.mutate(data);
  })

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          {file ? (
            <div style={{ position: 'relative' }}>
              <img src={preview} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '15px' }}/>
              <Button onClick={handleRemoveFile} variant="dark" style={{ position: 'absolute', top: '8px', right: '8px', }}><img src="/Trash.png" style={{ height: '15px' }}></img></Button>
            </div>
          ) : (
            <>
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
              <div style={{ width: '100%', height: '150px', backgroundColor: '#f6f6f4', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="outline-dark" style={{ borderRadius: '15px' }} onClick={handleFileClick}>Add image</Button>
              </div>
            </>
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
