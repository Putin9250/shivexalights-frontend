import React from 'react'
import './Home.scss'
import Slider from '../../Components/Slider/Slider'
import FeaturedProducts from '../../Components/FeaturedProducts/FeaturedProducts'
import TrendingProducts from '../../Components/TrandingProducts/TrendingProducts'
import Categories from '../../Components/Categories/Categories'
import Contact from '../../Components/Contact/Contact'

const Home = () => {
  return (
    <div className='home'>
      <Slider />
      <FeaturedProducts type="featured" />
       {/* <FeaturedProducts type="trending" /> */}
      <Categories />
      <TrendingProducts />
      <Contact />
    </div>
  )
}

export default Home