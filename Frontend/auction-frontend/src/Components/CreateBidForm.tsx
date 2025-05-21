import { useState } from 'react'
import type { FC } from 'react'
import { Form } from 'react-bootstrap'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'
import { useCreateBidForm, type CreateBidFields } from '../Hooks/react-hook-form/useCreateBid'
import type { AuctionType } from '../Models/auction'

type Props = {
    auction: AuctionType
    onBidSuccess?: () => void
}

const BidForm: FC<Props> = ({ auction, onBidSuccess }) => {
  const { handleSubmit, errors, control } = useCreateBidForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const onSubmit = handleSubmit(async (data: CreateBidFields) => {
    const response = await API.postBid(data, auction.id)

    if (response.data?.statusCode === statusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
    } else if (response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowError(true)
    } else {
        onBidSuccess?.()
    }
  })

  return (
    <>
      <Form className="form d-flex align-items-end gap-2 mb-0" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="offer"
          render={({ field }) => (
            <Form.Group className='d-flex align-items-end gap-2 mb-0' style={{ display: 'flex', height: '38px' }}>
              <FormLabel htmlFor="offer" style={{ fontSize: '17px', marginBottom: 0, lineHeight: '1', display: 'flex', alignItems: 'center' }}>Bid: </FormLabel>
              <input
                {...field}
                type="text"
                placeholder="0"
                aria-label="Offer"
                aria-describedby="offer"
                className={
                  errors.offer ? 'form-control is-invalid' : 'form-control'
                }
                style={{ borderRadius: '15px', width: '75px', height: '38px' }}
              />
              {errors.offer && (
                <div className="invalid-feedback text-danger">
                  {errors.offer.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Button type="submit" style={{ backgroundColor: '#f4ff47', color: 'black', border: 'none', fontWeight: '600', height: '38px', borderRadius: '15px' }}>
          Place bid
        </Button>
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

export default observer(BidForm)
