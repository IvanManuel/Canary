
import { Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { DashboardOutlined, CreditCardOutlined, AttachMoneyOutlined, CreditCardOffOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { SummaryTile } from '@/components/admin';
import { DashboardSummaryResponse } from '../../interfaces/dashboard';
import { useState, useEffect } from 'react';

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 segundos
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 )
    }, 1000 );
  
    return () => clearInterval( interval );
  }, [])
  

  if ( !error && !data){
    return <></>
  }

  if ( error ){
    console.log(error);
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    ProductsWithNoInventory,
    lowInventory,
    noPaidOrders,
  } = data;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadísticas generales'
      icon={<DashboardOutlined />}
    >

      <Grid container spacing={2}>

        <SummaryTile 
              title={ numberOfOrders } 
              subTitle='Órdenes totales' 
              icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />} 
              />

        <SummaryTile 
              title={ paidOrders } 
              subTitle='Órdenes pagadas' 
              icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} 
              />

        <SummaryTile 
              title={ noPaidOrders } 
              subTitle='Órdenes pendientes' 
              icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />} 
              />

        <SummaryTile 
              title={ numberOfClients } 
              subTitle='Clientes' 
              icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} />} 
              />

        <SummaryTile 
              title={ numberOfProducts } 
              subTitle='Productos' 
              icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} 
              />

      <SummaryTile 
              title={ ProductsWithNoInventory } 
              subTitle='Sin existencia' 
              icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} 
              />

      <SummaryTile 
              title={ lowInventory } 
              subTitle='Bajo inventario' 
              icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} 
              />

      <SummaryTile 
              title={ refreshIn } 
              subTitle='Actualización en: ' 
              icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />} 
              />

      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage