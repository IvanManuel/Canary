import { Button, IconButton, Card, CardActions, CardMedia, Grid, Typography } from '@mui/material';
import { SchoolOutlined, StadiumOutlined, WorkOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';

export const PanelMenu = ({ onNewCategory }) => {

    const { query } = useRouter();

    const onSelect = ( category: string ) => {
        console.log('CATEGORY', category)
        onNewCategory( category )
    }

    //const onSelect = (event) => {
      //  setInputValue(event.target.value)

    return (
        < >
            <Typography variant='h1' color="#0f499b" sx={{ mt: 8, mb: 5 }}>Selecciona lo que buscas en { query.island }</Typography>
            <Grid 
                container 
                spacing={2}
                alignItems="center"
                justifyContent="center"
                >

                <Grid
                    item
                    sm={3}
                >

                    <IconButton
                        onClick={ () => onSelect( 'courses' ) }
                    >
                        <SchoolOutlined sx={{ fontSize: 70 }} />
                        <Typography variant='h1' component='h1' sx={{ mt: 2 }}>Cursos</Typography>
                        </IconButton>

                </Grid>
                <Grid
                    item
                    sm={3}
                >

                    <IconButton
                        onClick={ () => onSelect( 'jobs' ) }
                    >
                        <WorkOutline sx={{ fontSize: 70 }} />
                        <Typography variant='h1' component='h1' sx={{ mt: 2 }}>Empleos</Typography>
                    </IconButton>

                </Grid>
                <Grid
                    item
                    sm={3}
                >

                    <IconButton
                        onClick={ () => onSelect( 'events' ) }
                    >
                        <StadiumOutlined sx={{ fontSize: 70 }} />
                        <Typography variant='h1' component='h1' sx={{ mt: 2 }}>Eventos</Typography>
                    </IconButton>

                </Grid>

            </Grid>
        </>
    )
}
