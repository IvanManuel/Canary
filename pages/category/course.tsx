import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
// import { initialData } from '../database/products';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const CoursePage: NextPage = () => {
  const island = 'Tenerife'
  const { products, isLoading } = useProducts(`/courses?island=${ island }`);
  
  return (
    <ShopLayout title={'CanaryFy - Lugares'} pageDescription={'Lugares que no te puedes perder'}>
      
      <Typography variant='h1' component='h1'>Cursos de formación profesional</Typography>      
      <Typography variant='h2' sx={{ mb: 1 }}>Todas las ofertas para la formación en { island }</Typography>    

      { 
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}

export default CoursePage;