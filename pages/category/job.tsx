import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const JobPage: NextPage = () => {
  const island = 'Tenerife'
  const { products, isLoading } = useProducts(`/jobs?island=${ island }`);
  
  return (
    <ShopLayout title={'CanaryFy - Empleo'} pageDescription={'Encuentra empleo en nuestra plataforma'}>
      
      <Typography variant='h1' component='h1'>Ofertas de empleo</Typography>      
      <Typography variant='h2' sx={{ mb: 1 }}>Todas las ofertas de empleo en { island }</Typography>   

      { 
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }

    </ShopLayout>
  )
}

export default JobPage;