import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, type FC } from 'react'
import Layout from '../Components/Layout'
import { useQuery } from 'react-query'
import * as API from '../../Services/Api'

const Auctions: FC = () => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)

    // const { data, isLoading, refetch } = useQuery(
    //     ['fetchAuctions', pageNumber],
    //     () => 
    // )

    return (
        <Layout>
            <h1 className='fw-bold'>Auctions</h1>
        </Layout>
    )
}

export default Auctions
