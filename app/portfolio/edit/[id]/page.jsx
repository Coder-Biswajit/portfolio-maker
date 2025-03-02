import React from 'react'
import PortfolioForm from '../../components/PortfolioForm'

const page = async ({params}) => {
    const id = await params.id;
  return (
    <PortfolioForm id={id}/>
  )
}

export default page
