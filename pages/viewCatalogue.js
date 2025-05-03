import ViewCatalogue from '@/components/catalouge/ViewCatalogue'
import { useRouter } from 'next/router';
import React from 'react'

const viewCatalogue = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <ViewCatalogue id={id}/>
  )
}

export default viewCatalogue