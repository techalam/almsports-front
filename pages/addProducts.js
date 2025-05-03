import AddProductsToCatalouge from '@/components/catalouge/addProductsToCatalouge'
import { useRouter } from 'next/router';
import React from 'react'

export default function Catalogues() 
{ 
  const router = useRouter();
  const { selectedCollection } = router.query;
  return (
    <AddProductsToCatalouge selectedCollection={selectedCollection}/>
  )
}
