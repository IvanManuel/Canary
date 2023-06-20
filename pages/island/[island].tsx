import type { NextPage } from 'next';
import { Divider, Typography, Box, Grid, CardContent } from '@mui/material';

import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';

import { FullScreenLoading, PanelMenu } from '@/components/ui';
import { ShopLayout } from '@/components/layouts';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Link from 'next/link';
import { stringify } from 'querystring';
import { useState, useEffect } from 'react';


const HomePage: NextPage = () => {

  const { query } = useRouter();
  
  const [category, setCategories] = useState('jobs');
  const { products: categories, isLoading: categoriesLoading } = useProducts(`/${ category }?${ stringify(query) }`);

  const onSelectCategory = (newCategory: string) => {
    setCategories(newCategory)
  }

  return (
    <ShopLayout title={'CanaryFy - Home'} pageDescription={'Encuentra toda la información sobre las Islas Canarias, CanaryFy canarias para tí, canarias for you'}>

      <Grid 
        container
        
        >
          <PanelMenu onNewCategory={ onSelectCategory } />

        {/* Empleo */}
        <Grid 
          container
          alignItems="center"
          justifyContent="center"
          >

        <Typography variant='h1' sx={{ mt: 5, mb: 5 }}>{ category === 'courses' ? `Cursos en ${ query.island }` : null }</Typography>
        <Typography variant='h1' sx={{ mt: 5, mb: 5 }}>{ category === 'jobs' ? `Empleo en ${ query.island }` : null }</Typography>
        <Typography variant='h1' sx={{ mt: 5, mb: 5 }}>{ category === 'events' ? `Eventos en ${ query.island }` : null }</Typography>

          {
            categoriesLoading
              ? <FullScreenLoading />
              : <ProductList products={categories} />
          }

        </Grid>


      </Grid>

    </ShopLayout>
  )
}

export default HomePage;
