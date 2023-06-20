import NextLink from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { AppBar, Badge, Box, Button, CardMedia, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import { ArrowBackOutlined, WorkOutline, ClearOutlined, SearchOutlined, ShoppingCartOutlined, SchoolOutlined, StadiumOutlined } from '@mui/icons-material';
import { CartContext, UiContext } from "@/context";

export const Navbar = () => {

    const { asPath, push } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    }

    return (
        <AppBar >
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <CardMedia
                            sx={{ mt: 5, maxHeight: 100, maxWidth: 200 }}
                            component='img'
                            className="fadeIn"
                            image={'/islands/CanaryfyVertical.png'}
                            alt={'logo'}
                        />
                        {/*
                        <Typography variant="h6" >Canary</Typography>
                        <Typography>Fy</Typography>
    */}
                    </Link>
                </NextLink>

                <Box flex={1} />

                {
                    /*
<Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className='fadeIn'
                >
                    <NextLink href='/category/course' passHref legacyBehavior>
                        <Link>
                        <IconButton>
                            <SchoolOutlined />
                            <Button color={asPath === '/category/course' ? 'primary' : 'info'}>Cursos</Button>
                            </IconButton>
                        </Link>
                    </NextLink>

                    <NextLink href='/category/job' passHref legacyBehavior>
                        <Link>
                            <IconButton>
                            <WorkOutline />
                            <Button color={asPath === '/category/job' ? 'primary' : 'info'}>Empleo</Button>
                            </IconButton>
                        </Link>
                    </NextLink>

                    <NextLink href='/category/event' passHref legacyBehavior>
                        <Link>
                            <IconButton>
                            <StadiumOutlined />
                            <Button color={asPath === '/category/event' ? 'primary' : 'info'}>Eventos</Button>
                            </IconButton>
                        </Link>
                    </NextLink>
                </Box>
                    */
                }

                <Box flex={1} />

                {/* Pantallas grandes 
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className="fadeIn"
                                autoFocus
                                value={searchTerm}
                                onChange={ (e) => setSearchTerm(e.target.value) }
                                onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={ () => setIsSearchVisible(false) }
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                onClick={ () => setIsSearchVisible(true) }
                                className='fadeIn'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                */}

                {/* Pantallas pequeñas 
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button
                    onClick={toggleSideMenu}
                >
                    Menú
                </Button>
                */}
                <NextLink href='/' passHref legacyBehavior>
                    <Link>
                            {
                                asPath === '/' ? null : 
                                (
                                    <IconButton>
                                        <ArrowBackOutlined />
                                    <Typography>Volver</Typography>
                                    </IconButton>
                            )}
                    </Link>
                </NextLink>

            </Toolbar>
        </AppBar>
    )
}