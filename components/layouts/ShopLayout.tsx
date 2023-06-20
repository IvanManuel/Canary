import { FC } from "react";

import Head from "next/head"
import { Navbar, SideMenu } from "../ui";


interface Props {
    children: React.ReactNode;
    title: string;
    pageDescription: string;
    ImageFullUrl?: string;
}

export const ShopLayout:FC<Props> = ({ children, title, pageDescription, ImageFullUrl }) => {
  return (
    <>
        <Head>
            <title>{ title }</title>
            <meta name="description" content={ pageDescription } />

            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />

            {
                ImageFullUrl && (
                    <meta name="og:image" content={ ImageFullUrl } />
                )
            }
        </Head>

        <nav>
            <Navbar />
        </nav>

        <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        <footer>
        { /* TODO: my custom footer  */}
        </footer>
    </>
  )
}

