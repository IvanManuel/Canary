
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { Box, Grid, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';

import { CartContext } from '../../context/cart/CartContext';
import { ShopLayout } from "@/components/layouts"
import { ProductSlideshow } from "@/components/products";
import { ItemCounter } from "@/components/ui";

import { dbJobs, dbProducts } from '@/database';
import { ICartProduct, ISize, IJob } from '../../interfaces';
import { FavoriteBorderOutlined, LocationOnOutlined, ShareOutlined, WhatsApp, Mail } from '@mui/icons-material';


interface Props {
  job: IJob
}

const ProductPage: NextPage<Props> = ({ job }) => {

  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  const { images, shortDescription, title, longDescription, city, island, createdAt, cellPhone, email } = job;

{/* Para el agregar a favoritos
  const [tempCartProduct, setTempCartProduct] = useState<IJob>({
    _id:             job._id,
    shortDescription:job.shortDescription,
    longDescription: job.longDescription,
    images:          strngjobs.images,
    view:            job.view,
    cellPhone:       job.cellPhone,
    email:           job.email,
    slug:            job.slug,
    island:          job.island,
    city:            job.city,
    tags:            job.tags,
    title:           job.title,
  })
*/}

  return (
    <ShopLayout title={ title } pageDescription={ shortDescription }>
      <Grid 
        container 
        spacing={3} 
        alignItems="center"
        justifyContent="center"
        >

        <Grid item xs={12} sm={5}>
          <ProductSlideshow
            images={ images }
          />

        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/* Títulos */}


            <Typography><LocationOnOutlined /> { island } - { city }</Typography>

            <Typography sx={{ mt: 1 }} fontSize={14}>Creado el: { createdAt.substring(0, 10) }</Typography>

            {/* Agregar a favoritos */}
            <Grid container>
            <Typography variant="h1" component="h1">{ title }</Typography>
            <IconButton aria-label="add to favorites">
              <FavoriteBorderOutlined />
            </IconButton>
            </Grid>

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography paragraph>{ shortDescription}</Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Detalle</Typography>
              <Typography paragraph>{ longDescription }</Typography>
            </Box>

          </Box>

          <Grid container>
          <IconButton aria-label="add to favorites">
            <Typography variant="h2" >Compartir</Typography>
              <ShareOutlined />
            </IconButton>
            </Grid>

            <Grid>
            <IconButton aria-label="llamar">
              <WhatsApp />
              <Typography sx={{ ml: 1 }}>
                { cellPhone }
              </Typography>
            </IconButton>
            </Grid>
            <IconButton aria-label="email">
              <Mail />
              <Typography sx={{ ml: 1 }}>
                { email }
              </Typography>
            </IconButton>
        </Grid>

      </Grid>

    </ShopLayout>
  )
}

{/*  No usar esto Server Side Rendering SSR */ }
//// You should use getServerSideProps when:
//// - Only if you need to pre-render a page whose data must be fetched at request time
//
//export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//  
//  const { slug } = params as { slug: string }
//  const product = await dbProducts.getProductBySlug( slug );
//
//  if( !product ) {
//    return {
//      redirect: {
//        destination: '/',
//        permanent: false
//      }
//    }
//  }
//
//  return {
//    props: {
//      product
//    }
//  }
//}
//

// getStaticPaths
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const jobsIds = await dbJobs.getAllJobIds();

  return {
    paths: jobsIds.map(({ _id: string }) => ({
      params: {
        _id: string
      }
    })),
    fallback: "blocking"
  }
}

// getStaticProps
// revalidar cada 24horas
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { _id = '' } = params as { _id: string }
  const job = await dbJobs.getJobById( _id );

  if (!job) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      job
    },
    revalidate: 86400 //Revalidación para que el getStaticProps genere de nuevo las páginas
  }
}

export default ProductPage