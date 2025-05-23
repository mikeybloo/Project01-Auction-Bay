import { useEffect, useRef, useState } from 'react'
import type { FC, ChangeEvent } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useUpdateAuctionForm } from '../Hooks/react-hook-form/Auction/useUpdateAuction'
import type { UpdateAuctionFields } from '../Hooks/react-hook-form/Auction/useUpdateAuction'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'
import type { AuctionType } from '../Models/auction'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
    defaultValues?: AuctionType
    onAuctionUpdate: () => void
}

const UpdateAuctionForm: FC<Props> = ({ defaultValues, onAuctionUpdate }) => {
  const queryClient = useQueryClient();
  const { handleSubmit, errors, control } = useUpdateAuctionForm({
    defaultValues,
  });
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
    if(preview){
        setPreview(undefined)
    }
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

  useEffect(() => {
    console.log(`Default value.image: ${defaultValues?.image}`);
    if (defaultValues?.image) {
        console.log(`Setting image preview to: ${import.meta.env.VITE_API_URL}/files/${defaultValues.image}`);
        setPreview(`${import.meta.env.VITE_API_URL}/files/${defaultValues.image}`);
    } else {
        console.log('No image found. Setting to undefined')
        setPreview(undefined);
    }
  }, [defaultValues?.image]);

  const updateAuctionMutation = useMutation(
    async (updateData: { title: string; description: string; end_date: Date }) => {
        const response = await API.updateAuction(updateData, defaultValues!.id);
        
        if(file) {
            const formData = new FormData();
            formData.append('image', file, file.name);
            const fileResponse = await API.uploadAuctionImage(
                formData,
                response.data.id
            )
        }

        return response.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchAuctions']);
            onAuctionUpdate();
        },
        onError: (error: any) => {
            setApiError(error.message || 'Update failed');
            setShowError(true);
        }
    }
  )

  const onSubmit = handleSubmit((data) => {
    updateAuctionMutation.mutate({
        title: data.title,
        description: data.description,
        end_date: data.end_date
    });
  });

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          {preview ? (
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
                Update auction
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

export default observer(UpdateAuctionForm)
