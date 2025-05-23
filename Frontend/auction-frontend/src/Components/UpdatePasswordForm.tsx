import { useState } from 'react'
import type { FC } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useUpdatePasswordForm } from '../Hooks/react-hook-form/useUpdatePassword'
import type { UpdatePasswordFields } from '../Hooks/react-hook-form/useUpdatePassword'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'
import authStore from '../Stores/auth.store'

type Props = {
    onPasswordUpdate: () => void
}

const UpdatePasswordForm: FC<Props> = ({ onPasswordUpdate }) => {
  const { handleSubmit, errors, control } = useUpdatePasswordForm();
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const [showWarning, setShowWarning] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const onSubmit = handleSubmit(async (data: UpdatePasswordFields) => {
    console.log(JSON.stringify(data));
    const response = await API.updateUserPassword(data);

    if (response.data?.statusCode === statusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
        setShowWarning(true);
        
        await delay(1500);

        await API.signout();
        authStore.signout();
    }
  })

  return (
    <>
      <Form className="update-form" onSubmit={onSubmit}>
        <Controller
            control={control}
            name="currentPassword"
            render={({ field }) => (
                <Form.Group as={Col} className="mb-3">
                    <FormLabel htmlFor="currentPassword">Current password</FormLabel>
                    <input
                        {...field}
                        value={field.value ?? ''}
                        type="password"
                        aria-label="Current password"
                        aria-describedby="Current password"
                        className={
                            errors.currentPassword ? 'form-control is-invalid' : 'form-control'
                        }
                    />
                    {errors.currentPassword && (
                        <div className="invalid-feedback text-danger">
                            {errors.currentPassword.message}
                        </div>
                    )}
                </Form.Group>
            )}
        />
        <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
                <Form.Group as={Col} className="mb-3">
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <input
                        {...field}
                        value={field.value ?? ''}
                        type="password"
                        aria-label="New password"
                        aria-describedby="New password"
                        className={
                            errors.newPassword ? 'form-control is-invalid' : 'form-control'
                        }
                    />
                    {errors.newPassword && (
                        <div className="invalid-feedback text-danger">
                            {errors.newPassword.message}
                        </div>
                    )}
                </Form.Group>
            )}
        />
        <Controller
          control={control}
          name="confirmNewPassword"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="confirmNewPassword">Repeat new password</FormLabel>
              <input
                {...field}
                value={field.value ?? ''}
                type="password"
                aria-label="Confirm New Password"
                aria-describedby="Confirm New Password"
                className={
                  errors.confirmNewPassword ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.confirmNewPassword && (
                <div className="invalid-feedback text-danger">
                  {errors.confirmNewPassword.message}
                </div>
              )}
            </Form.Group>
          )}
        />
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
      {showWarning && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowWarning(false)} show={showWarning}>
            <Toast.Header>
              <strong className="me-suto text-warning">Warning</strong>
            </Toast.Header>
            <Toast.Body className="text-warning bg-light">You will be logged out shortly...</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default observer(UpdatePasswordForm)