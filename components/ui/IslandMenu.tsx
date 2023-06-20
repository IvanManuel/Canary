import { Avatar, Card, CardActionArea, CardMedia, Grid, Typography, Link } from '@mui/material';
import { islands } from '../../utils/islands';
import NextLink from 'next/link';

export const IslandMenu = () => {

    return (
        <>
            <Grid
            container
            sx={{ mt: 20, mb: 5 }} 
            alignItems="center"
            justifyContent="center"
            >
                <Typography 
                    variant='h1' 
                    color="#0f499b" 
                    >Elige tu Isla</Typography>
            </Grid>
            
            <Grid container spacing={2}>
            
                {
                    islands.map(island => (
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            key={ island.id }
                        >
                            <Card>
                                <NextLink href={`/island/${island.path}`} passHref prefetch={false} legacyBehavior>
                                    <Link>
                                        <CardActionArea>
                                            <CardMedia
                                                component='img'
                                                className='fadeIn'
                                                image={island.images}
                                                alt={island.id}
                                            />
                                        </CardActionArea>
                                    </Link>
                                </NextLink>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}
