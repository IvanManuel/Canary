import type { NextPage } from 'next';
import { Divider, Typography, Box } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
// import { initialData } from '../database/products';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading, IslandMenu } from '@/components/ui';

const IslandPage: NextPage = () => {

  const { products, isLoading } = useProducts('jobs');
  
  return (
    <ShopLayout title={'CanaryFy - Home'} pageDescription={'Encuentra toda la información sobre las Islas Canarias, CanaryFy canarias para tí, canarias for you'}>

      <IslandMenu />

    </ShopLayout>
  )
}

export default IslandPage;