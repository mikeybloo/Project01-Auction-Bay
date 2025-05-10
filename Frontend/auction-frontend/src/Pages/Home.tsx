import type { FC } from 'react'
import Layout from '../Components/Layout'

const Home: FC = () => {
  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
            <h1 className="display-5 fw-bold">Welcome to the HOME of the Auction App</h1>
        </div>
      </div>
    </Layout>
  )
}

export default Home
