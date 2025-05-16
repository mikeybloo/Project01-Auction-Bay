import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Row, Col } from 'react-bootstrap'
import { useRegisterForm } from '../../Hooks/react-hook-form/useRegister'
import type { RegisterUserFields } from '../../Hooks/react-hook-form/useRegister'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Controller } from 'react-hook-form'
import { FormLabel } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import * as API from '../../Services/Api'
import { statusCode } from '../../Constants/errorConstants'
import authStore from '../../Stores/auth.store'
import { observer } from 'mobx-react'

const RegisterForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    const response = await API.register(data)

    if (response.data?.statusCode === statusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      const loginResponse = await API.login({
        email: data.email,
        password: data.password,
      });

      if (loginResponse.data?.statusCode === statusCode.BAD_REQUEST) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else if (loginResponse.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else {
        const userResponse = await API.fetchUser()

        if(userResponse.data?.statusCode === statusCode.INTERNAL_SERVER_ERROR) {
            setApiError(userResponse.data.message)
            setShowError(true)
        } else {
            authStore.login(userResponse.data)
            navigate('/profile/myauctions')
        }
      }
    }
  })

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Row>
            <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                    <FormLabel htmlFor="first_name">First name</FormLabel>
                    <input
                        {...field}
                        value={field.value ?? ''}
                        placeholder='First name (optional)'
                        type="text"
                        aria-label="First name"
                        aria-describedby="first_name"
                        className={
                        errors.first_name ? 'form-control is-invalid' : 'form-control'
                        }
                    />
                    {errors.first_name && (
                        <div className="invalid-feedback text-danger">
                        {errors.first_name.message}
                        </div>
                    )}
                    </Form.Group>
                )}
            />
            <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                    <Form.Group as={Col} className="mb-3">
                        <FormLabel htmlFor="last_name">Last name</FormLabel>
                        <input
                            {...field}
                            value={field.value ?? ''}
                            placeholder='Last name (optional)'
                            type="text"
                            aria-label="Last name"
                            aria-describedby="last_name"
                            className={
                            errors.last_name ? 'form-control is-invalid' : 'form-control'
                            }
                        />
                        {errors.last_name && (
                            <div className="invalid-feedback text-danger">
                            {errors.last_name.message}
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
                type="email"
                placeholder="example@gmail.com"
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
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <input
                {...field}
                type="password"
                placeholder="******"
                aria-label="Password"
                aria-describedby="password"
                className={
                  errors.password ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.password && (
                <div className="invalid-feedback text-danger">
                  {errors.password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="confirm_password">Repeat password</FormLabel>
              <input
                {...field}
                type="password"
                placeholder="******"
                aria-label="Confirm password"
                aria-describedby="confirm_password"
                className={
                  errors.confirm_password
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              {errors.confirm_password && (
                <div className="invalid-feedback text-danger">
                  {errors.confirm_password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Button className="w-100 mt-4" type="submit" style={{ backgroundColor: '#f4ff47', color: 'black', border: 'none', fontWeight: '600' }}>
          Sign up
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

export default observer(RegisterForm)
