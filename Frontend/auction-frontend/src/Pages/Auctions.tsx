import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, type FC } from 'react'
import Layout from '../Components/Layout'
import { useQuery } from 'react-query'
import * as API from '../Services/Api'
import type { AuctionType } from '../Models/auction'
import { Col, Row, Toast, ToastContainer } from 'react-bootstrap'
import AuctionCard from '../Components/AuctionCard'
import authStore from '../Stores/auth.store'

const Auctions: FC = () => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)

    const { data, isLoading, isError, error } = useQuery(
        ['fetchAuctions', pageNumber],
        () => API.fetchAuctions(pageNumber),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            onError: (err) => {
                setApiError((err as Error).message)
                setShowError(true)
            },
            onSuccess: () => {
                setShowError(false)
                setApiError('')
            }
        },
    )

    return (
        <Layout>
            <h2 className='fw-bold'>Auctions</h2>
            {isLoading ? (
                <div>Loading auctions...</div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Row className='g-5 p-4'>
                        {Array.isArray(data?.data) && data?.data.map((auction: AuctionType) => (
                            <Col xs={12} sm={6} md={4} lg={2} key={auction.id}>
                                <AuctionCard auction={auction} user={authStore.user}/>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </Layout>
    )
}

export default Auctions
