// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if ( !session ){
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `p=${ requestedPage }`;

        return NextResponse.redirect( url );
    }

//    Información util del usuario
    console.log({ session })

//  return NextResponse.redirect(new URL('/about-2', req.url))
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/checkout/address', '/checkout/summary']
}