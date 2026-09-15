import CreditBridgeWorks from '@/components/CreditBridgeWorks'
import Footer from '@/components/Footer'
import ForIndividualsSection from '@/components/ForIndividualsSection'
import Hero from '@/components/Hero'
import ImageFeatures from '@/components/imagefeatures'
import NewsLetter from '@/components/NewsLetter'
import ProblemSection from '@/components/ProblemSection'
import Testimonails from '@/components/Testimonails'
import TrustedBrand from '@/components/TrustedBrand'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero/>
       <TrustedBrand/>
       <ProblemSection/>
       <CreditBridgeWorks/>
       <ForIndividualsSection/>
       <ImageFeatures/>
       <Testimonails/>
       <NewsLetter/>
      <Footer/>
     
    </div>
  )
}

export default page