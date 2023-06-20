
import NextLink from 'next/link';
import useSWR from 'swr';
import { AddOutlined, WorkOutline } from '@mui/icons-material'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AdminLayout } from '@/components/layouts'
import { IJob } from '@/interfaces';


const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Foto',
        renderCell: ({ row }: GridRenderCellParams ) => {
            return (
                <a href={ `/job/${ row.id }` } target="_blank" rel="noreferrer" >
                    <CardMedia 
                        component='img'
                        alt={ row.title }
                        className='fadeIn'
                        image={ row.img }
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Título', 
        width: 250,
        renderCell: ({ row }: GridRenderCellParams ) => {
            return (
                <NextLink
                    href={`/admin/jobs/${ row.id }`}
                    passHref
                >
                    <Link
                        underline='always'
                    >
                        { row.title }
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'island', headerName: 'Isla' },
    { field: 'city', headerName: 'Ciudad' },
    { field: 'cellPhone', headerName: 'Teléfono' },
    { field: 'email', headerName: 'Correo' },
    { field: 'view', headerName: 'Vistas', width: 250 }

];

const JobsPage = () => {

    const { data, error } = useSWR<IJob[]>('/api/admin/jobs');

    if ( !data && !error ) return (<></>);

    const rows = data!.map( job => ({
        id:              job._id,
        shortDescription:job.shortDescription,
        longDescription: job.longDescription,
        img:             job.images[0],
        view:            job.view,
        cellPhone:       job.cellPhone,
        email:           job.email,
        slug:            job.slug,
        island:          job.island,
        city:            job.city,
        tags:            job.tags,
        title:           job.title,
    }))

    return (
        <AdminLayout
            title={`Empleos (${ data?.length })`}
            subTitle={'Mantenimiento de empleos'}
            icon={<WorkOutline />}
        >
            <Box
                display='flex'
                justifyContent='end'
                sx={{ mb: 2 }}
            >
                <Button
                    startIcon={ <AddOutlined />}
                    color="secondary"
                    href='/admin/jobs/new'
                >
                    Agregar Empleo
                </Button>
            </Box>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                    //                        pageSize={10}
                    //                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default JobsPage;