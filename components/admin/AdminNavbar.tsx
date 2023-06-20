import NextLink from "next/link";
import { useContext } from "react";

import { AppBar, Box, Button,  Link, Toolbar, Typography } from "@mui/material";
import { UiContext } from "@/context";


export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant="h6" >Canary</Typography>
                        <Typography sx={{ ml: 0.5 }}>Fy</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Button
                    onClick={toggleSideMenu}
                >
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}