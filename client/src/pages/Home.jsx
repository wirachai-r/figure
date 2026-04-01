import React from 'react'
import ContentCarousel from '../components/home/ContentCarousel'
import NewProduct from '../components/home/NewProduct'
import BestSeller from '../components/home/BestSeller'

const Home = () => {
    return (
        <>
            <div><ContentCarousel /></div>
            <div><NewProduct /></div>
            <div><BestSeller /></div>
        </>
    )
}

export default Home