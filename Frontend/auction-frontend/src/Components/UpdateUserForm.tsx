import { useState } from 'react'
import type { FC } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useUpdateUserForm } from '../Hooks/react-hook-form/useUpdateUser'
import type { UpdateUserFields } from '../Hooks/react-hook-form/useUpdateUser'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../Services/Api'
import { statusCode } from '../Constants/errorConstants'
import { observer } from 'mobx-react'
import type { UserType } from '../Models/auth'
import authStore from '../Stores/auth.store'

type Props = {
    defaultValues: UserType
    onProfileUpdate: () => void
}

const UpdateUserForm: FC<Props> = ({ defaultValues, onProfileUpdate }) => {
  const { handleSubmit, errors, control } = useUpdateUserForm({
    defaultValues
  });
  const [apiError, setApiError] = useState('');
  const [showError, setShowError] = useState(false);

  const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
    const updateData = {
      name: data.name,
      surname: data.surname,
      email: data.email
    } 
    const response = await API.updateUser(updateData);

    if (response.data?.statusCode === statusCode.BAD_REQUEST) {
      setApiError(response.data.message);
      setShowError(true);
    } else if (response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message);
      setShowError(true);
    } else {
      const userResponse = await API.fetchUser()

      if(userResponse.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
        setApiError(userResponse.data.message)
        setShowError(true)
      } else {
        authStore.login(userResponse.data)
        onProfileUpdate();
      }
    }
  })

  return (
    <>
      <Form className="update-form" onSubmit={onSubmit}>
        <Row>
            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <input
                            {...field}
                            value={field.value ?? ''}
                            placeholder='First name'
                            type="text"
                            aria-label="Name"
                            aria-describedby="name"
                            className={
                                errors.name ? 'form-control is-invalid' : 'form-control'
                            }
                        />
                        {errors.name && (
                            <div className="invalid-feedback text-danger">
                                {errors.name.message}
                            </div>
                        )}
                    </Form.Group>
                )}
            />
            <Controller
                control={control}
                name="surname"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                        <FormLabel htmlFor="surname">Surname</FormLabel>
                        <input
                            {...field}
                            value={field.value ?? ''}
                            placeholder='Last name'
                            type="text"
                            aria-label="Surname"
                            aria-describedby="Last name"
                            className={
                                errors.surname ? 'form-control is-invalid' : 'form-control'
                            }
                        />
                        {errors.surname && (
                            <div className="invalid-feedback text-danger">
                                {errors.surname.message}
                            </div>
                        )}
                    </Form.Group>
                )}
            />
        </Row>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <input
                {...field}
                value={field.value ?? ''}
                type="email"
                placeholder="Enter email"
                aria-label="Email"
                aria-describedby="email"
                className={
                  errors.email ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.email && (
                <div className="invalid-feedback text-danger">
                  {errors.email.message}
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
    </>
  )
}

export default observer(UpdateUserForm)