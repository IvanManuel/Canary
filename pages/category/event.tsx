import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
// import { initialData } from '../database/products';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const EventPage: NextPage = () => {
  const island = 'Tenerife'
  const { products, isLoading } = useProducts(`/events?island=${ island }`);
  
  return (
    <ShopLayout title={'CanaryFy - Eventos'} pageDescription={'Disfruta de los mejores eventos'}>
      
      <Typography variant='h1' component='h1'>Eventos</Typography>      
      <Typography variant='h2' sx={{ mb: 1 }}>Las mejores actividades, viajes y eventos en { island }</Typography>   

      { 
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}

export default EventPage;